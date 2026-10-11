---
title: Spend limits
description: Understand authored Service Credit caps, the reserve a run opens, and the release-gated organization limit.
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

## Organization max spend per deploy

:::caution Release-gated v1

The V5 organization guard and its funds-stop readback are accepted behavior,
but their complete customer path has not been verified for release. Do not
assume the guard protects a V5 launch yet. The
[capability matrix](../reference/capabilities.md#operation-money-and-custody)
records its availability.

:::

Once released, **Max spend per deploy** (`maxSpendPerDeploy`) checks the total
reserve for each member attempt: custody amount plus fees. A member is one
stable job in your Application; a renewal creates a new attempt for that job.
The guard checks each attempt at launch, including renewal, rather than adding
the reserves of sibling jobs together. A valid or published manifest alone is
not proof that the next attempt fits the limit.

The organization limit is a USD decimal: `0.60` means USD 0.60. Manifest V5
`perJob` remains a Service Credit micros string: `"600000"` means the same
amount. Liskov compares the reserve and limit in exact Service Credit micros.
The fee allowance is part of the amount checked; it does not introduce a
separate customer transaction fee. See the
[charge lifecycle](../organizations/charges.md).

The attempt is refused only when its reserve is **greater than** the limit.
Equality passes this guard, subject to the other policy and funding checks.
For example, with a USD 0.60 limit, a member reserve of `600000` micros passes
and `600001` micros is refused. Two members each reserving `600000` micros
pass this per-member check even though their combined reserve is USD 1.20.

Zero is a real limit: it refuses every positive reserve. An absent limit adds
no organization per-deploy restriction; an empty or malformed value blocks
launch rather than removing the restriction. Authored `perJob` and recurring
`rate` caps, available credit, and the organization budget window still apply.

### Lowering the limit before renewal

Once released, lowering the limit below a running job's next-attempt reserve
stops its next renewal. The current job continues to its scheduled end; the
change does not undo committed spend or release its current reserve early.
The refused attempt takes no new reserve and submits no chain effect.

The refusal is a customer **funds stop**, named
`v5_max_spend_per_deploy_exceeded`, with the actual reserve, limit, and unit.
It belongs to the organization's Action Plan because an administrator chose
the limit. A failure of Liskov's own chain funding is a platform condition,
not a customer funds stop; adding customer credit cannot repair it.

If this stop is reported, check the job's reserve and the intended limit.
An authorized administrator can raise the limit if that spend is intended;
otherwise leave the job stopped or publish a policy with a lower supported
reserve. Adding credit alone does not raise a cap. A fresh admissible attempt
clears the matching stop through the normal launch checks. Verify the reason
and comparison in the refreshed Action Plan and the later job generation;
do not loop retries. See
[Diagnose a funds stop](../operate/diagnose-retry.md#diagnose-a-funds-stop).

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
