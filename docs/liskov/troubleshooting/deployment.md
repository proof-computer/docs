---
title: Deployment waiting or needs action
description: Distinguish expected registration, processor, bootstrap, and runtime waits from a typed blocker and safe retry boundary.
---

# Deployment waiting or needs action

Start with posture. In the Console, open **Action Plan** in the organization
rail to see every decision you owe. From the CLI, read one Application:

```bash
proof liskov application status APPLICATION_ID
proof liskov application action-plan APPLICATION_ID --json
proof liskov application deployment status APPLICATION_ID --json
```

The CLI `action-plan` command returns that one Application's plan items. It is
not the organization Action Plan page.

## Normal waiting

| Evidence | Interpretation |
| --- | --- |
| Policy/deployment created, no submission yet | Liskov can still be preparing funding, configuration, or launch authority. |
| Submitted, no processor | Acurast market assignment is pending. |
| Processor assigned, no runtime contact | The job can still be fetching, starting, and bootstrapping. |
| Runtime configuring | Identity/configuration/secrets/logging are advancing. |
| Runtime ready, no Application output | Check the workload's own tick or external-service behavior. |

Use the displayed stage timestamps and expected boundaries. Do not resubmit a
normal wait.

## Degraded, but nothing is on the Action Plan

If an Application says **Liskov checking launch** or **Liskov checking
deployment**, it is **In progress** and Liskov owns the next step. It can also
show as **Degraded** because required capacity is not running. The Action
Plan stays empty for it because there is no decision for you to make.

1. Confirm the Application is **In progress**, not **Needs action**.
2. In **Applications**, open the **Current #N · slot** link under the State
   column. Compare it with **Last finished**: a closed #103 there does not
   mean the open #104 is finished.
3. On that execution, read its current state and next step. When it says
   reconciliation runs on Liskov's next pass, there is no customer step.
4. Check again later. Do not submit, retry, release, pause, or resume to hurry
   it, and do not publish the same artifact again. None of these confirms the
   earlier launch, and a new submission can reserve more Service Credits.

If the same current execution stays unchanged, go to [Escalate](#escalate).

## A release you already requested

On the Action Plan, a row showing **Release requested** and “Liskov applies it
on its next pass” means your release was received. It counts under **Release
requested**, not **Decisions owed**. Do not release it again. To verify
progress, open the job's execution and look for the next generation. If the
row stays unchanged, go to [Escalate](#escalate).

## Job identity or execution evidence is unavailable

**Job identity not reported** means Liskov cannot assign the retained execution
to a stable job. Inspect its recorded status, Acurast number, and window in
Coverage. Do not assume it belongs to the first job or retry solely to make the
identity appear.

**Evidence unavailable** and **Not reported** are different from a confirmed
absence. A missing processor identity does not prove that no processor took
the job, and an unreadable charge does not mean a zero charge. Check the latest
successful observation and use the support bundle if the read remains unavailable.

## Needs action

**Needs action** means the organization Action Plan holds a job for this
Application and is waiting for your decision. Open the Action Plan and find
that Hold. The Application's label names its cause: **Add funds** when Liskov
stopped at the authorised spend cap, or **Review application failure** for
signed runtime/application or delivery evidence. See
[Service Credits](../organizations/service-credits.md) for how funding works
today.

For the CLI plan item, read `conditionClass`, `disposition`, `nextAction`,
decision ID, and scoped identifiers. Correct the named prerequisite. Examples
include insufficient credits, missing configuration, unsupported policy, no
affordable processor, or stale handoff.

Only use Action Plan retry when it is explicitly offered:

```bash
proof liskov application action-plan retry APPLICATION_ID \
  --decision-id DECISION_ID \
  --reason "named blocker corrected" \
  --yes
```

Submit once, then verify a new activity event. Repeated retries can consume the
bounded launch budget or create more review work.

If `conditionClass` is `processorAtMatchCap`, Liskov excludes that processor
and tries the next eligible candidate within the retry budget. If it is
`authoringFault`, do not retry the same policy. Correct the reported schedule
pointer: use at least 60 seconds for `durationMs`, at most one hour for
`maxStartDelayMs`, and no start more than 24 hours ahead.

## Runtime failure after contact

The first public policy waits to scheduled end rather than automatically
registering a fresh job on runtime failure. Check signed fatal/contact evidence,
external Acurast execution evidence, and scheduled end. A failure can remain
**In progress** and non-actionable while Liskov waits for honest terminal facts.

## Execution report was not filed

If a managed row says **Not billed — no report filed**, the strict report
deadline is closed and the finalized scanner proved absence. The customer was
charged zero, the full reserve was released, the financial state is closed, and
no customer action is required. Do not retry it to clear a review: there is no
review amount.

If the deadline is still open, the scanner is unavailable or outside coverage,
the evidence conflicts, or a read failed, settlement remains deferred. Stronger
signed-fatal and disagreement states keep their own Action Plan treatment.

## Processor record is not found or redacted

The processor page is organization-gated. Confirm that the active organization
is the one whose deployment supplied the processor link. An unknown processor
and one this organization has never used intentionally share the same not-found
result.

Redaction bars mean the active plan does not include Enterprise register
intelligence. They do not hide your own deployment history, runtime contact,
placement eligibility, attestation, or chain-published hardware. If an
Enterprise page says register data was not reported, treat that as missing data
rather than an entitlement failure. See
[Inspect a processor your organization used](../operate/processors.md).

## Intended capacity is not running

Coverage can show pending launch, unknown submission, or overdue required work
while posture is still **In progress**. That strip is not a second Action Plan.
See [Intended capacity versus remaining charges](./execution-coverage.md)
before retrying.

## Escalate

If the same condition remains past its documented observation window, collect
the [support bundle](./support.md). Do not use source-visible platform repair
commands or ask an administrator to declare ambiguous evidence successful.
