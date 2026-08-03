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
| What should I do next? | Action Plan |

## Read logs safely

The Console can narrow the returned window by product source, level,
deployment, and job. A successor and its predecessor may log at the same time,
so always keep deployment identity in view.

The CLI provides the same bounded product read:

```bash
proof liskov application logs APPLICATION_UID \
  --limit 100 \
  --deployment DEPLOYMENT_ID \
  --job JOB_ID \
  --origin customer
```

Use `--origin runtime-ssh` for Runtime SSH records, or `--origin all` for both
product sources. Deployment and job filters can be combined. The CLI does not
follow, tail, or page by time.

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

## Verify a monitoring view

Check the organization and Application UID first. Then confirm the policy,
deployment, job, processor, and runtime-instance IDs before correlating two
records. Compare timestamps as evidence from distributed systems; do not assume
every source has identical arrival time.

For emitting records, see [Logging and diagnostics](../configure/logging-diagnostics.md).
For missing output, see [Logs and diagnostics troubleshooting](../troubleshooting/logs.md).
