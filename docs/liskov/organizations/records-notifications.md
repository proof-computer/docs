---
title: Billing records and notifications
description: Read ledger and invoice records and enable only the notification categories and channels active in your Console.
---

# Billing records and notifications

Billing records answer what changed the Service Credit ledger. Notifications
help you notice an event; they are not the authoritative record and may arrive
later.

## Read records

In **Ledger**, match purchases, reserves, final charges, releases, refunds, plan
fees, and usage charges to their stable references. Invoice and receipt
previews, when a Stripe customer exists, live on **Account** and link out to
Stripe; Liskov does not store card numbers or invoice PDFs. Export CSV from
Ledger for your own records. Keep your organization's exported receipts with
its financial records.

When Stripe supplies a verified tax decomposition, an invoice preview shows
the subtotal before tax, VAT/tax, and total. A historical invoice without that
provider fact omits the breakdown rather than displaying zero tax. The Stripe
hosted/PDF invoice remains the document of record.

The CLI transaction read is safe for automation:

```bash
proof liskov organization billing transactions ORGANIZATION_ID \
  --limit 100 \
  --json
```

Treat transaction IDs, amounts, currency, status, related Application and
deployment IDs, timestamps, and evidence references as the audit facts.

## Configure notifications

Open **Notifications**. The supported v1 delivery path is a linked Telegram
chat with personal category toggles. Follow the Console instruction to send
`/connect` to `@liskov_by_proof_bot`, then confirm the channel shows
**Connected**. Enable only categories the Console lists as active; the current
active set covers deployment failure and success, operator actions,
configuration changes, replacement state, team events, billing, and
settlement.

Email, webhooks, spend-gate and budget-threshold alerts, security alerts,
digests, and delivery scheduling may be visible but are not active v1 controls.
Do not treat an inactive control as a promise. Never put a secret or full
billing instrument in a notification destination. For a shared Telegram
destination, control membership at Telegram as well as in Liskov.

## Verify

Save the preference and confirm its persisted state, then verify the next
harmless matching event in the linked Telegram chat. Always open Liskov to confirm posture or financial state before acting on a
message.

For support, share transaction and Application identifiers—not card details,
secret values, or bearer tokens.
