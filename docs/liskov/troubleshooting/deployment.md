---
title: Deployment waiting or needs action
description: Distinguish expected registration, processor, bootstrap, and runtime waits from a typed blocker and safe retry boundary.
---

# Deployment waiting or needs action

Start with posture and the current Action Plan:

```bash
proof liskov application status APPLICATION_ID
proof liskov application action-plan APPLICATION_ID --json
proof liskov application deployment status APPLICATION_ID --json
```

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

## Needs action

Read `conditionClass`, `disposition`, `nextAction`, decision ID, and scoped
identifiers. Correct the named prerequisite. Examples include insufficient
credits, missing configuration, unsupported policy, no affordable processor,
stale handoff, or ambiguous evidence.

Only use Action Plan retry when it is explicitly offered:

```bash
proof liskov application action-plan retry APPLICATION_ID \
  --decision-id DECISION_ID \
  --reason "named blocker corrected" \
  --yes
```

Submit once, then verify a new activity event. Repeated retries can consume the
bounded launch budget or create more review work.

## Runtime failure after contact

The first public policy waits to scheduled end rather than automatically
registering a fresh job on runtime failure. Check signed fatal/contact evidence,
external Acurast execution evidence, and scheduled end. A failure can remain
**In progress** and non-actionable while Liskov waits for honest terminal facts.

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

## Escalate

If the same condition remains past its documented observation window, collect
the [support bundle](./support.md). Do not use source-visible platform repair
commands or ask an administrator to declare ambiguous evidence successful.
