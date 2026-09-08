---
title: Diagnose and retry
description: Resolve a typed blocker, use one supported retry when offered, and stop safely when evidence does not change.
---

# Diagnose and retry

Start with the organization Action Plan, not a generic “retry” instinct.
Retrying can create new work or spend and cannot correct a missing secret,
invalid policy, or insufficient balance. The Application-scoped Action Plan
page is withdrawn; per-Application attention lives on Deployments.

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
- import and publish a corrected manifest after a validation failure; or
- wait when the condition says an external schedule or settlement boundary has
  not arrived.

Changing something does not imply Liskov should immediately retry. Return to
the Action Plan and read the refreshed action.

Do not retry an ordinary managed **Not billed — no report filed** closeout. Its
zero charge and full reserve release are terminal, and no customer action is
required. A stronger signed-fatal or disagreement condition may still name a
different action; follow that typed condition instead.

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

A job is **Held** only when Liskov has evidence that your own code failed: a
signed runtime fatal from the job, or a crash under an explicit
`debug.holdOnFailure`. A processor going quiet, a matching failure, or a chain
delay is not a hold — those keep recovering on their own.

A hold stops that one job's next generation. It does not stop the money already
committed: the held generation still closes out and releases its reserve.

An Application with two jobs and one held keeps serving with the other, so it
can look healthy while running at half the capacity you asked for. The Console's
coverage view marks the held job and names that shortfall. From the CLI, the
release preview below is the read: it reports the held job, when it was held,
and the evidence digest, and it changes nothing.

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
