---
title: Spend limits
description: Author per-job and recurring Service Credit caps, and read the reserve a run opens before you launch.
---

# Spend limits

A Manifest V5 `deployment.spend` block limits what Liskov may authorize for
your Application. Its amounts are safety caps, not predicted or guaranteed
prices.

```json
{
  "deployment": {
    "spend": {
      "unit": "service_credit_micros",
      "perJob": "600000",
      "rate": {
        "amount": "15000000",
        "window": "1d"
      }
    }
  }
}
```

- `unit` is always `service_credit_micros`: every amount is USD Service
  Credits in micros. 1,000,000 micros is USD 1.00, so this `perJob` is
  USD 0.60 and this `rate` is USD 15.00 over one day.
- `perJob` is the per-job cap: the most one delivered job may spend.
- `rate` is the ceiling for recurring execution, expressed as an `amount` over
  a `window`. `continuous` and `interval` execution require it; `window`
  defaults to `30d`. An Application that runs once can omit it.

Amounts are non-negative decimal strings, never JSON numbers. The
[Manifest V5 reference](../reference/manifest-v5.md#spend) has the exact
rules. An Application authored in Manifest V4 uses different spend fields; see
the [Manifest V4 reference](../reference/manifest-v4.md#deploymentspend).

Most customers should start from the Console's supported defaults and adjust
only with a measured reason. Too-low caps block launch rather than silently
exceeding them.

## Three different amounts

| Amount | Meaning |
| --- | --- |
| Per-job cap | `perJob`, the maximum authority you authored for one job. Nothing is taken when you save it. |
| Reserve | Temporary hold against available Service Credits when a run starts: up to the per-job cap for each job. |
| Final charge | Settled usage after execution evidence is known; unused reserve is released. |

Liskov does not show a separate estimate of what a run will cost before
launch. The per-job cap and the reserve are bounds, not a quote; the final
charge is settled from evidence and can be lower.

Liskov's treasury pays Acurast in network assets. Your organization sees only
USD Service Credits; it does not acquire an ACU or USDC wallet.

## Verify before launch

Review the per-job cap, the reserve a run opens (per-job cap × jobs),
available credit, duration, renewal, and parallelism together. The Console's
Run dialog and `proof liskov application run` show that reserve before the
run starts. After settlement, compare the final charge and released reserve in
billing transactions. A reserve is not evidence that a processor was assigned
or that the runtime became ready.

See [Per-job caps, reserves, and final charges](../organizations/charges.md)
for the billing lifecycle and
[Billing, settlement, and retirement](../troubleshooting/billing-retirement.md)
when a charge remains under review.
