---
title: Lifecycle Design
description: Design V4 schedules, renewal, updates, recovery, stable slots, generations, surge, and overlap.
---

# Lifecycle Design

Every Liskov job has a paid, bounded schedule. Lifecycle policy tells Liskov
what it may do as that schedule ends, when a new policy becomes active, or when
runtime evidence indicates failure.

## Stable Slots And Generations

`deployment.parallelism` creates stable Liskov slots. It does not request
Acurast-native replicas.

For `parallelism: 1`, the first slot is `slot-0`. Each accepted successor
increments that slot's generation:

```text
slot-0 generation 0 → generation 1 → generation 2
```

The slot changes generation only when the exact successor runtime becomes
ready. A claimed processor is not enough.

Renewal, policy update, launch recovery, and runtime recovery are separate
lifecycle reasons. Their counters and evidence do not collapse into one
generic retry count.

## Schedule

```json
{
  "schedule": {
    "durationMs": 3600000,
    "startDelayMs": 60000,
    "maxStartDelayMs": 300000
  }
}
```

| Field | Rule |
| --- | --- |
| `durationMs` | Required and greater than zero. |
| `startDelayMs` | Optional requested delay before paid schedule start. |
| `maxStartDelayMs` | Optional maximum accepted delay. |

If both delays are present, `startDelayMs` cannot exceed
`maxStartDelayMs`.

## Renewal

### After Scheduled End

```json
{
  "renewal": {
    "mode": "after_scheduled_end"
  }
}
```

The successor's paid schedule target is the predecessor's scheduled end.
Liskov may preflight or prepare earlier, but it does not manufacture paid
overlap.

Use this for batch work, cost-sensitive workers, or any workload where a
coverage gap is acceptable.

### Fixed Lead Before Scheduled End

```json
{
  "renewal": {
    "mode": "before_scheduled_end",
    "leadTime": {
      "mode": "fixed",
      "durationMs": 600000
    }
  }
}
```

The target start is:

```text
predecessor scheduled end − fixed lead
```

The fixed lead must be at least 60,000 ms and no greater than the lesser of:

- 1,800,000 ms; and
- half of `schedule.durationMs`.

The lead is a scheduled-start target, not a readiness promise. A late queue or
slow claim can reduce real ready overlap to zero.

### Automatic Lead

```json
{
  "renewal": {
    "mode": "before_scheduled_end",
    "leadTime": {
      "mode": "automatic",
      "profile": "proof.liskov.renewal-lead.v1"
    }
  }
}
```

Automatic lead is part of the V4 contract but capability-gated until its
observation and profile rollout is enabled.

## Policy Updates

An active policy digest different from the predecessor's digest creates an
update intent.

### Next Scheduled Renewal

```json
{
  "update": {
    "timing": "next_scheduled_renewal",
    "existingJobs": {
      "mode": "run_until_scheduled_end"
    }
  }
}
```

The update follows the renewal schedule. This is the conservative choice for
long-running jobs whose old and new versions should not overlap unexpectedly.

### Immediate

```json
{
  "update": {
    "timing": "immediate",
    "existingJobs": {
      "mode": "run_until_scheduled_end"
    }
  }
}
```

The successor target start becomes the current reconciliation time. Existing
jobs still retain their paid schedule and keep running until its end.

### Cooperative Cease

```json
{
  "update": {
    "timing": "immediate",
    "existingJobs": {
      "mode": "cooperative_cease",
      "trigger": "successor_runtime_ready"
    }
  }
}
```

Triggers are:

- `rollout_started`;
- `successor_processor_claimed`; or
- `successor_runtime_ready`.

Cooperative cease is never a forced kill. The old runtime must advertise an
asynchronous cease handler, accept an identity-bound command, and sign a
`runtime.ceased` acknowledgement. Missing support, command failure, or missing
acknowledgement falls back to the predecessor's scheduled end.

## Recovery

Launch and runtime recovery have separate controls:

```json
{
  "recovery": {
    "launch": {
      "maxRetries": 5
    },
    "runtimeFailure": {
      "mode": "wait_until_scheduled_end"
    }
  }
}
```

`launch.maxRetries` defaults to `5` and accepts `0` through `10`. Explicit zero
means no launch retry.

`wait_until_scheduled_end` never creates a fresh runtime replacement from
failure evidence.

The advanced recovery arm is:

```json
{
  "runtimeFailure": {
    "mode": "replace_after_failure",
    "contactLossAfterMs": 300000,
    "restartGraceMs": 600000,
    "maxSameJobRestarts": 3,
    "maxFreshRegistrationReplacements": 2
  }
}
```

| Control | Default | Allowed |
| --- | ---: | ---: |
| `contactLossAfterMs` | 300,000 | 120,000–1,800,000 |
| `restartGraceMs` | 600,000 | 0–86,400,000 |
| `maxSameJobRestarts` | 3 | 0–50 |
| `maxFreshRegistrationReplacements` | 2 | 0–10 |

Replacement after failure is typed but capability-gated. Zero is meaningful
and is never treated as missing.

## One-Successor Surge

Renewal and update share an application-wide surge limit of one submitted
successor. If several slots become due:

1. the predecessor with the earliest scheduled end wins;
2. remaining work stays queued deterministically;
3. a newer policy replaces obsolete unsubmitted work; and
4. already submitted work retains surge occupancy until it completes, fails,
   or reaches its scheduled-end boundary.

The durable idempotency tuple is:

```text
application UID
+ slot
+ target policy digest
+ generation
+ lifecycle reason
```

## What Liskov Measures

Targets are not clamped to make late execution appear on time. Liskov records:

| Measurement | Meaning |
| --- | --- |
| `targetScheduleStartMs` | Planned paid schedule start. |
| `actualScheduleStartMs` | Canonical successor schedule start. |
| `scheduledOverlapMs` | `max(0, predecessor end − actual successor start)`. |
| `queueDelayMs` | `max(0, actual successor start − target start)`. |
| `claimedAtMs` | Canonical positive processor claim time. |
| `readyAtMs` | Earliest accepted readiness event for the exact successor job. |
| `readyOverlapMs` | `max(0, predecessor end − ready time)`. |
| `coverageGapMs` | `max(0, ready time − predecessor end)`. |

Accepted measurements are immutable. Conflicting later evidence fails closed
instead of rewriting history.
