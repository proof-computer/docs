---
title: Application status and Action Plan
description: Read customer posture on an Application, then take only the organization Action Plan decisions Liskov has stopped on.
---

# Application status and Action Plan

An Application collects many detailed events into one customer posture. Start
there for *this* Application. The **Action Plan** is the organization queue of
work Liskov has stopped on and will not resolve without you.

The Console no longer has an Application-scoped Action Plan page. Per-Application
“what is wrong right now” lives on that Application’s Deployments index. “What
do I owe a decision on, across everything” is the organization Action Plan.

## Customer posture

| Posture | Meaning | Default response |
| --- | --- | --- |
| **Ready** | Current evidence satisfies the desired Application state. | Verify application output and monitor normally. |
| **In progress** | Liskov or Acurast is advancing work or waiting for an expected external fact. | Wait and use the timeline for context. |
| **Needs action** | A typed blocker needs customer input or offers a supported bounded action. | Open the organization Action Plan. |
| **Inactive** | The Application is paused, retiring, retired, or otherwise not admitting new execution. | Read the stated lifecycle reason. |

Posture is not a raw job state. One Application may have an old job still
running, a successor in progress, and an overall **Ready** or **Needs action**
assessment based on the desired policy.

## Organization Action Plan

Open **Action Plan** in the organization rail. It lists only jobs Liskov has
**stopped** on. A job Liskov is still retrying is not listed — the page says so
rather than silently omitting it.

Each hold names one cause and one action pair: **Resume trying** / **Stop**.
Causes are:

- **You stopped it** — paused or otherwise on your instruction.
- **Money** — Liskov will not spend past the authorised cap.
- **The application** — the workload, artifact, or policy version is at fault.

Platform uncertainty (including first-contact silence and register silence) is
never a customer decision. Per-code next-action prose stays on the execution
detail, not in this queue.

## Read from Console or CLI

Open the Application overview for posture, or the organization Action Plan for
decisions you owe. The CLI still reads one Application’s plan items:

```bash
proof liskov application status APPLICATION_ID
proof liskov application action-plan APPLICATION_ID
```

Record a stable decision ID from the CLI plan before acting. Do not translate
an internal event name into your own retry instruction.

## Retry only when offered

When the plan exposes retry authority:

```bash
proof liskov application action-plan retry APPLICATION_ID \
  --decision-id DECISION_ID \
  --reason "configuration corrected" \
  --yes
```

This is a bounded mutation for that decision. It does not mean “keep trying
until it works,” bypass spend limits, or override a different blocker. After
one retry, verify that a new timeline event references the decision. If the
same blocker remains, collect evidence and stop.

## Verify

Confirm the Application UID, effective policy digest, current deployment, and
last evidence time all belong to the intended Application. Then check whether
posture changed or a new supported action appeared.

See [Statuses, actions, and errors](../reference/statuses-actions-errors.md) for
literal tokens and [Diagnose and retry](./diagnose-retry.md) for the workflow.
