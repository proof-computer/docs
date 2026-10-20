---
title: Diagnose and retry
description: Resolve a typed blocker, use one supported retry when offered, and stop safely when evidence does not change.
---

# Diagnose and retry

Start with the organization Action Plan, not a generic “retry” instinct.
Retrying can create new work or spend and cannot correct a missing secret,
invalid policy, or insufficient balance. The Application-scoped Action Plan
page is withdrawn; per-Application attention lives on Deployments.

## When Liskov is running behind

The Console header shows **Running behind · changes may be late** when
Liskov's newest full pass over Applications finished more than five and at
most fifteen minutes ago. Launches, stops, renewals and settlements are still
being applied, but may arrive later than usual. Jobs already running are
unaffected.

It shows **Changes on hold · running jobs continue** when no full pass has
finished for more than fifteen minutes, or no finished pass has been recorded.
Jobs already running continue to their scheduled end. Changes you ask for are
kept until Liskov resumes; a renewal due meanwhile waits. Open either chip's
note to see the finish time of the newest full pass in UTC, or that no
finished pass has been recorded.

Neither chip asks you to retry or resubmit anything. It clears on its own when
Liskov catches up. You do not need to take action.

## Advice and launch reconciliation

When **Processor pin** advice is shown on the organization Action Plan, it is
optional: review the existing Policy placement setting through **Review
processor pin**, or leave the pin unchanged and wait. It does not create a
Hold, stop automatic retries, or change the pin automatically. A recorded
scheduling or heartbeat check is not proof of an application failure. See
[Optional processor-pin advice](./status-action-plan.md#optional-processor-pin-advice)
before considering a policy publication and its spend effects.

**Liskov checking launch** is different: Liskov has not yet confirmed the
provider launch and owns reconciliation. Do not retry, release a reserve, or
broadcast again to fix a missing receipt. Another submission cannot settle the
earlier launch and can reserve more Service Credits. If the same execution
shows no progress for a prolonged period, collect the non-secret
[support bundle](../troubleshooting/support.md) and contact support. An optional
pin suggestion does not supply a recovery action for that launch.

## 1. Identify the blocked decision

```bash
proof liskov application status APPLICATION_ID
proof liskov application action-plan APPLICATION_ID --json
```

Record the Application UID, policy digest, deployment/job IDs, condition code,
decision ID, disposition, next action, and evidence timestamp.

## 2. Correct the cause

Examples:

- when funding is insufficient, verify the existing balance and stop; customer
  Stripe checkout and new Service Credit issuance remain release-gated;
- provide a required managed variable or secret;
- validate and publish a corrected retained Manifest V5 through the
  [bound source path](../build/validate-import-publish.md) after a validation
  failure; or
- wait when the condition says an external schedule or settlement boundary has
  not arrived.

Changing something does not imply Liskov should immediately retry. Return to
the Action Plan and read the refreshed action.

Do not retry an ordinary managed **Not billed — no report filed** closeout. Its
zero charge and full reserve release are terminal, and no customer action is
required. A stronger signed-fatal or disagreement condition may still name a
different action; follow that typed condition instead.

### Diagnose a funds stop

The V5 organization **Max spend per deploy** refusal and funds-stop readback
are [release-gated](../configure/spend-limits.md#organization-max-spend-per-deploy).
Once released, `v5_max_spend_per_deploy_exceeded` means one member attempt's
custody-plus-fee reserve exceeds the organization's USD limit. Read the actual
reserve, limit, and unit on the current Action Plan. Equality is allowed; a
zero limit still refuses a positive reserve. Lowering the limit can stop the
next renewal while the current job runs to its scheduled end.

Check which customer constraint needs attention: available Service Credit,
an authored per-job or recurring cap, or an organization limit. For the
per-deploy refusal, adding credit alone does not change the cap. Ask an
authorized administrator to review the intended limit, or publish a policy
with a lower supported reserve. Leave the job stopped if the spend is not
intended. Do not use the application-failure hold-release command below to
bypass a money limit.

The refused attempt reserves nothing and submits no chain effect. A fresh
admissible attempt clears its matching funds stop through normal launch
checks; verify the refreshed Action Plan and a later job generation. Use a
retry only if the current plan offers it.

A failure of Liskov's own chain funding is a platform condition, not a customer
funds stop. It does not ask you to add credit or raise a limit. If progress
remains blocked, collect the non-secret evidence in
[Get support](../troubleshooting/support.md).

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

## 5. Release a held job

A job is **Held** after proof-standard signed failure evidence or an explicit
`debug.holdOnFailure`. The exact stage matters. `runtime.fatal.bootstrap`
happens before workload code starts; it does not prove that the workload,
artifact, or policy changed. Application-stage fatals happen after bootstrap.
A processor going quiet, a matching failure, or a chain delay is not a hold.

A hold stops that one job's next generation. It does not stop the money already
committed: the held generation still closes out and releases its reserve.

An Application with two jobs and one held keeps serving with the other, so it
can look healthy while running at half the capacity you asked for. The Console's
coverage view marks the held job and names that shortfall. From the CLI, the
release preview below is the read: it reports the held job, when it was held,
and the evidence digest, and it changes nothing.

When more than one slot is held, the organization Action Plan shows each slot
once and binds each Release control to that hold ID. A new bootstrap hold may
also clear automatically if the same stable member and exact policy later
reports signed Ready. Contact or completed accounting alone is insufficient.

You have two ways back, and they are equivalent authorities:

- **Publish a corrected policy version.** Use this when the fix is in the
  manifest or the code you deploy.
- **Release the hold.** Use this when the cause is outside the published
  document — a secret you have now set, a dependency that has recovered — and
  the version you already published is the one you want to run.

Read what a release would do, then confirm it:

```bash
proof liskov application hold release APPLICATION_ID \
  --reason "missing secret configured"

proof liskov application hold release APPLICATION_ID \
  --reason "missing secret configured" \
  --yes
```

Add `--hold-id ID` when more than one job is held; the preview lists them. A
confirmed release is recorded once and applied on Liskov's next pass, so
running the command twice is one release, not two.

**Releasing does not repair your application.** The next generation launches
under the same published version. If the cause is still there it will fail
again and hold again, and the honest next step is a corrected publication
rather than a second release.

Verify the same way as any other action: the activity feed records the release,
the job's next generation appears at its scheduled boundary, and Coverage stops
reporting a shortfall.
