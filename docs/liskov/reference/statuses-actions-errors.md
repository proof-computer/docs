---
title: Statuses, actions, and errors
description: Canonical customer posture, runtime evidence reasons, Action Plan vocabulary, publication diagnostics, and retirement phases.
---

# Statuses, actions, and errors

Use the highest-level stable field that answers the question. Application
posture is a read-time customer summary; it is not persisted as an executor
transition and must not be used as proof that one detailed event occurred.

## Application posture

| `category` | Tone | `actionable` | Meaning |
| --- | --- | --- | --- |
| `ready` | `ok` | false | Positive current runtime-ready evidence satisfies desired state. |
| `in_progress` | `warn` | false | Normal progress, observation, recovery, or an evidence state without a customer action. |
| `needs_action` | `danger` | true | The Application has a current organization Action Plan Hold that still needs a customer decision. |
| `inactive` | `idle` | false | Draft, paused, disabled, retiring/retired, or otherwise inactive. |

`needs_action` and `actionable: true` are served only for a current `funds` or
`app_fault` Hold whose release has not been requested. A Hold with
`pendingRelease: true`, an `intent` stop, and platform recovery do not make an
Application actionable. Retiring, retired, and deleted Applications are always
`inactive`.

The object also includes:

| Field | Meaning |
| --- | --- |
| `reason` | Stable token; use it in automation. |
| `label` | Human wording for `reason`. |
| `state` | Coarse health: `active`, `waiting`, `degraded`, `paused`, or `complete`. |
| `evidence` | Which facts decided the posture: `lifecycle`, `deployment`, or `execution`. |

`state` and `category` answer different questions. `state: degraded` means
required capacity is short or placement is blocked; it does not say who acts.
An `in_progress` Application can be `degraded` with `actionable: false`, and a
`needs_action` Application can be `active`.

Common reasons:

| Reason | Interpretation |
| --- | --- |
| `runtime_ready` | Required runtime capability evidence is ready. |
| `active_without_deployment` | Active intent exists; no deployment is yet visible. |
| `deployment_launching` | Submission or assignment work is advancing. |
| `deployment_claimed` | Processor claim exists; runtime contact is still awaited. |
| `runtime_configuring` | Bootstrap/configuration is advancing. |
| `runtime_awaiting_contact` | No current signed runtime contact yet. |
| `runtime_restarting` | Same job is within restart grace. |
| `runtime_contact_degraded` | Contact is delayed but not declared lost. |
| `runtime_contact_lost` | Expected contact was not observed. |
| `runtime_start_timed_out` | First contact exceeded its boundary. |
| `runtime_fatal_reported` | The runtime signed a terminal application diagnostic. |
| `runtime_evidence_disagrees` | Independent evidence sources disagree; do not guess. |
| `deployment_awaiting_replacement` | Earlier deployment ended; successor evidence is awaited. |
| `deployment_platform_uncertainty` | Label **Liskov checking deployment**. A deployment stopped without a customer Hold; Liskov owns it. `in_progress`, not actionable. |
| `execution_launching`, `execution_submitted` | The current execution's launch is being prepared or awaits a processor. |
| `execution_reconcile_required` | Label **Liskov checking launch**. Liskov has not yet confirmed a provider launch and reconciles it on its own. `in_progress`, not actionable, and possibly `degraded`. Do not resubmit. |
| `execution_running` | The current execution is running. |
| `execution_settling` | The current execution is closing out or settling. |
| `execution_complete` | The run finished and settled; `inactive`. |
| `customer_funds_hold` | Label **Add funds**. A current `funds` Hold needs a decision. |
| `customer_app_fault_hold` | Label **Review application failure**. A current `app_fault` Hold needs a decision. |
| `application_draft`, `application_paused` | Inactive authored/lifecycle state. |
| `application_retiring`, `application_retired` | Retirement lifecycle; never actionable. |

Unknown active detail maps to `in_progress`/`unknown_active_state`, not `ready`.

## Action Plan vocabulary

The Console **organization Action Plan** lists only Holds: work Liskov has
stopped on. Causes are `intent` (you stopped it), `funds` (authorised cap), and
`app_fault` (signed runtime/application or delivery evidence). `app_fault` does
not assert that the workload, artifact, or policy changed: inspect
`failureStage` and `failureCode`. `platform` never appears as a customer
decision. Work Liskov is still retrying is withheld. An eligible new bootstrap
hold can disappear after stronger signed Ready evidence arrives.

Each V5 hold carries `holdId`, `stateRevision`, stable slot/generation, failure
stage/code, `pendingRelease`, and server-owned `actions`. `release_hold` posts
the exact hold ID to the hold-release route. `pause_application` and
`resume_application` post to the lifecycle status route and never imply a hold
release. `holdCount` counts held slots; `applicationCount` counts distinct
Applications.

`pendingRelease: true` means the release was received and Liskov applies it on
its next pass. The Console counts it under **Release requested**, not
**Decisions owed**, and it does not make the Application `needs_action`.

Each Hold names one cause. Its server-owned controls distinguish releasing one
held slot from pausing or resuming the whole Application. The Console groups
Holds under their Application and adds one line of static guidance per cause;
the full per-code next action stays on the execution detail.

The read also serves these optional fields:

| Field | Meaning |
| --- | --- |
| `stoppedAtMs` | On each Hold: when the job stopped, in Unix milliseconds. Absent on V4 rows, which have no time. The Console shows it as **Held since** or **Stopped since**. |
| `releaseRequestedAtMs` | On each Hold: when its release was requested. Present exactly when `pendingRelease` is `true`. |
| `truncated` | On the response: `true` when the read stopped at 100 stopped jobs and more may exist. The Console then shows **100+** decisions owed. |

A resume through the lifecycle status route can be refused with these
`error` codes. None of them changes anything:

| Code | Meaning / response |
| --- | --- |
| `organization_over_plan_caps` | The code carries `feature`, `used`, and `limit`. `max_applications` means too many Applications: [retire enough Applications](../troubleshooting/billing-retirement.md#organization-is-over-its-application-cap) to bring `used` within `limit`; pausing one does not free an Application slot. `organization_job_slots` means too many [job slots](../operate/pause-resume.md#job-slots): lower `deployment.jobs` and publish, pause or retire Applications, or move to a plan with a larger pool. |
| `organization_plan_caps_unavailable` | Liskov could not read the plan's caps and refused rather than guess. Try again. |
| `application_retirement_active` | The Application is being retired and cannot be resumed. |
| `application_resume_blocked_by_replacement_hold` | A held replacement would start. The response carries `replacementHold`, `overrideRequired: true`, and `overrideAction`. |

`overrideAction` is a server-owned action like the others:
`kind: "resume_application_override"`, `label: "Resume anyway"`, `method`,
`href`, `body`, `expectedPostcondition`, and `reasonRequired: true`. Send its
`body` exactly as served, plus a non-empty `reason`, to its `href`. Activity
records the resume with its actor, the reason, and `overrideReplacementHold`.

The CLI `proof liskov application action-plan` still returns one Application's
plan items. Use those tokens for a bounded retry; do not treat `wait` or
`recover` as a Console Action Plan row.

| Field | Meaning |
| --- | --- |
| `decisionId` | Stable identity for the current decision cohort; required for a supported retry. |
| `conditionClass` | Typed cause family, such as `missingProcessorClaim`, `scheduleOverlap`, `processorAtMatchCap`, `insufficientReward`, `noAffordableProcessor`, `authoringFault`, `staleEnvironmentHandoff`, `ambiguousRecovery`, `runtimeFirstContactTimeout`, `runtimeCrashLoop`, `missedCheckin`, or `unknown`. |
| `disposition` | Machine response: `wait`, `recover`, or `park`. A platform kill state is not a customer retry recipe. |
| `nextAction` | Supported customer or support step. Absence normally means wait or escalate. |
| `reason` | Stable explanatory token; use it before the human message in automation. |
| evidence time/IDs | Scope the decision to exact policy, deployment, and job facts. |

`recover` can consume a bounded retry budget. `park` stops automatic forward
progress. `wait` must not be converted into repeated manual submissions.

`processorAtMatchCap` rotates away from the saturated processor within the
bounded launch-recovery budget. `authoringFault` does not retry: correct the
reported manifest pointer and publish again. The schedule-bound reason tokens
are `acurast_job_registration_duration_below_minimum`,
`acurast_job_registration_start_too_far_in_future`, and
`acurast_job_registration_max_start_delay_exceeded`.

## Application cap refusals

`organization_over_plan_caps` with `feature: max_applications` means the
organization holds more Application slots than its resolved plan permits.
`used` is the current slot-holding Application count; `limit` is the resolved
Application allowance. Exactly at the cap (`used <= limit`) passes this check,
although other admission checks still apply. Creation has a separate
`application_quota_exceeded` refusal: it needs room for one additional slot.

While `used > limit`, Liskov refuses **all customer-initiated publish/deploy,
Run, and resume starts** in the organization, before publication, run
authorization, or spend. New scheduled `once` occurrences, due `interval`
occurrences, and a continuous Application's first job are also refused before
spend. [Run again and fixed-interval execution](./capabilities.md) remain
release-gated.

Already-running continuous work keeps renewing. Recovery and replacement of
existing execution continue through their usual safety and funding checks.
Trial lapse itself stops no running job. Liskov does not automatically choose
excess Applications to pause or retire.

Publish/deploy and resume return HTTP `403` with `error`, `feature`, `used`,
and `limit` at the top level, for example:

```json
{
  "ok": false,
  "error": "organization_over_plan_caps",
  "reason": "This organization holds 3 application slots and its plan allows 2, so it cannot start new work. Retire applications to release slots or restore a plan that allows them; paused applications keep their slot. Running work is not affected.",
  "feature": "max_applications",
  "used": 3,
  "limit": 2
}
```

Run retains its HTTP `200` response envelope with `ok: false`,
`authorized: false`, and the same fields inside `refusal`, where the code is
`refusal.code`. A scheduled refusal appears in the execution result as
`reason: organization_over_plan_caps`, alongside `feature`, `used`, and
`limit`. Do not decide success from HTTP status alone.

CLI `0.17.0` renders the refusal and exits nonzero; `--json` preserves the
received envelope and exact numeric fields. See the [CLI version requirement](./cli.md#over-cap-refusal-output).
If the cap cannot be read, Liskov refuses with
`organization_plan_caps_unavailable`; that is not evidence that usage exceeds
the cap. Try again shortly.

Retire enough Applications to bring `used` within `limit`, or restore a
plan/payment state with an adequate resolved allowance in an enabled billing
environment. **Pausing does not release an Application slot.** Customer
paid-plan activation remains [release-gated](./capabilities.md). Follow the
[verification and safe next steps](../troubleshooting/billing-retirement.md#organization-is-over-its-application-cap).

## Organization business-eligibility errors

New non-personal organizations must carry the approved
`liskov.business-eligibility.v1` statement and an assigned ISO 3166-1 alpha-2
business-country code. These are declaration facts; Liskov does not infer them
from an IP address, billing address, or processor location.

| Code | Meaning / response |
| --- | --- |
| `business_eligibility_required` | The required statement version is missing. Return to the new-organization form and review the separate Business use only statement. |
| `business_eligibility_version_mismatch` | The client submitted a statement version other than the server's `requiredVersion`. Refresh the Console before retrying. |
| `business_country_required` | No business-establishment country was supplied. Enter its two-letter code. |
| `invalid_business_country_code` | The value is not an assigned uppercase ISO 3166-1 alpha-2 code. Correct the declared business country; do not substitute a billing or processor country. |

A refusal creates no organization, membership, Terms acceptance, trial, or
Service Credit grant. If you cannot make the statement because your use is
personal, family, or household use, do not retry: that use is unsupported.

## Execution coverage

The Console Coverage strip decodes `proof.liskov.execution-convergence.v1`.
Clients do not derive generation, phase, desired capacity, or finance from
raw policy or truncated rows. Unknown fields and older servers refuse
explicitly.

| Token | Meaning |
| --- | --- |
| `quiet` | No required work. Not stalled, even when last progress is old. |
| `in_flight` | Required work is inside its due window (pending launch). |
| `unknown` | Evidence is missing or unreadable; do not infer a phase. |
| `ended_unsettled` | Occupancy is vacant and a charge, reserve, or review hold remains. |
| `overdue` | Required work is past due with no successful progress. `stalled` is true only here. |
| `complete` / `incomplete` / `stale` / `unknown` | Completeness of the page. Truncation is partial history. |
| `selected` | Authoritative writer. Follow this next action. |
| `proposed` | Shadow suggestion. Never authorization. |
| `execution_convergence_unauthorized` | Permission withheld. |

See [Intended capacity versus remaining charges](../troubleshooting/execution-coverage.md).

## Manifest and publication diagnostics

| Code | Meaning / response |
| --- | --- |
| `invalid_policy` | Required value, type, enum, bound, or cross-field invariant is invalid. Correct the manifest. |
| `unknown_field` | A strict object contains an unrecognized property. Remove or correct it. |
| `unsupported_policy_feature` | Valid V4 syntax is not enabled. Choose a v1-supported value. |
| `entitlement_exceeded` | Organization/account limit is below the requested authority. Reduce it or change entitlement. |
| `application_identity_mismatch` | Application ID/UID does not match the target. Stop and inspect identity. |
| `application_already_exists` | Import target collides with an existing Application. Resolve organization/repository/UID rather than overwriting. |
| `invalid_policy_import` | Import source or document is not an accepted Manifest V4 input. |

Publication preflight can report several independent diagnostics. Resolve all,
then run a fresh preflight; do not rely on a stale clean result.

## Application lifecycle

An Application is in exactly one of three lifecycle states. This is a different
question from posture: posture says whether the Application is healthy,
lifecycle says whether it still exists.

| Lifecycle | Meaning | Holds an Application slot |
| --- | --- | --- |
| `Current` | The Application exists. It may be active, paused, or disabled. | Yes |
| `Retiring` | A retirement is in progress and has not finalized. | Yes |
| `Retired` | Retirement finalized and an immutable receipt exists. | No |

The Console shows these three; `proof liskov application list` prints them
beside the stored status. In the API and in persisted data, a retired
Application's `status` is `deleted` — a compatibility detail retained for
deployed clients, not the customer-facing word. `retiring` is derived from an
active retirement intent and is never a stored status; a retiring Application
reports its stored status as `paused`, which is why the lifecycle, not the
status, is the field to read.

A retired Application carries a `receiptKind`:

| `receiptKind` | Meaning |
| --- | --- |
| `safe_retirement` | Retirement finalized against a proven zero gate. |
| `legacy_immediate_tombstone` | A historical deletion recorded before safe retirement existed. It is not proof of a zero gate, and its remaining resources are cleaned up separately. |

## Retirement

The canonical assessment uses:

| Phase | Meaning |
| --- | --- |
| `terminalizing_local` | New work is stopped and local mutable work is being closed. |
| `waiting_for_schedule_end` | One or more execution blockers remain until verified chain end. |
| `waiting_for_financial_tail` | Reserve/charge/release/review evidence remains. |
| `blocked` | Ambiguous or non-self-remediating evidence prevents completion. |

Blockers have category `execution`, `financial`, or `ambiguity`, plus code,
evidence authority, resource kind/ID, and remediation class. Completion
requires all three blocker counts to be exactly zero and produces the immutable
receipt; unknown vocabulary fails closed.

Several blockers can describe one obligation — a held reserve and its
unreleased billing parent are emitted from the same reservation. The Console and
the CLI group them into correlated obligations and report who must act:

| Waiting on | Remediation classes | Your action |
| --- | --- | --- |
| Liskov | `automatic_local_terminalization`, `automatic_financial_closeout` | None. Liskov's own workers converge this. |
| The Acurast chain | `wait_for_chain_evidence` | None. The chain owns the terminal fact; waiting is correct. |
| Operator review | `evidence_backed_adjudication`, `operator_adjudication`, `normalize_or_adjudicate`, `classify_or_adjudicate` | Contact support with the obligation, per [Billing, settlement, and retirement](../troubleshooting/billing-retirement.md). |

A remediation class Liskov cannot classify is reported as needing review, never
as automatic. "Automatic" means the named owner will act on the evidence stored
now.

### `retirement_already_completed`

Cancelling a retirement that finalized first returns `409
retirement_already_completed` **with the immutable receipt**. This is a
successful outcome, not a failure: the Application is retired and there was
nothing left to cancel. Read the receipt in the response body; `proof liskov
application retire cancel` exits `0` and prints it.

## Automation rules

Parse tokens from `--json`, retain the full scoped object, and treat unknown
values as non-ready. Human labels can improve without changing the machine
contract. Never map an unknown error to retry or success.
