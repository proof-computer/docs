---
title: Budgets And Spend
description: Quotes, caps, USDC settlement, and spend gates.
---

# Budgets And Spend

Liskov is explicit about money: dollars in, dollars out. Every launch is quoted
before it runs, capped by policy, and gated behind an explicit confirmation.

## The Spend Path

1. **Preflight** returns a signed quote — no spend.
2. You read the quote.
3. **`custody execution run-one --yes-spend`** funds the quote and launches.

```fish
proof liskov custody preflight my-app          # quote, no spend
proof liskov custody execution run-one my-app --yes-spend
```

`--yes-spend` is a stricter gate than a plain `--yes`. A command without it never
moves money.

## Budget Caps

The policy caps per-launch spend so a runaway reconcile cannot drain a budget:

```json title="liskov.json (excerpt)"
{
  "acurast": {
    "budgetCaps": {
      "maxRewardPerLaunch": 50000000000,
      "maxNativeFeePerLaunch": 10000000000
    },
    "quote": { "required": true }
  },
  "runtime": {
    "launch": { "reward": 40000000000, "slots": 1 }
  }
}
```

| Field | Meaning |
| --- | --- |
| `runtime.launch.reward` | Acurast reward offered per launch, in planck (smallest units). |
| `budgetCaps.maxRewardPerLaunch` | Hard ceiling on the reward per launch. |
| `budgetCaps.maxNativeFeePerLaunch` | Hard ceiling on native chain fees per launch. |
| `quote.required` | Require a signed quote before funding. |

If a quote exceeds a cap, the launch is refused before spend.

## Settlement In USDC

Quote funding settles through the accepted payment asset (USDC). This is separate
from the Acurast compute reward: the reward pays the processor; the quote funds
the registry. Read-only commands (`application status`, `application plans`,
`custody preflight`) never settle.

## Replacements Cost Money Too

Every rolling replacement is a funded launch subject to the same caps. Size
`replacementRunwayMs` and `replicas` with that in mind — see
[Schedules and replicas](./schedules-and-replicas.md).

## Related

- [Preflight and spend troubleshooting](../troubleshooting/preflight-and-spend.md)
- [Policy schema](../reference/policy-schema.md)
