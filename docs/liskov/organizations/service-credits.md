---
title: Plans and USD Service Credits
description: Choose a plan, fund Liskov with Stripe USD, and read the only customer balance.
---

# Plans and USD Service Credits

USD Service Credits are the only customer balance. They are a non-transferable
prepaid claim against Liskov service, not a bank account, stablecoin, crypto
token, or withdrawable wallet.

## Choose a plan

Open **Billing & funding**, compare the displayed plan limits and fees, and
select the plan appropriate to your organization. Accept the applicable terms.
Only an organization admin can change billing settings.

Plan limits can cover Applications, users, configuration, retention, and
deployment capabilities. The Console's current plan catalog is authoritative;
the docs do not hard-code commercial prices.

## Add funds

Choose **Add funds**, enter a positive USD amount with no more than two decimal
places, and continue to Stripe's secure checkout. Return to Liskov after
payment. Credits appear only after server-side payment confirmation.

Do not retry checkout only because a browser redirect is slow. First refresh
the authoritative balance and billing records.

## Read the balance

The Console separates:

- **Available** — usable for a new reserve;
- **Reserved** — held for bounded in-progress work;
- **Used** — settled consumption for the period; and
- promotional credit, when the organization has it.

CLI reads are also available:

```bash
proof liskov organization service-credits ORGANIZATION_ID
proof liskov organization billing ORGANIZATION_ID
```

These commands are read-only.

Liskov uses its treasury to settle Acurast reward and network fees. You do not
deposit ACU or USDC, manage an Acurast wallet, perform a swap, or withdraw the
underlying settlement assets.

## Verify

Confirm the organization ID, plan, payment record, available/reserved/used
amounts, and displayed currency. If Stripe succeeded but the balance did not
change, collect the checkout/payment reference without card details and use
[Sign-in, organization, and funding](../troubleshooting/account-funding.md).
