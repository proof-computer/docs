---
title: What each deployment outcome costs
description: Match a reserve, final charge, release, or review to the way your deployment actually ended.
---

# What each deployment outcome costs

[Quotes, reserves, and final charges](charges.md) explains the money lifecycle.
This page answers the question that follows it: **for each way a deployment can
end, what happens to the money?**

It covers deployment settlement only. Account-level charges are separate and do
not appear here.

:::caution
Customer Stripe checkout and new Service Credit issuance are release-gated. See
[Read USD Service Credits](service-credits.md).
:::

## What the network actually consumes

Liskov commits a bounded Acurast reward for your deployment, within the
effective policy, and reserves the matching Service Credits.

The network consumes that reward **per accepted execution report**, at an amount
fixed when the job is assigned. A job that produces fewer accepted reports
consumes less. Success and failure reports take the same fee path, so *how a run
ended does not by itself decide the amount* — the number of accepted executions
does.

When the job ends, Liskov ends the registration, reads the settlement evidence,
and debits a final charge in USD Service Credits at the rate fixed when the work
was authorized. Unused reserve is released.

A reserve is the **maximum** the deployment can cost. It is not a forecast, and
the final charge is determined at settlement rather than predicted.

## What each outcome costs

| What happened | Final charge | Reserve |
| --- | --- | --- |
| No reserve was taken — insufficient credit, a policy cap, or a stale quote | None | Never taken |
| Nothing was ever broadcast to the network | None | Released in full |
| The network refused the registration | None | Released in full |
| The job ran and ended, and settlement evidence is complete | From evidence, up to the reserve | Remainder released |
| Managed custody: the strict report deadline passed and the finalized scanner proves no report was filed | Zero — not billed | Released in full |
| The registration ended and returned nothing | Up to the reserve, never more | Nothing to release |
| The registration ended and returned everything | Zero | Released in full |
| Settlement evidence is pending, unreadable, or outside coverage | None yet — settlement is deferred | Stays open |
| Required evidence is missing or contradictory | None yet — the item enters review | Stays open until resolved |
| The job is still running, or the schedule has not ended | None yet | Stays open |

Two of these look alike and are not. A registration that **ended and returned
nothing** has a chain coordinate and a zero refund. A registration where **no
deregistration was submitted** has neither, and missing chain evidence must
never be read as a zero return — that case is deferred or reviewed, not charged.

The managed no-report row is also distinct. It is authorized only after the
strict deadline by a finalized, readable scanner result. It closes with
`report_absent_not_billed`, no unresolved amount, and no customer action. An
open deadline or unreadable, unavailable, outside-coverage, conflicting, or
failed scan stays deferred. Self-custody does not use this Service Credit rule;
its ACU movement remains immutable chain accounting, not a refund or reversal.

## Pausing, retiring, and renewing

Pause and retirement stop new Liskov work but cannot end a job the chain already
owns. An existing job runs to its scheduled end and settles normally, so a
reserve can stay open after you pause. Retirement completes only once every
reserve, charge, release, and review has closed — see
[Billing, settlement, and retirement](../troubleshooting/billing-retirement.md).

A renewal or a replacement is new work with its own reserve, which can open
while the previous one is still settling.

## What never appears as a separate charge

- Attempts the network refused, and repricing while Liskov looks for a
  processor, within the try bound your policy allows.
- Liskov's own native chain transaction fees and treasury movements. These are
  platform costs recovered through your plan, not a separate line on your bill,
  and you never hold or spend network assets yourself.
- Any amount above the reserve for that deployment.

## When an amount is under review

Liskov fails closed. If the evidence needed to decide a final amount is missing
or contradictory, the item is neither charged nor released.

While an item is in review you should be able to see, together: the reserved
amount, the exact amount charged so far — often zero, the unresolved amount, and
that this is a Liskov review needing no action from you. Your available credit
stays reduced by the reserve until it resolves.

Report status and financial state are independent: evidence can arrive and the
financial item still resolve separately.

## Check what you were actually charged

Open **Billing & funding**, or read the authoritative records. Final charges draw
against promotional credit first, where the organization has it.

```bash
proof liskov organization billing transactions ORGANIZATION_ID \
  --limit 25
```

Match each reserve, final charge, and release to the Application UID and
deployment. Never infer a charge by subtracting two displayed balances.

## Related

- [Quotes, reserves, and final charges](charges.md) — the money lifecycle.
- [Read USD Service Credits](service-credits.md) — balances, history, and
  promotional credit.
- [Spend limits](../configure/spend-limits.md) — the caps you author.
- [Costs and custody model](../concepts/costs-custody.md) — why you hold no
  network assets.
