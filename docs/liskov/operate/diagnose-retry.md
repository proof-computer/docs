---
title: Diagnose and retry
description: Resolve a typed blocker, use one supported retry when offered, and stop safely when evidence does not change.
---

# Diagnose and retry

Start with the Action Plan, not a generic “retry” instinct. Retrying can create
new work or spend and cannot correct a missing secret, invalid policy, or
insufficient balance.

## 1. Identify the blocked decision

```bash
proof liskov application status APPLICATION_ID
proof liskov application action-plan APPLICATION_ID --json
```

Record the Application UID, policy digest, deployment/job IDs, condition code,
decision ID, disposition, next action, and evidence timestamp.

## 2. Correct the cause

Examples:

- add Service Credits when the condition says funding is insufficient;
- provide a required managed variable or secret;
- import and publish a corrected manifest after a validation failure; or
- wait when the condition says an external schedule or settlement boundary has
  not arrived.

Changing something does not imply Liskov should immediately retry. Return to
the Action Plan and read the refreshed action.

## 3. Use the bounded retry

Only when retry is offered:

```bash
proof liskov application action-plan retry APPLICATION_ID \
  --decision-id DECISION_ID \
  --reason "required secret configured" \
  --yes
```

Use the exact decision ID returned by the current Action Plan. One confirmed
request is enough. Do not loop the command, invent an idempotency key, or use
platform-admin/custody repair commands from source code.

## 4. Verify or escalate

Confirm the activity feed records the retry and whether a new deployment or
condition follows. If the same condition remains after its stated observation
window, stop. Collect the non-secret support bundle in
[Get support](../troubleshooting/support.md).

A supported retry does not override policy limits, billing safeguards,
processor-market reality, or retirement.
