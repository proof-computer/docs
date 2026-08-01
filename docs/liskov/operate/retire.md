---
title: Retire an Application
description: Safely stop new work, wait for schedule and financial closure, and obtain an immutable deletion receipt.
---

# Retire an Application

Retirement is the supported permanent lifecycle. It is asynchronous because
Liskov cannot honestly force-stop an Acurast registration it no longer owns:
existing jobs retain their chain schedules and financial consequences.

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

Retirement reports one of these phases while it is active:

1. **`terminalizing_local`** — Liskov is closing only locally controlled work;
2. **`waiting_for_schedule_end`** — existing schedules have not reached a
   verified chain end;
3. **`waiting_for_financial_tail`** — reserves, final charges, releases, or
   reviews remain; or
4. **`blocked`** — ambiguous or non-automatic evidence needs review.

Completion requires execution, financial, and ambiguity blocker counts to be
exactly zero. The Application then becomes deleted and the immutable receipt
replaces mutable retirement state.

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

The final receipt binds the organization and Application UID, requester,
reason, request and deletion times, initial and final assessments, retirement
event-stream head, and receipt digest. Keep it with your own operational
records.

There is no public force-delete or force-stop bypass. If a phase remains
blocked beyond its stated boundary, follow
[Billing, settlement, and retirement](../troubleshooting/billing-retirement.md)
and escalate with non-secret evidence.
