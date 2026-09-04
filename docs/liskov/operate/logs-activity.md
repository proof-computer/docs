---
title: Monitor logs and activity
description: Use application logs, lifecycle activity, and signed diagnostics for their distinct purposes.
---

# Monitor logs and activity

Use the narrowest signal that answers your question:

| Question | Surface |
| --- | --- |
| What did my code report? | Application **Logs** |
| What changed in Liskov? | Application or organization **Activity** |
| Where is this deployment? | Deployment timeline |
| Did the bound process bootstrap and become ready? | Signed runtime diagnostics |
| What should I do next? | Organization Action Plan |

## Read logs safely

The Console can narrow the returned window by product source, level,
deployment, and job. A successor and its predecessor may log at the same time,
so always keep deployment identity in view.

The CLI provides the same product read:

```bash
proof liskov application logs APPLICATION_UID \
  --limit 100 \
  --deployment DEPLOYMENT_ID \
  --job JOB_ID \
  --origin customer
```

It can also stream new records live, page through the full retained history,
filter by event name, and emit machine-readable lines:

```bash
# Stream new records until interrupted.
proof liskov application logs APPLICATION_UID --follow

# Page through the full retained history oldest-first.
proof liskov application logs APPLICATION_UID --from-start

# Filter by event name; emit one raw record JSON object per line.
proof liskov application logs APPLICATION_UID --from-start --ndjson \
  --event 'runtime.access.*'
```

Use `--origin runtime-ssh` (or `runtime_ssh`) for Runtime SSH records, or
`--origin all` for both product sources. Deployment and job filters can be
combined. `--follow` attaches at the newest record and then polls forward
without losing records. `--from-start` uses cursor pagination, so a busy
channel cannot push older records out of reach.

## Retained log history

Liskov deletes application-log batches after the window included with the
organization's plan. The window applies to application logs and Runtime SSH
session logs alike:

| Plan | Retained history |
| --- | --- |
| Free | 24 hours |
| Developer | 3 days |
| Pro | 14 days |
| Business | 30 days |
| Scale | 90 days |
| Enterprise | 90 days |

Export records you need before their window ends. The plan catalog is available
to read, but paid-plan activation remains release-gated; a visible plan does
not by itself change an organization's current allowance.

Application logs are selected by customer code. They can explain business
behavior but are not an authoritative lifecycle ledger. Treat any accidental
credential as compromised: revoke it at the provider, rotate the managed
secret, and avoid copying the record further.

## Read activity

The Console provides the customer-facing activity feed. The CLI supports a
bounded read:

```bash
proof liskov application activity APPLICATION_ID \
  --limit 50 \
  --json
```

Use `--before EPOCH_MILLISECONDS` to page backward. Prefer stable public
identifiers and typed conditions over raw internal event names.

A managed settlement activity carrying `report_absent_not_billed` means **Not
billed — no report filed**: zero charged, full reserve release, closed financial
state, and no customer action. It is a settled activity, not a missing-report
review. Application logs and signed runtime evidence remain separate facts.

## Verify a monitoring view

Check the organization and Application UID first. Then confirm the policy,
deployment, job, processor, and runtime-instance IDs before correlating two
records. Log records carry a `runtimeInstanceId` field — shown as the INSTANCE
column in CLI human output — that identifies which runtime instance wrote the
record, so a restarted instance within one deployment can be distinguished
directly. Compare timestamps as evidence from distributed systems; do not
assume every source has identical arrival time.

For emitting records, see [Logging and diagnostics](../configure/logging-diagnostics.md).
For missing output, see [Logs and diagnostics troubleshooting](../troubleshooting/logs.md).
