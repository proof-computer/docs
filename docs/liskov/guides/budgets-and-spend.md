---
title: Budgets And Spend
description: V4 reward, native-fee, and Service Credit caps plus preflight and explicit spend gates.
---

# Budgets And Spend

Every launch and successor is bounded by immutable policy caps, checked in
preflight, and submitted only through an explicit spend-bearing action.

## Spend Policy

```json title="liskov.json (excerpt)"
{
  "deployment": {
    "spend": {
      "maxRewardPlanckPerJob": "50000000000",
      "maxNativeFeePlanckPerJob": "10000000000",
      "maxServiceCreditMicrosPerGeneration": 2500000
    }
  }
}
```

| Field | Boundary |
| --- | --- |
| `maxRewardPlanckPerJob` | Maximum Acurast processor reward for one job. |
| `maxNativeFeePlanckPerJob` | Maximum native chain fee for one job. |
| `maxServiceCreditMicrosPerGeneration` | Maximum platform Service Credit charge for one slot generation. |

Planck values are decimal strings to avoid JSON number precision loss. Caps are
maximum authority, not target prices.

## Preflight Before Spend

```fish
proof liskov custody preflight my-app
proof liskov custody execution run-one my-app --yes-spend
```

Preflight checks the exact policy digest, processor eligibility, schedule,
quote, custody balance, Service Credit balance, secrets, and ingress without
spending. A quote above any cap is refused.

`--yes-spend` is stricter than a plain confirmation. Read-only status, plan, and
preflight commands never move money.

## Successors Also Cost Money

Renewal, update, launch recovery, and runtime recovery can each create a new
paid job only when separately authorized by lifecycle policy and execution
capability. Fixed overlap can mean two paid schedules temporarily coexist.

Budget using:

```text
maximum per-job reward
× stable slot generations
+ native fees
+ Service Credit per generation
```

The application-wide surge of one limits simultaneous submitted successors; it
does not remove their cost.

## Related

- [Lifecycle design](../policy/lifecycle.md)
- [Preflight and spend troubleshooting](../troubleshooting/preflight-and-spend.md)
- [Policy schema: spend](../reference/policy-schema.md#deploymentspend)
