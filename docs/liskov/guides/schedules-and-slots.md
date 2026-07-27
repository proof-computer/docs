---
title: Schedules And Slots
description: Stable slot parallelism, bounded schedules, renewal, and measured successor overlap.
---

# Schedules And Slots

V4 models long-running applications as stable Liskov slots with monotonic
generations. `deployment.parallelism` is the slot count; it is not
provider-native replicas.

## One Slot With Fixed Renewal Lead

```json title="liskov.json (excerpt)"
{
  "deployment": {
    "parallelism": 1,
    "schedule": {
      "durationMs": 3600000,
      "maxStartDelayMs": 300000
    },
    "lifecycle": {
      "renewal": {
        "mode": "before_scheduled_end",
        "leadTime": {
          "mode": "fixed",
          "durationMs": 600000
        }
      }
    }
  }
}
```

The successor target is ten minutes before predecessor schedule end. Fixed lead
must be at least one minute and no more than the lesser of 30 minutes and half
the schedule duration.

Use `after_scheduled_end` when no paid overlap is authorized:

```json
{
  "renewal": {
    "mode": "after_scheduled_end"
  }
}
```

## Readiness, Not Claim, Advances A Slot

The lifecycle progresses from submitted to claimed to ready. Only accepted
readiness for the exact successor job changes the slot binding and generation.
Ready retains the application-wide one-successor surge until predecessor
scheduled end.

Liskov records target and actual schedule start, queue delay, scheduled overlap,
claim and readiness times, ready overlap, and coverage gap. It never clamps a
late target to make the rollout look on time.

## Multiple Slots

Parallelism above one, counted geography groups, and topology constraints are
part of the V4 contract but require fleet capability and entitlement. Each slot
renews independently; renewal and updates share one application-wide submitted
successor surge.

See [Lifecycle design](../policy/lifecycle.md) and
[Placement and capabilities](../policy/placement-and-capabilities.md).
