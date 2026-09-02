---
title: Billing, settlement, and retirement
description: Resolve insufficient credits, long-lived reserves, settlement review, schedule-end waits, retirement blockers, cancellation, and receipts.
---

# Billing, settlement, and retirement

## Insufficient Service Credits

Confirm the active organization and read available versus reserved credit.
Review the deployment quote and policy cap. Customer Stripe checkout and new
Service Credit issuance are release-gated. If an existing organization lacks
available credit, stop before retrying and contact support; do not call an
internal funding endpoint. The customer does not fund a crypto wallet.

A balance change does not necessarily retry a blocked deployment. Return to
the Action Plan.

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

Preserve quote, reserve, policy cap, job schedule, chain evidence, and
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

The Application stays paused. If a blocker is stale beyond its authority's
documented boundary, send support the retirement ID, phase, blocker category
and code, resource IDs, assessment digest, and timestamps. Do not ask for a
force-complete.

After completion, verify and retain the immutable receipt.
