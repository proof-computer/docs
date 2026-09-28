---
title: Retire an Application
description: Safely stop new work, wait for schedule and financial closure, and obtain an immutable deletion receipt.
---

# Retire an Application

Retirement is the supported permanent lifecycle. It is asynchronous because
Liskov cannot honestly force-stop an Acurast registration it no longer owns:
existing jobs retain their chain schedules and financial consequences.

An Application is **Current**, **Retiring**, or **Retired**. Those three words
are what the Console and `proof liskov application list` show. In the API and in
persisted data a retired Application's `status` is `deleted`; that is a
compatibility detail for deployed clients, not the customer-facing word. See
[Statuses, actions, and errors](../reference/statuses-actions-errors.md) for
the full table.

## Application slots

Your plan includes a number of Applications. **Current and Retiring
Applications hold a slot; a Retired one releases it.** Pausing is not
retirement: a paused Application keeps its slot, because it can be resumed. If
creating an Application is refused with `application_quota_exceeded`, the
response says how many slots are in use and what the limit is — retire an
Application you have finished with, rather than pausing it, to free one.

## Preview

Read current retirement state and blockers without mutating:

```bash
proof liskov application retire APPLICATION_ID
```

Review existing jobs and their latest scheduled end, active reserves or
settlement reviews, and the records that will remain in the receipt.

## Start retirement

```bash
proof liskov application retire APPLICATION_ID \
  --reason "project complete" \
  --yes
```

Starting retirement atomically pauses the Application and stops new Liskov
work. It does not stop existing jobs, claw back chain spend, or erase evidence.

Retirement reports one of these phases while it is active:

1. **`terminalizing_local`** — Liskov is closing only locally controlled work;
2. **`waiting_for_schedule_end`** — existing schedules have not reached a
   verified chain end;
3. **`waiting_for_financial_tail`** — reserves, final charges, releases, or
   reviews remain; or
4. **`blocked`** — ambiguous or non-automatic evidence needs review.

Completion requires execution, financial, and ambiguity blocker counts to be
exactly zero. The Application then becomes deleted and the immutable receipt
replaces mutable retirement state.

While retirement is active, the blockers are grouped into correlated
obligations, each naming who must act: Liskov, the Acurast chain, or operator
review. Most need nothing from you — an obligation waiting on a chain schedule
is progressing correctly. Only an obligation marked for operator review is one
to raise, and the
[remediation table](../reference/statuses-actions-errors.md#retirement) says
which classes those are.

## Cancel while allowed

Cancellation is possible only while the retirement is **active, before
finalization**:

```bash
proof liskov application retire cancel APPLICATION_ID \
  --reason "retirement requested in error" \
  --yes
```

Cancellation leaves the Application **paused** — it does not resume it. Resume
separately after reviewing policy, funding, and any ended jobs. Work this
retirement attempt already terminalized stays terminalized; cancelling does not
restore it, and a later retirement request creates a fresh retirement ID.

If the retirement finalizes first, the cancellation returns
`retirement_already_completed` **with the immutable receipt**. That is a
success, not a failure: the Application is retired, and there was nothing left
to cancel.

## Verify the receipt

The final receipt binds the organization and Application UID, requester,
reason, request and deletion times, initial and final assessments, retirement
event-stream head, and receipt digest. Keep it with your own operational
records.

The receipt records which kind of ending it was. A `safe_retirement` receipt
proves a zero gate at completion. A `legacy_immediate_tombstone` records a
historical deletion made before safe retirement existed; it is **not** proof of
a zero gate, and any resources it left behind are cleaned up separately and
shown separately. The Console labels both.

There is no public force-delete or force-stop bypass. If a phase remains
blocked beyond its stated boundary, follow
[Billing, settlement, and retirement](../troubleshooting/billing-retirement.md)
and escalate with non-secret evidence.

## Find a retired Application

A retired Application leaves the Console's **Applications** list and is not
counted in its totals. At the foot of the list, follow **Retired applications**
(shown with a count when the Console knows how many there are). It opens the
retired archive at `/applications?view=retired`. The archive has its own search
and loads more rows as you page. Its history and ledger rows remain.

Opening, searching, or paging the archive is read-only. It does not release,
settle, or refund anything, and it does not restart the Application.

Each archived row shows:

| Column | What it means |
| --- | --- |
| **Application** | The Application's name and source repository. |
| **Retired** | The date the Application was retired, taken from its canonical deletion record. |
| **By** | The person who requested the retirement, as recorded on the deletion receipt. This is not the Liskov worker that completed it. |
| **Lifetime spend** | Settled Service Credit spend attributed to this Application over its whole retained history. The column appears only when your role can read the organization's billing. |
| **Receipt** | A **Deletion receipt** link and its kind: **Safe retirement** or **Legacy tombstone**. |

Select a row or its receipt link to open the retired Application's settings and
its deletion receipt. A **Legacy tombstone** in the archive is still not proof
of a zero gate, as described above.

**Lifetime spend** counts the settled compute (`deploy_spend`), deployment fee
(`deployment_fee`), and platform usage (`usage_charge`) ledger rows that name
this Application. Open reserves, review holds, released reserves, and
organization charges that name no Application are not part of it. For the
difference from the list's 30-day figure, see
[Read USD Service Credits](../organizations/service-credits.md#spend-on-the-applications-pages).

**Not reported** is different from zero:

- **$0.00** means the ledger recorded this Application and settled no spend for
  it.
- **Not reported** under **Lifetime spend** means the ledger has no record that
  names this Application, or the spend read failed. It is not zero, and it is
  not an estimate. The row's other columns are still correct.
- **Not reported** under **By** means the receipt did not record who asked for
  the retirement, as with some historical deletions. Liskov does not substitute
  the worker that completed the deletion or another name.
- **Not reported** under **Retired** means the row did not include a deletion
  time.

While the spend read is in progress, the **Lifetime spend** cell is empty.
