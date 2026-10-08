---
title: Pause and resume
description: Stop or restart future Liskov planning while respecting existing Acurast jobs and explicit confirmation.
---

# Pause and resume

Pause is an admission control for new Liskov work. It does not force-stop an
Acurast job, revoke a managed secret grant, drain an endpoint, or undo money
already committed on chain.

## Preview and pause

In the Console, open Application settings and review the pause preview. With
the CLI, omit `--yes` for the read-only response:

```bash
proof liskov application pause APPLICATION_ID \
  --reason "planned maintenance"
```

If the preview is correct:

```bash
proof liskov application pause APPLICATION_ID \
  --reason "planned maintenance" \
  --yes
```

The Application becomes **Inactive** for new planning. Existing jobs continue
to their scheduled end and may continue logging or using already delivered
configuration.

## Resume

Review resume without `--yes`, then confirm:

```bash
proof liskov application resume APPLICATION_ID \
  --reason "maintenance complete" \
  --yes
```

Resume allows Liskov to evaluate desired state again. It can create a new
successor and reserve new Service Credits; it does not revive an ended job.
Resolve organization Action Plan blockers before repeating resume.

### When a resume is refused

In the Console, **Resume application** asks for confirmation first. If Liskov
refuses the resume, the confirmation stays open and says why. Nothing is
changed:

- **Over the plan cap.** Resuming is refused when the organization would still
  be over a plan cap. Nothing running is stopped. Too many Applications:
  Retiring an Application frees a slot; pausing one does not. Too many
  [job slots](#job-slots): pausing another Application frees the job slots it
  holds.
- **Caps unreadable.** Liskov could not read your plan's caps at that moment,
  so it refused rather than guess. This usually clears by itself; choose
  **Try again** in a minute.
- **Being retired.** An Application that is being retired cannot be resumed.
  Its jobs stop at the end of their windows.
- **A held replacement.** A replacement job for the Application is held, and
  resuming would let it start. To go ahead, choose **Resume anyway**. It
  requires a reason, which is recorded in Activity with the resume. Otherwise
  choose **Cancel**, and the Application stays paused.

The codes behind these refusals are in
[Statuses, actions, and errors](../reference/statuses-actions-errors.md#action-plan-vocabulary).

Fixed-interval execution is release-gated; see
[Capabilities and limits](../reference/capabilities.md). Its accepted pause
behavior is that a paused interval Application starts no new occurrence, and
resume continues at the next future boundary: boundaries that passed while it
was paused are not run afterwards.

## Application caps and new starts

When `organization_over_plan_caps` names `max_applications`, the refusal's
`used` is the current Application slot count and `limit` is the resolved plan
allowance. Liskov refuses all customer publish/deploy, Run, and resume starts
while the organization is over that cap, before any spend. New scheduled
`once` and `interval` occurrences and a continuous Application's first job
are also refused; [Run again and fixed-interval execution](../reference/capabilities.md)
retain their release gates.

An already-running continuous Application keeps renewing, and recovery or
replacement of existing execution continues through the usual safety and
funding checks. Trial lapse itself stops no running job. Liskov does not
select Applications to pause or retire automatically.

**Pausing does not release an Application slot.** Current and Retiring
Applications still count. [Retire enough Applications](./retire.md#application-slots)
to bring `used` within `limit`, then check the count again. Exactly at the cap
(`used <= limit`) passes this check. Starting retirement alone does not free
capacity: wait until it completes and the Application is Retired.

An adequate resolved plan/payment state can also clear the refusal in an
enabled billing environment; customer paid-plan activation remains
[release-gated](../reference/capabilities.md). If you cannot retire enough
Applications, contact support before retrying. The [troubleshooting steps](../troubleshooting/billing-retirement.md#organization-is-over-its-application-cap)
explain how to read and verify the count.

## Job slots

Each plan gives the organization a pool of job slots:

| Plan | Job slots |
| --- | --- |
| Free | 2 |
| Developer | 10 |
| Pro | 50 |
| Business | 250 |
| Scale | 1,000 |
| Enterprise | By contract |

The plan catalog is available to read, but paid-plan activation remains
release-gated; a visible plan does not by itself change an organization's
current allowance.

An organization's usage is the sum of `deployment.jobs` over its active
Applications. Retries, replacement jobs, and the overlap while one job hands
over to the next do not count.

Pausing or retiring an Application releases its job slots. A paused
Application still holds its [Application slot](./retire.md#application-slots).

Liskov refuses the change when it would leave the organization over that pool:

- **Publish** and **resume** are refused when usage after the change would
  exceed the pool. A publish that lowers `deployment.jobs` enough is admitted
  even while the organization is over its pool.
- A **run** request, and a new scheduled start — an interval boundary, a
  `once` run, or an Application's first job — are refused while the
  organization is over its pool. A continuous job that is already running
  keeps renewing, and nothing running is stopped.

The refusal is `organization_over_plan_caps` with `feature` set to
`organization_job_slots`, plus `used` and `limit`. The same code with
`feature` set to `max_applications` is the Application cap. If the caps cannot
be read, the answer is `organization_plan_caps_unavailable`.

To get back inside the pool, lower `deployment.jobs` and publish, pause or
retire Applications, or move to a plan with a larger pool.

## Verify

After pause, verify inactive posture and the absence of newly admitted work;
separately observe any existing job through scheduled end. After resume,
verify a new plan/deployment only when policy requires one, then follow it to
runtime contact.

Pause is reversible. If you want permanent removal, use
[Retire an Application](./retire.md).

A **held** job is not a paused Application. Pause is your decision and stops all
new planning; a hold is Liskov's and applies to one stable job. A bootstrap hold
records repeated startup evidence before workload code ran; other holds may
follow signed application failure. Resume does not clear a hold, and releasing
a hold does not resume a paused Application. See
[Release a held job](./diagnose-retry.md#5-release-a-held-job).
