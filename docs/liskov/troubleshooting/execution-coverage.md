---
title: Intended capacity versus remaining charges
description: Read Coverage to see why desired work is not yet running, and keep an ended job's remaining charge separate from execution.
---

# Intended capacity versus remaining charges

Coverage answers two different questions. One is whether the Application's
intended slots are running. The other is whether a charge, reserve, or review
hold is still open after a run has ended. Mixing them leads to retries that
cannot close money and to waiting when a typed Action Plan already names the
blocker.

Open the Application **Overview** Coverage strip, or the same strip on an
execution detail. The Console does not invent a generation, phase, or amount
from truncated rows. Unknown evidence stays unknown.

The published CLI plugin does not yet include this sibling read. Use Console
until a later plugin release that contains
`150b7c96d0caa23e757222dd1eb0288db48a368d`.

## What Coverage reports

The server sends `proof.liskov.execution-convergence.v1`. Console and the
unreleased CLI source decode the same seven cases: permission withheld,
pending launch, unknown submission, ended/unsettled, complete, partial
history, and selected versus proposed.

Console labels:

| You see | Meaning | Default response |
| --- | --- | --- |
| Permission withheld | The current identity cannot read this Application's convergence facts. | Sign in to the owning organization or ask an owner. |
| Work is in flight inside its due window | A launch, renewal, or successor is pending inside its due window. | Wait. This is not a stall. |
| Evidence is unknown | Submission, occupancy, or money evidence is missing or unreadable. | Do not infer a phase. Collect the support bundle if it persists. |
| The run has ended and a charge is still open | Occupancy is vacant and a reserve, review, or older liability remains. | Read billing; do not relaunch to "finish" the charge. |
| No required work. Quiet is not stalled | Intended and effective capacity match and no required work is overdue. | Monitor normally. Old last-progress time is not a stall. |
| Partial history | The server truncated a page or marked completeness incomplete. | Treat missing members and amounts as unknown. |
| Selected versus proposed | A shadow suggestion disagrees with the selected writer. | Follow **selected**. Proposed is not authorization. |
| Required work is overdue | Required work is past due with no successful progress. | Read the Action Plan. Retry only if that plan offers it. |

Quiet is not stalled. Ended-unsettled is a remaining-charge state, not overdue
execution. Incomplete, stale, and unknown never become quiet or overdue.

## Remaining charges are not Coverage below desired

An ended job can still have:

- an open Service Credit reserve;
- a review-pending hold;
- truncated older liability.

Those facts live on the same strip as **Open charge** and in
[Quotes, reserves, and final charges](../organizations/charges.md). They do
not mean intended capacity is missing, and they are not a new Action Plan
retry. See [Billing, settlement, and retirement](./billing-retirement.md).

## Action Plan still owns retry

Typed Action Plan continues to route you to Coverage and the existing retry
boundary. Coverage is not a second Action Plan and does not add a re-arm or
retry control. Use [Application status and Action Plan](../operate/status-action-plan.md)
and [Diagnose and retry](../operate/diagnose-retry.md) when a blocker is
actionable.

## Owner versions

| Surface | Availability | Owner |
| --- | --- | --- |
| Console Coverage and Executions | v1 on production Console `96e3f0638d948b24b516ed7713761784ad62c80f` against API `2db522130b314a044f7c50ee530c610d32868b4e` | [liskov-ui PR 113](https://github.com/proof-computer/liskov-ui/pull/113), [liskov-rs PR 819](https://github.com/proof-computer/liskov-rs/pull/819) |
| CLI text and `--json` sibling | Release-gated v1; not in `@proof-computer/proof-cli-liskov` `0.14.0` or npm `0.15.0` (`6cc262d4d73bab607cc8326dece7f3094ed2731d`) | source `150b7c96d0caa23e757222dd1eb0288db48a368d` |
| Candidate writer selection | Internal; incumbent remains selected until a later authorized activation | not a customer control |

If the strip is missing, the API image is older than the Console, or permission
is withheld, the Console degrades with an explicit refusal. It does not guess
capacity or finance.

See [Statuses, actions, and errors](../reference/statuses-actions-errors.md)
for the machine tokens and [Capabilities and limits](../reference/capabilities.md)
for availability.
