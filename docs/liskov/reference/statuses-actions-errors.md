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
| `needs_action` | `danger` | true | A blocked/parked/failed/review deployment exposes customer action. |
| `inactive` | `idle` | false | Draft, paused, disabled, retiring/retired, or otherwise inactive. |

The object also includes stable `reason` and human `label`. Common reasons:

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
| `deployment_blocked`, `deployment_parked`, `deployment_failed` | Current deployment needs customer review/action. |
| `deployment_review_required` | Human review is explicitly required. |
| `application_draft`, `application_paused` | Inactive authored/lifecycle state. |

Unknown active detail maps to `in_progress`/`unknown_active_state`, not `ready`.

## Action Plan vocabulary

The Console **organization Action Plan** lists only Holds: work Liskov has
stopped on and will not resolve without you. Causes are `intent` (you stopped
it), `funds` (authorised cap), and `app_fault` (workload, artifact, or policy
version). `platform` never appears as a customer decision. A job Liskov is
still retrying is withheld; the page says so.

Each Hold names one cause and one action pair: **Resume trying** / **Stop**.
Per-code next-action prose stays on the execution detail.

The CLI `proof liskov application action-plan` still returns one Application's
plan items. Use those tokens for a bounded retry; do not treat `wait` or
`recover` as a Console Action Plan row.

| Field | Meaning |
| --- | --- |
| `decisionId` | Stable identity for the current decision cohort; required for a supported retry. |
| `conditionClass` | Typed cause family, such as `missingProcessorClaim`, `scheduleOverlap`, `insufficientReward`, `noAffordableProcessor`, `staleEnvironmentHandoff`, `ambiguousRecovery`, `runtimeFirstContactTimeout`, `runtimeCrashLoop`, `missedCheckin`, or `unknown`. |
| `disposition` | Machine response: `wait`, `recover`, or `park`. A platform kill state is not a customer retry recipe. |
| `nextAction` | Supported customer or support step. Absence normally means wait or escalate. |
| `reason` | Stable explanatory token; use it before the human message in automation. |
| evidence time/IDs | Scope the decision to exact policy, deployment, and job facts. |

`recover` can consume a bounded retry budget. `park` stops automatic forward
progress. `wait` must not be converted into repeated manual submissions.

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
