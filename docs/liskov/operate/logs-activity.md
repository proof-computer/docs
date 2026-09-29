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

## Open, share, and step through events

:::danger[Release-gated]

Event detail, shareable event links, previous and next navigation, the
**Range** picker, and the event context column are release-gated v1. They are
not yet accepted on the deployed Console, so do not rely on them until
[Capabilities and limits](../reference/capabilities.md) lists them as v1. The
feed and the CLI read above are unchanged.

:::

Everything in this section only reads. Opening, copying, or paging through
events changes nothing and spends nothing.

### Open an event

Select a row in organization **Activity** or in an application's **Activity**
tab. Its detail opens in a dialog over the feed; press Escape or close it to
return to the same place in the list. The dialog's headline links to the
event's own page.

### Share an event

Every event has one canonical address:

```text
/activity/EVENT_ID?org=ORGANIZATION_ID
```

The address names the organization. The event page reads that single event
only when the organization in the address is your active organization; it
never shows data from another organization. Anyone you share it with needs
access to that organization.

On the event page, **Copy link** copies the full address. The button shows
**Copied** only after your browser accepts the copy. If the browser refuses
clipboard access, the page says it could not copy the link; copy the address
bar instead.

To verify a shared link, open it while signed in with that organization
active. The page is titled **Event detail** and shows the event you copied. An
address that names a different organization shows **Activity unavailable**, and
an id that organization does not have shows **Event not found**.

### Step through the feed you came from

**Previous** (`k`) and **Next** (`j`) follow the list you opened the event
from, newest first, with its category chip, Range, and search kept. Search
matches only rows already loaded. When you reach the oldest loaded row,
**Next** loads one older page with the same filters. **Back to Activity**
returns to that feed.

An event opened from a shared link, or after a page refresh, has no
originating list, so **Previous** and **Next** are disabled. The page never
substitutes a different feed. The `j` and `k` keys are ignored while you type
in a field or with a modifier key held.

### Choose a Range

On organization **Activity**, the **Range** picker sits beside the
**Timeline** heading: **Last 7 days** (the default), **Last 30 days**, **Last
90 days**, or **All time** for every event the organization keeps. Changing
Range or the category chip reloads the feed from the newest event. A live
update adds new events without resetting your filters or the older rows you
have loaded.

### Read the event context

The event page shows context beside the event. Each section reads only what
the event itself names, and each can be unavailable on its own without hiding
the others:

| Section | Shown when | What it reads |
| --- | --- | --- |
| **This deployment** | The event names an application and a deployment | That deployment's events among the application's latest 50 Activity events, plus this event. It is not complete history. |
| **Now** | Always | The application's current state and the deployment's current outcome. An event that names no application says so. A past event does not mean the deployment is healthy now. |
| **Needs you** | A hold, parked, or platform-alert event that exactly matches a current Action Plan item | A link to the Action Plan. A hold that has since been resolved shows nothing. |
| **Money** | A spend event | The exact Ledger transaction the event names, from the latest 50 Ledger rows: its amount and the balance after it. A zero balance shows as zero. Without an exact match, the section says exact Ledger context is unavailable and links to the Ledger. |

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
