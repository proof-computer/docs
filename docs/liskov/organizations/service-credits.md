---
title: Read USD Service Credits
description: Read an organization's available, reserved, and used Service Credits while customer funding remains release-gated.
---

# Read USD Service Credits

USD Service Credits are the only customer balance. They are a non-transferable
prepaid claim against Liskov service, not a bank account, stablecoin, crypto
token, or withdrawable wallet.

:::caution Customer funding is release-gated
Plan selection, terms acceptance, Stripe checkout, and issuance of new Service
Credits are not yet supported customer flows. Current production acceptance is
limited to internal first-party organizations that are already pre-funded. Do
not submit payment details or call an internal funding endpoint.
:::

## Read the balance

The Console **Billing & funding** page shows the balance as an equation:

- **Settled** — counted ledger rows only;
- **Held** — open reserves and review holds, which are a ceiling, not a cost;
- **Available** — settled minus held; what a new deploy may draw on;
- **Promo** — promotional credit inside available, spent first and never refundable;
- **Refundable** — purchased value only.

The **Ledger** page is the line-by-line audit trail, including the running
balance after each counted row. A reserve, review hold, or released reserve
does not move that running balance.

CLI reads are also available:

```bash
proof liskov organization service-credits ORGANIZATION_ID
proof liskov organization billing ORGANIZATION_ID
```

These commands are read-only.

The billing projection and transaction history are authoritative for the
selected organization. A visible plan or checkout control does not change the
release classification. If a control is disabled or unavailable, do not seek
an internal workaround.

Liskov uses its treasury to settle Acurast reward and network fees. You do not
deposit ACU or USDC, manage an Acurast wallet, perform a swap, or withdraw the
underlying settlement assets.

## Verify

Confirm the organization ID, available/reserved/used amounts, transaction
history, and displayed currency. If a read appears stale or belongs to the
wrong organization, use
[Sign-in, organization, and Service Credit reads](../troubleshooting/account-funding.md).
