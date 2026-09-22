---
title: Schedules, renewal, and updates
description: Choose time-boxed execution and understand when Liskov creates successors for renewal or change.
---

# Schedules, renewal, and updates

Acurast jobs have a scheduled start and end. An Application is long-lived;
Liskov continues its desired behavior by creating successor deployments and
jobs under an explicit lifecycle policy.

## Choose a duration

```json
{
  "deployment": {
    "parallelism": 1,
    "schedule": { "durationMs": 3600000 },
    "lifecycle": {
      "renewal": { "mode": "after_scheduled_end" },
      "update": {
        "timing": "immediate",
        "existingJobs": { "mode": "run_until_scheduled_end" }
      },
      "recovery": {
        "launch": { "maxRetries": 5 },
        "runtimeFailure": { "mode": "wait_until_scheduled_end" }
      }
    }
  }
}
```

The example requests a one-hour job. `after_scheduled_end` begins successor
work after the predecessor's scheduled boundary. A fixed
`before_scheduled_end` lead can request bounded overlap, but it does not
guarantee readiness before the old job ends: market assignment and startup are
external facts.

For Manifest V4, choose `durationMs` of at least 60 seconds and
`maxStartDelayMs` of at most one hour. A caller-supplied start must be no more
than 24 hours ahead when the job is submitted. The CLI and Console authoring
paths refuse these errors before Acurast registration and identify the
offending schedule field.

The first public capability supports parallelism `1`, fixed lead time or
after-end renewal, and an open market. Automatic lead calculation is not
enabled.

## Run on a fixed interval (release-gated)

A job schedule and renewal keep one Application running. Some work should
instead start a finite occurrence at a fixed cadence, such as once an hour.
Manifest V5 describes that as `execution` with `mode: interval`, a required
`every` duration, and an optional `until` bound.

This is **release-gated**. Liskov does not launch an interval Application yet,
so do not use it for work you depend on;
[Capabilities and limits](../reference/capabilities.md) owns its current
boundary. The accepted behavior, including skips, pause, and the absence of
catch-up runs, is in the
[Manifest V5 reference](../reference/manifest-v5.md#interval).

When it is released, the Console Coverage card and
`proof liskov application execution show` read the same schedule from Liskov
and state one of:

| Reading | Meaning |
| --- | --- |
| Next run at *time* | The next boundary Liskov recorded is still ahead. |
| Run due at *time*; a run is still active | The boundary has passed while the previous occurrence is still running. It does not overlap. |
| Run due at *time*; no run has started yet | The boundary has passed and no occurrence is live yet. |
| No next run while stopped | The Application is paused, a draft, retiring, or retired. |
| No next run is scheduled | Liskov recorded no further boundary: `until` was reached, or no boundary has been decided yet. The reading does not say which. |
| Next run not reported | This read carried no schedule, so no next run is shown. |

Each time is Liskov's recorded boundary, compared with the time of the same
read. Neither client calculates a cadence from `every` or from your clock, and
neither shows a job's renewal deadline as the next run.

## Updates

`next_scheduled_renewal` waits for the next planned successor boundary.
`immediate` asks Liskov to begin a successor promptly after the new effective
policy exists. In v1, `run_until_scheduled_end` leaves predecessor jobs running
to their chain-owned end. Updating does not edit registered Acurast code,
schedule, environment, or secrets in place.

This means a configuration change can temporarily have an old and new job, or
a gap if the successor is delayed. Use external stores and operations that are
safe under that reality. The timeline records actual overlap and gap evidence.

## Failure behavior

`launch.maxRetries` is a bounded budget for launch-stage failure; zero disables
those retries. The supported runtime-failure mode waits until scheduled end.
Automatic fresh registration after runtime contact loss is typed in V4 but not
enabled in the first public capability set.

## Verify

Before publication, review duration, update timing, predecessor behavior, and
spend caps together. After a renewal or update, compare predecessor and
successor policy, deployment, job, scheduled-end, processor, and runtime-ready
timestamps. Do not infer continuous service from desired policy alone.

See [Replacement custody and time-boxed execution](../concepts/replacement-custody.md)
for the control model and [Update an Application](../operate/update.md) for the
task flow.
