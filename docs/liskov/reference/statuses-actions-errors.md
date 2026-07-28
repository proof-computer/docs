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

## Automation rules

Parse tokens from `--json`, retain the full scoped object, and treat unknown
values as non-ready. Human labels can improve without changing the machine
contract. Never map an unknown error to retry or success.
