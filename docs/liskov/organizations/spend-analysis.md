---
unlisted: true
title: Read your organization's spend
description: Read settled Service Credit spend by day and consumption kind over 7, 30, or 90 UTC days, compare rolling 30-day totals, and read runway as an estimate.
---

# Read your organization's spend

:::danger[Not released]

The Billing **Spend** page is not released. No organization can open it yet,
and the billing read that serves its figures is not verified in production.
[Capabilities and limits](../reference/capabilities.md) owns what is
available, and [Read USD Service Credits](./service-credits.md) describes the
Billing & funding page you can use today.

This page is written as though final so that the contract can be reviewed
before the release. Read it as a design, not as a surface you can reach.

:::

**Spend** shows the Service Credits your organization has actually been
charged, day by day, split by what the charge was for. It is read-only: opening
it, changing its range, or reading its JSON never moves money, opens a
reserve, or changes a deployment.

Every figure on the page is computed by Liskov from the billing ledger. The
Console draws what the server serves; it does not add up ledger pages in your
browser.

## Open Spend

In the Console, open **Billing & funding**, then **Spend**. Spend is part of
Billing, not a separate section: **Billing & funding** stays selected in the
navigation, and the breadcrumb leads back to it. The page lives at
`/settings/billing/spend`.

Spend uses the same billing read as **Billing & funding**, so if you can open
that page you can open Spend. It shows one organization at a time, the one
selected in the Console, and never another organization's figures.

## Choose a range

Pick **7 days**, **30 days**, or **90 days**. Each range is a run of whole
**UTC days** ending with today. Liskov serves 90 days, oldest first, and the
shorter ranges are the most recent days of those 90.

Two details matter when you compare figures:

- **Days are UTC days**, not your local calendar day. A charge settled late in
  your evening can appear on the next day.
- **Today is partial.** Every figure counts charges settled up to the moment
  the page was read. A charge that settles later today appears when you reload.

A day with no charges shows **zero**. That is a measured answer, not missing
data: Liskov read the ledger for that day and found no counted charge.

The range selector changes only the chart and the daily table. It does not
change **Spend by application**, which always covers the current billing
period (see [below](#spend-by-application)).

## Read the consumption kinds

Each day is split into three kinds. Each is one ledger kind, so you can find
the same charges on the **Ledger** page.

| On Spend | Ledger kind | What it is | On the Ledger |
| --- | --- | --- | --- |
| **Compute** | `deploy_spend` | The settled charge for a deployment's work. | **Deployment** and the Application name |
| **Deployment fee** | `deployment_fee` | A percentage of settled deployment value. | **Deployment fee** |
| **Platform usage** | `usage_charge` | Metered usage above an allowance, such as managed logging or Runtime SSH bandwidth. It belongs to the organization, not to one Application. | **Platform usage**, or the meter's own name |

A day's total is the sum of its three kinds, and a range's total is the sum of
its days. All amounts are USD Service Credits, held by Liskov to the
micro-dollar (one millionth of a US dollar).

## What Spend counts, and what it leaves out

Spend shows **charged** money only: settled ledger rows of the three kinds
above. It includes charges that belong to the organization rather than to an
Application, so its total can be higher than the sum of your Applications'
charges.

These are not spend, and are never in the chart, the totals, or the daily
average:

- **Reserves.** A reserve temporarily sets aside Service Credits so bounded
  work can settle. It is held, not charged. When the work settles, what it used
  becomes a charge on the day it settles, and the rest is released.
- **Items in review and released reserves.** Neither is a charge.
- **Top-ups, refunds, and plan invoices.** These change your balance but are
  not consumption.

So a large reserve can lower **Available** on **Billing & funding** without
changing Spend at all. A charge appears on the day its settlement row is
written and does not move afterwards, so a past day's bar never shrinks. See
[Per-job caps, reserves, and final charges](./charges.md) for how a reserve becomes
a charge.

## Compare the last 30 days

Spend also shows two rolling 30-day totals, each split by kind:

- the **last 30 days**, up to the moment of the read; and
- the **30 days before that**.

The change between them is the last 30 days minus the 30 days before, so a
negative change means you spent less. Rolling windows count from the moment of
the read, not from midnight, so they do not line up exactly with the whole days
in the chart.

## Where spend is heading

Spend shows two forward-looking figures. Both are **estimates** from recent
spend. Neither is an invoice, a quote, a limit, or a promise.

- **Runway** is how many whole days your available Service Credits would last
  at your recent rate of spend.
- **Daily average** is your settled spend over the last 30 days divided by 30,
  rounded down. It is the same rate runway uses, so the two always agree.

Both need history. When your organization has fewer than seven days of counted
history, Spend shows that there is **not enough history yet** instead of a
number. A new organization sees this until it has been spending for a week.

With enough history but no charges in the last 30 days, the daily average is
zero and runway shows no figure: there is no rate to divide by, and Liskov does
not guess one.

An estimate moves as your spend moves: one busy day can shorten runway, and a
quiet week can lengthen it. Your actual charges are only the settled rows on
the **Ledger**. Spend does not draw a forecast band, a daily cap, or a chart of
held reserves.

## Spend by application

**Spend by application** lists the Applications with the most charges in the
**current billing period**, up to six, and totals the rest in one row. It stays
the current period whichever range you pick above; it is never relabelled as
7-, 30-, or 90-day spend.

Platform usage belongs to the organization, not to an Application, so it is not
in any Application's row.

## When a figure is missing

Spend keeps three situations apart, and never shows one as another:

- **No spend.** Every day is present and zero. Your organization was charged
  nothing in the range.
- **Not enough history.** The days and totals are measured, but runway and the
  daily average say there is not enough history yet.
- **The read failed.** Spend shows that billing could not be read, and draws
  no figures. It does not show zeros in their place, because zero would be a
  claim that you were charged nothing. Reload the page; if it keeps failing,
  use [Sign-in, organization, and Service Credit reads](../troubleshooting/account-funding.md).

## Read the same figures as JSON

The organization billing read carries these figures in a `spendHistory` block.
The CLI prints the raw response with `--json`:

```bash
proof liskov organization billing ORGANIZATION_ID --json
```

This command is read-only. The block's fields, all amounts in micro-USD:

| Field | Meaning |
| --- | --- |
| `dayBasis` | How days are cut. Always `utc_day`. |
| `asOfMs` | The instant every figure counts up to, as Unix milliseconds. The last day is partial. |
| `days` | Exactly 90 entries, oldest first. Each has `dayStartMs` (00:00 UTC) and `managedComputeMicros`, `deploymentFeeMicros`, `usageChargeMicros`, `totalMicros`. A day with no charges is zeros. |
| `current30d` | `fromMs`, `throughMs`, and the same four amounts, for the 30 days ending at `asOfMs`. |
| `previous30d` | The same, for the 30 days before `current30d`. |
| `changeMicros` | `current30d.totalMicros` minus `previous30d.totalMicros`. Can be negative. |
| `burnWindowDays` | The window the daily average and runway are measured over: `30`. |
| `averageDailyBurnMicros` | The daily average. |
| `periodEndProjection` | An estimate of the current period's total: `label` (always `estimate`), `periodStartMs`, `periodEndMs`, `consumedMicros` so far, `remainingMs`, `projectedAdditionalMicros`, and `projectedTotalMicros`. |

`averageDailyBurnMicros` and `periodEndProjection` can be absent. Each is an
object with `present`, `value`, and `reason`; when `present` is `false`,
`value` is `null` and `reason` says why:

- `insufficient_history` — fewer than seven days of counted history. Runway
  is also absent for this reason when there were no charges in the last 30
  days.
- `no_current_period` (projection only) — the billing period the read is built
  on does not contain now, so there is no remainder to project across.

The period-end projection is the period's charges so far plus the daily
average across the time left. It is an estimate: Liskov never stores it, never
bills it, and does not draw it on the Spend page. What you are charged for a
period is the settled ledger rows in it.

## Verify

Match a day on Spend to its rows on **Ledger** (from **Billing & funding**): the
settled `deploy_spend`, `deployment_fee`, and `usage_charge` rows on that UTC
day add up to the day's total. Reserve, review, and release rows are not part
of it. Or page through the same rows read-only:

```bash
proof liskov organization billing transactions ORGANIZATION_ID \
  --limit 25
```

Never work out spend by subtracting two displayed balances; a reserve changes
**Available** without being a charge. For a reserve that stays open or an item
in review, see
[Billing, settlement, and retirement](../troubleshooting/billing-retirement.md).
