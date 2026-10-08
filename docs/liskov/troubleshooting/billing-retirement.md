---
title: Billing, settlement, and retirement
description: Resolve insufficient credits, long-lived reserves, settlement review, schedule-end waits, retirement blockers, cancellation, and receipts.
---

# Billing, settlement, and retirement

## Insufficient Service Credits

Confirm the active organization and read available versus reserved credit.
Review the deployment's per-job cap and the reserve a run needs. Customer
Stripe checkout and new Service Credit issuance are release-gated. If an
existing organization lacks available credit, stop before retrying and contact
support; do not call an internal funding endpoint. The customer does not fund a crypto wallet.

A balance change does not necessarily retry a blocked deployment. Return to
the Action Plan.

## Organization is over its Application cap

**Symptom:** publish/deploy, Run, or resume reports
`organization_over_plan_caps` with `feature: max_applications`, `used`, and
`limit`. `used` is the current count of slot-holding Applications; `limit` is
the organization's resolved Application allowance. Use the numbers returned
by Liskov, not a limit inferred from a plan name.

The cap refuses all new customer starts in the organization and new scheduled
`once` and `interval` occurrences, including a continuous Application's first
job, before any spend. Already-running continuous work, its renewals, and
recovery or replacement of existing execution continue through their usual
safety and funding checks. Trial lapse itself stops no running job. Liskov
does not automatically select excess Applications to pause or retire.
[Run again and fixed-interval execution](../reference/capabilities.md) remain
release-gated.

1. Confirm the selected organization. Read **Billing & funding** in the
   Console, or run `proof liskov organization billing ORGANIZATION_ID --json`.
   The billing read exposes the current count and limit at
   `allowances.applications.used` and `allowances.applications.limit`.
2. For the typed refusal and unchanged numeric fields in CLI `--json` output,
   use [plugin `0.17.0`](../reference/cli.md#over-cap-refusal-output). Publish
   and resume carry top-level `error`, `feature`, `used`, and `limit`; Run
   carries `refusal.code`, `refusal.feature`, `refusal.used`, and
   `refusal.limit` and exits nonzero even though its HTTP status is `200`.
3. [Preview retirement](../operate/retire.md#preview) for Applications you no
   longer need. Retire at least `used - limit` of them. For `used: 3` and
   `limit: 2`, at least one retirement must complete. **Pausing does not
   release an Application slot.** A Retiring Application still holds its
   slot; wait for **Retired** and its receipt. Retirement is permanent and
   existing Acurast schedules and financial obligations must close first.
4. Read billing again and verify `used <= limit`. Exactly at the cap is
   within it. Then return to the Action Plan or retry the intended supported
   start; clearing this cap does not bypass policy, credit, or other limits.

An adequate resolved plan/payment state is another way back in an enabled
billing environment. Customer paid-plan activation and funding remain
[release-gated](../reference/capabilities.md); a plan name or Service Credit
balance alone does not raise the allowance. If you cannot retire enough
Applications, contact support with the organization ID, code, `feature`,
`used`, `limit`, and timestamp before retrying.

If `feature` is `organization_job_slots`, use the separate [job-slot remedies](../operate/pause-resume.md#job-slots):
pausing releases job slots while keeping the Application slot. If the reason
is `organization_plan_caps_unavailable`, the caps could not be read; try again
shortly instead of assuming you are over cap.

## The run ended and a charge is still open

Coverage can report **ended-unsettled** when occupancy is vacant and a reserve,
review-pending hold, or older liability remains. That is remaining money, not
missing capacity. Do not relaunch to close it. See
[Intended capacity versus remaining charges](./execution-coverage.md).

## Reserve remains open

Match the reserve to Application UID, deployment, job, and current execution
evidence. It can remain while a job is in progress, terminal chain evidence is
pending, or financial reconciliation is under review. Do not treat it as a
final charge or release it by starting duplicate work.

An ordinary managed **Not billed — no report filed** row is already closed:
zero was charged and the full linked reserve was released. It needs no customer
action and must not show an amount in review. If a no-report reserve is still
open, the strict deadline or required scanner evidence has not qualified for
that closeout; preserve the evidence and wait or escalate the typed blocker.

## Final amount is under review

Preserve reserve, policy cap, job schedule, chain evidence, and
transaction IDs. Liskov must fail closed when the sources are ambiguous.
Customer-facing support should investigate; no public command can assert a
made-up final amount.

## Retirement waits for schedule end

Starting retirement stops new Liskov work but existing Acurast jobs continue to
their chain-owned end. Compare `latestKnownScheduleEndAtMs` with current time
and the execution blockers. A locally ended process is not by itself proof that
the registered schedule ended.

## Retirement waits for financial tail

All reserves, final charges, releases, and reviews must close. Match each
financial blocker to a transaction/evidence authority. Retirement completes
only when execution, financial, and ambiguity blocker counts are exactly zero.

## Cancel or escalate

Cancel before irreversible finalization when the supported action remains
available:

```bash
proof liskov application retire cancel APPLICATION_ID \
  --reason "requested in error" \
  --yes
```

The Application stays paused.

**If the cancellation returns `retirement_already_completed`, it succeeded at
something else.** The retirement finalized before the cancellation was applied,
so there was nothing left to cancel; the response carries the immutable receipt
and the CLI exits `0`. Retain the receipt and stop — this is not an error to
escalate.

Escalate only an obligation the Console or CLI marks as waiting on **operator
review**. An obligation waiting on Liskov or on the Acurast chain is
progressing correctly, and its age alone is not evidence of a fault. When you do
escalate, send support the retirement ID, phase, blocker category and code,
resource IDs, assessment digest, how long the assessment has been unchanged, and
timestamps. Do not ask for a force-complete.

After completion, verify and retain the immutable receipt, and note its
`receiptKind`: a `safe_retirement` receipt proves a zero gate, while a
`legacy_immediate_tombstone` records a historical deletion that does not.
