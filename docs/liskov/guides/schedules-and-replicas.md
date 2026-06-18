---
title: Schedules And Replicas
description: Replicas, durations, and rolling replacements.
---

# Schedules And Replicas

Liskov keeps a service running across the bounded lifetime of individual Acurast
jobs by scheduling replicas and rolling replacements. You declare the schedule;
[replacement custody](../concepts/replacement-custody.md) executes it.

## Replicas

`replicas` (and the runtime's `desiredCount`) set how many concurrent
deployments Liskov keeps active:

```json title="liskov.json (excerpt)"
{
  "replicas": 2,
  "runtime": {
    "durationMs": 900000,
    "replacementRunwayMs": 600000,
    "desiredCount": 2
  }
}
```

## Duration And Runway

| Field | Unit | Meaning |
| --- | --- | --- |
| `durationMs` | milliseconds | How long each job runs before it expires. |
| `replacementRunwayMs` | milliseconds | How far before expiry to start the successor. |

Set `replacementRunwayMs` large enough for a replacement to launch, register, and
open its route before the outgoing job ends. A common pattern is a 15-minute job
(`900000`) with a 10-minute runway (`600000`).

## Rolling Replacement

When a job nears expiry, Liskov launches its successor while the current job is
still serving (`active`). The outgoing job moves to `draining` — it finishes
existing work but takes no new traffic — and then `expired`. With more than one
replica, replacements roll one at a time so capacity does not drop.

## Slots And Placement

`runtime.launch.slots` requests how many processor slots a launch occupies, and
the [Acurast placement fields](../reference/policy-schema.md) (`pinnedProcessors`,
`verifiedOnly`, `maxStartDelayMs`) constrain where replacements can land. Pinning
processors trades geographic diversity for predictability.

## Related

- [Replacement custody](../concepts/replacement-custody.md)
- [Budgets and spend](./budgets-and-spend.md) — every replacement is a funded
  launch
