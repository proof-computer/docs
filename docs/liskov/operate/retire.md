---
title: Retire an Application
description: Safely stop new work, wait for schedule and financial closure, and obtain an immutable deletion receipt.
---

# Retire an Application

Retirement is the supported permanent lifecycle. It is asynchronous because
Liskov cannot honestly force-stop an Acurast registration it no longer owns:
existing jobs retain their chain schedules and financial consequences.

:::caution Release gate
The retirement contract is accepted for v1, but production availability is
still gated. Treat these commands as the final v1 path only when the
Console exposes retirement and this notice is removed.
:::

## Preview

Read current retirement state and blockers without mutating:

```bash
proof liskov application retire APPLICATION_ID
```

Review existing jobs and their latest scheduled end, active reserves or
settlement reviews, and the records that will remain in the receipt.

## Start retirement

```bash
proof liskov application retire APPLICATION_ID \
  --reason "project complete" \
  --yes
```

Starting retirement atomically pauses the Application and stops new Liskov
work. It does not stop existing jobs, claw back chain spend, or erase evidence.

Retirement advances through these customer phases:

1. **waiting for execution** — existing schedules have not reached verified
   chain end;
2. **waiting for financial closure** — reserves, final charges, releases, or
   reviews remain;
3. **finalizing** — Liskov seals the durable record; and
4. **retired** — ordinary mutable state is gone and an immutable receipt is
   available.

## Cancel while allowed

Before the irreversible finalization boundary:

```bash
proof liskov application retire cancel APPLICATION_ID \
  --reason "retirement requested in error" \
  --yes
```

Cancellation leaves the Application paused. Resume separately after reviewing
policy, funding, and any ended jobs.

## Verify the receipt

The final receipt should bind the organization and Application UID, retirement
request and completion times, last policy/artifact/deployment/job facts,
execution and financial closure evidence, and receipt integrity identifier.
Keep it with your own operational records.

There is no public force-delete or force-stop bypass. If a phase remains
blocked beyond its stated boundary, follow
[Billing, settlement, and retirement](../troubleshooting/billing-retirement.md)
and escalate with non-secret evidence.
