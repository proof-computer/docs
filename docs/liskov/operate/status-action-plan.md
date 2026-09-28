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
| **In progress** | Liskov or Acurast is advancing work, Liskov is checking a launch, or Liskov is waiting for an expected external fact. | Wait and use the timeline for context. |
| **Needs action** | The Application has a current Hold on the organization Action Plan that is waiting for your decision. | Open the organization Action Plan. |
| **Inactive** | The Application is paused, retiring, retired, or otherwise not admitting new execution. | Read the stated lifecycle reason. |

Posture is not a raw job state. One Application may have an old job still
running, a successor in progress, and an overall **Ready** or **Needs action**
assessment based on the desired policy.

**Needs action** and the Action Plan always agree: an Application shows
**Needs action** only when the organization Action Plan holds at least one of
its jobs and that Hold still needs your decision. If you cannot find it there,
there is nothing for you to decide.

### Health and responsibility are separate

Posture answers *whose move it is*. The Application's health, such as
**Degraded**, answers *whether its required capacity is running*. They are
independent:

- An Application can be **Degraded** and **In progress** at once. Liskov owns
  that work, and you do not need to retry, release, or resubmit anything.
- An Application can be **Needs action** while every slot is still serving,
  for example when one held job is waiting on a decision.

A red or amber color, or capacity below what you asked for, does not by itself
mean you are responsible. Read the posture label.

### Liskov checking launch

**Liskov checking launch** means Liskov asked the provider to start a job and
has not yet confirmed what happened. Confirming it is Liskov's work: it checks
again on its own, and while it does, the Application stays **In progress** and
does not appear on the Action Plan. The Application may also be **Degraded** if
the launch was meant to replace capacity that is not running.

Do not submit, retry, or release anything to hurry it along. Nothing in the
Console or CLI asks you to. A repeated submission cannot settle the earlier
launch, and it can reserve more Service Credits. If the same execution stays
in this state without progress, collect the
[support bundle](../troubleshooting/support.md) and contact support. A long
wait here is still Liskov's to resolve, not a decision you have missed.

### Current execution and last finished

The Console **Applications** list shows two different executions:

- the **State** column's posture, with a **Current #N · slot** link under it
  when an execution is still open; and
- the **Last finished** column, which names the most recent execution that
  has ended.

Both can be true at once. For example, **Last finished** can show #103 closed
while **Current #104 · slot-0** is still being checked. A finished predecessor
does not mean the Application's current work is done. Open the current link to
read that execution. If the current execution is not reported, the list shows
only what Liskov has served and does not guess from the last finished one.

## Organization Action Plan

Open **Action Plan** in the organization rail. It lists only jobs Liskov has
**stopped** on. Retryable work remains off the page while Liskov is still
handling it.

Jobs sit under their Application, because the actions work at two levels:

- **Release hold** is on each held job's row. It applies to that one exact
  held slot, can launch a later generation, and can spend Service Credits.
- **Pause application** or **Resume application** is on the Application's
  header, once per Application. Pause stops planning new work for the whole
  Application. Resume restarts planning for a paused Application. It does not
  release a held slot.

The release and lifecycle actions are independent. An Application with two
held slots shows two rows, each with its own **Release hold**, under one header
with one lifecycle action.

Each row shows the cause, one line of guidance, and links to the job's
**Execution**, **Logs**, **Secrets**, or **Policy**, whichever that cause
needs. It also shows when the job stopped: **Held since** a UTC time for a held
job, or **Stopped since** for any other stopped job. Rows under a V4 policy
have no time. The exact per-code next action is still on the execution detail.

### Every action asks first

Choosing an action opens a confirmation in the Console. Nothing is sent until
you confirm it there. The confirmation shows:

- for **Release hold**: what failed, when it was held, and what else is held on
  the same Application, each released on its own;
- for **Pause application** or **Resume application**: the Application's held
  jobs, which stay held.

It takes an optional **Reason**. The reason is recorded with the action and
shown in [Activity](./logs-activity.md#read-activity). **Cancel** changes
nothing. If Liskov refuses the action, the confirmation says why in a sentence
and stays open.

### How a hold is released

A held job stays held until one of these releases it:

- you choose **Release hold**;
- you publish a new policy version for the Application; or
- for an eligible setup (bootstrap) hold, the same job later reports that it
  started cleanly.

A new bootstrap hold can clear automatically when the same stable member under
the same exact policy later supplies signed Ready evidence. Application-stage
fatals and explicit `debug.holdOnFailure` holds never clear by themselves:
release them, or publish a new policy version.

After you release a hold, the row shows **Release requested** and “Liskov
applies it on its next pass,” with the time you requested it. When the release
takes effect, the job leaves the page. Activity records the release.

### A paused Application with a held job

A pause and a hold are two separate gates. When an Application is paused and
one of its jobs is held, the Action Plan shows both as a two-step checklist:
release the held job, then resume the Application. Either step can go first.

Releasing a hold does not resume a paused Application, and resuming does not
release a hold. The Application runs again when both are done.

### Totals

The page's totals count held jobs, not Applications:

- **Decisions owed** — Holds still waiting for you.
- **Release requested** — Holds you have already released. Liskov has
  received your decision, and you do not need to make it again. A release
  requested is not another decision owed.
- **Applications** — distinct Applications with at least one Hold.

The Applications summary counts Applications, so its **Needs action** number
does not have to equal **Decisions owed**. To confirm a requested release is
progressing, open the job's execution and wait for a later generation to
appear. Do not release it a second time.

The page shows at most 100 stopped jobs. When there may be more,
**Decisions owed** reads **100+** and the page says “Showing the first 100
stopped jobs. There may be more.” Each Application's Deployments page lists
all of its own.

If the Action Plan cannot be read, the page says so and offers **Try again**. That is not an empty queue, and it
does not mean nothing is waiting on you. An empty queue says **Nothing needs a
decision**.

### Causes

Causes include:

- **You stopped it** — paused or otherwise on your instruction.
- **Money** — Liskov will not spend past the authorised cap.
- **Runtime or application** — read the exact signed failure stage. A bootstrap
  failure happened before workload code started and is not evidence that the
  workload, artifact, or policy changed.

Platform uncertainty (including first-contact silence, register silence, and a
launch Liskov is still checking) is never a customer decision.

## Read from Console or CLI

Open the Application overview for posture, or the organization Action Plan for
decisions you owe. The CLI reads one Application at a time. Its
`application action-plan` command returns that Application's plan items; it is
not the organization Action Plan page:

```bash
proof liskov application status APPLICATION_ID
proof liskov application action-plan APPLICATION_ID
```

Record a stable decision ID from the CLI plan before acting. Do not translate
an internal event name into your own retry instruction.

Coverage on Overview and Executions reports intended versus effective capacity
and remaining charges. It is not a second Action Plan and does not introduce a
retry. When selected and proposed disagree, the selected line is authoritative.
See [Intended capacity versus remaining charges](../troubleshooting/execution-coverage.md).

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
