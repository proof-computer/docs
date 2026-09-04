---
title: Organizations & billing
description: Manage organization access and read Service Credit, charge, and billing history.
---

# Organizations & billing

An organization keeps Applications, team access, and billing separate from
other Liskov work. Every Application belongs to one organization.

- [Organizations and teams](./teams.md)
- [Roles and access](./roles.md)
- [Read USD Service Credits](./service-credits.md)
- [Quotes, reserves, and final charges](./charges.md)
- [What each deployment outcome costs](./network-costs-and-outcomes.md)
- [Billing records and notifications](./records-notifications.md)

USD Service Credits are the only customer balance. Liskov uses its own
treasury to pay Acurast network costs; you do not deposit, hold, swap, or
withdraw ACU through Liskov.

The Console splits money across three Manage pages and one plans surface:

- **Account** (`/settings/account`) — organization identity, current plan, and
  Stripe-owned billing identity / invoice preview when a Stripe customer exists.
- **Billing & funding** (`/settings/billing`) — the Service Credit equation
  (settled − held = available), add funds, current-period usage, spend guards,
  and recent activity.
- **Ledger** (`/settings/ledger`) — the paged audit trail, including running
  balance after each counted row, holds, lineage, and CSV export.
- **Plans** (`/organizations/new/plan`) — the catalog for a new or existing
  organization. It is not a wizard step; the organization already exists on
  Free when it renders.

Customer plan selection, terms acceptance, Stripe checkout, and new Service
Credit issuance remain release-gated. Existing balance and ledger **reads** are
supported. A visible plan or checkout control is not issuance.
