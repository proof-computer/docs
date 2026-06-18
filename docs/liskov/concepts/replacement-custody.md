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

You declare *desired* state in `liskov.json` — how many replicas, how long each
job runs, how much runway before expiry to start a replacement. Liskov observes
the *actual* on-chain state and decides what to do to close the gap.

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
| `replace` | `near_expiry` | The current job will expire within `replacementRunwayMs` — launch its successor now. |
| `replace` | `invalid_observed` | Observed state no longer matches the policy — correct it. |

`replacementRunwayMs` is the safety margin: set it large enough that a
replacement can be launched, registered, and have its route opened before the
outgoing job ends. The pitchdeck reference app uses a 10-minute runway
(`600000`) on a 15-minute job (`900000`).

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
