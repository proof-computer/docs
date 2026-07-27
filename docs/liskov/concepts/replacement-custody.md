---
title: Replacement Custody
description: Why Liskov replaces deployments, and the states they move through.
---

# Replacement Custody

Acurast jobs are time-boxed: a job runs for a declared duration and then ends.
A long-running service therefore cannot be a single job that lives forever — it
has to be a **succession** of jobs, each handed off before the last expires.

Liskov manages that succession for you. This is **replacement custody**: Liskov
holds the desired state of your application and continuously reconciles the
running deployment toward it, launching replacement jobs ahead of expiry so the
service stays up.

## Desired State vs Observed State

You declare *desired* state in `liskov.json` — stable slot parallelism, schedule
duration, renewal timing, update behavior, and bounded recovery authority.
Liskov observes canonical deployment, job, claim, readiness, and schedule
evidence and decides what to do to close the gap.

## Deployment States

A deployment moves through a small set of observed states:

| State | Meaning |
| --- | --- |
| `candidate` | Newly proposed; awaiting acceptance and registration. |
| `active` | Running and serving traffic. |
| `draining` | Being replaced; takes no new traffic while existing work finishes. |
| `expired` | Past its scheduled end. |

## Launch Decisions

When Liskov reconciles, it decides on an action and records why:

| Action | Reason | When |
| --- | --- | --- |
| `launch` | `missing` | No deployment exists yet — create the first one. |
| `renew` | `renewal` | The slot reached the target defined by `deployment.lifecycle.renewal`. |
| `update` | `update` | The active policy digest differs from the slot's predecessor digest. |
| `recover` | `launch_recovery` | A bounded launch retry is authorized. |
| `recover` | `runtime_recovery` | Accepted failure evidence and policy authorize recovery. |

V4 renewal is explicit. `after_scheduled_end` targets no paid overlap.
`before_scheduled_end` with fixed lead targets a bounded overlap of 1–30
minutes, no more than half the schedule duration. The target is never described
as guaranteed readiness; Liskov records actual start, queue delay, ready
overlap, and coverage gap. See [Lifecycle design](../policy/lifecycle.md).

## Replacement Holds

If a replacement looks risky — for example, the previous attempt failed in a way
that could waste spend or strand a route — Liskov derives a **replacement hold**
that blocks further resume or replacement until you explicitly override it. This
is a safety brake, not an error.

Clearing a hold is a deliberate, reasoned action:

```fish
proof liskov custody execution run-one my-app \
  --override-replacement-hold --reason "previous attempt cancelled cleanly" \
  --yes-spend
```

See [Replacement holds](../troubleshooting/replacement-holds.md) for how to read
and clear them safely.

## Why This Matters

Because each deployment is a fresh, sealed job, replacement custody is also what
gives you geo-diverse, re-attested placement over time — not a single
long-lived host you have to trust to stay honest.
