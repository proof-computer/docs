---
title: Recovery
description: Release or retry a launch that is wedged mid-flight.
---

# Recovery

Sometimes a launch gets stuck between stages — submitted but not registered, or
replaced but not drained. Recover deliberately and read-only first.

## 1. Establish What Actually Happened

```fish
proof liskov application status my-app
proof liskov application plans my-app
```

Identify the execution and deployment ids and the current
[state](../reference/reconcile-states.md). Match the symptom to a
[lifecycle stage](../concepts/deployment-lifecycle.md):

- stuck at `candidate` → registration or ingress did not complete
- a stranded `draining` predecessor → replacement landed but the old job did not
  release
- a [replacement hold](./replacement-holds.md) → Liskov has already braked

## 2. Prefer The Self-Healing Path

Liskov reconciles continuously. For many wedges the correct action is to let the
next reconcile run, or to re-run a single execution with an idempotency key
rather than forcing state by hand:

```fish
proof liskov custody execution run-one my-app \
  --yes-spend --idempotency-key my-app-recover-1
```

The idempotency key makes the retry safe if a prior attempt partially succeeded.

## 3. Clear A Hold Only When Resolved

If a replacement hold is standing, do not override it until you have confirmed
the prior attempt is resolved — see [Replacement holds](./replacement-holds.md).

## 4. Watch It Converge

```fish
proof liskov application status my-app
```

A healthy recovery returns the deployment to `active` with the route open. If it
does not converge after a reconcile cycle, capture the execution and deployment
ids and the status output before escalating.

## What Not To Do

- Do not re-run with `--yes-spend` repeatedly hoping it clears — that spends each
  time. Use an idempotency key.
- Do not override a replacement hold to "unstick" things without reading why it
  was derived.
