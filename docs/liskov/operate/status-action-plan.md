---
title: Application status and Action Plan
description: Read the customer posture, distinguish waiting from a blocker, and take only the supported next action.
---

# Application status and Action Plan

An Application collects many detailed events into one customer posture. Start
there; use the timeline only when you need the underlying evidence.

## Customer posture

| Posture | Meaning | Default response |
| --- | --- | --- |
| **Ready** | Current evidence satisfies the desired Application state. | Verify application output and monitor normally. |
| **In progress** | Liskov or Acurast is advancing work or waiting for an expected external fact. | Wait and use the timeline for context. |
| **Needs action** | A typed blocker needs customer input or offers a supported bounded action. | Follow the Action Plan once. |
| **Inactive** | The Application is paused, retiring, retired, or otherwise not admitting new execution. | Read the stated lifecycle reason. |

Posture is not a raw job state. One Application may have an old job still
running, a successor in progress, and an overall **Ready** or **Needs action**
assessment based on the desired policy.

## Read from Console or CLI

Open the Application overview, or run:

```bash
proof liskov application status APPLICATION_ID
proof liskov application action-plan APPLICATION_ID
```

The Action Plan groups a decision with its conditions, disposition, and next
action. Record its stable decision ID before acting. Do not translate an
internal event name into your own retry instruction.

## Retry only when offered

When the Action Plan exposes retry authority:

```bash
proof liskov application action-plan retry APPLICATION_ID \
  --decision-id DECISION_ID \
  --reason "configuration corrected" \
  --yes
```

This is a bounded mutation for that decision cohort. It does not mean “keep
trying until it works,” bypass spend limits, or override a different blocker.
After one retry, verify that a new timeline event references the decision. If
the same blocker remains, collect evidence and stop.

## Verify

Confirm the Application UID, effective policy digest, current deployment, and
last evidence time all belong to the intended Application. Then check whether
posture changed or a new supported action appeared.

See [Statuses, actions, and errors](../reference/statuses-actions-errors.md) for
literal tokens and [Diagnose and retry](./diagnose-retry.md) for the workflow.
