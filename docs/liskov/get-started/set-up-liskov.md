---
title: Set up Liskov
description: Sign in with GitHub, select an organization, and read its existing Service Credit state.
---

# Set up Liskov

This setup establishes the identity and organization context that will own your
Application.

:::info Liskov is invitation-only
Creating a new Liskov account requires an invitation. Signing in with an
identity that does not already have an account will not create one; you will be
shown an invitation-only notice instead. Request an invitation through the
[wait-list form](https://form.typeform.com/to/pNe4ot4a). An invitation arrives
by email as a single-use link that expires in 14 days; open the most recent one
you were sent. This does not affect existing accounts, sessions, or CLI logins.
:::

:::caution Release boundary
Plan selection, terms acceptance, Stripe checkout, and issuance of new USD
Service Credits are release-gated. A paid plan is not usable merely because a
plan id was written; it becomes usable only after reconciled Stripe/Autumn
payment state. Production paid billing is not enabled. Marketplace and Uptime
Prober are also limited to internal first-party engineering acceptance. This
page does not provide a customer funding or Marketplace launch path.
:::

## Before you begin

Liskov is available only for business use by people aged 18 or over. Do not
create an organization for personal, family, or household use. If you believe
your use is business use and need help, contact
[hello@proof.computer](mailto:hello@proof.computer).

You need an invitation to Liskov, a GitHub account, and access to an existing
Liskov organization. To
continue to a deployment, that organization must already be eligible for the
requested capability and have enough available Service Credits for its
displayed reserve.

## 1. Sign in

If you were invited, open the link in your invitation email. It opens a
sign-in page addressed to you.

Otherwise open the [Liskov Console](https://console.liskov.proof.computer).

Either way, choose **Continue with GitHub**, or ask for an email sign-in link.
Review the GitHub authorization and return to Liskov.

If you do not already have an account and have not been invited, Liskov tells
you it is invitation-only and links the wait-list form. Your sign-in itself
worked; nothing is broken and there is nothing to retry.

Liskov uses this identity for your session and, when you bring a repository,
to verify repository access. It does not make every repository visible to
other members of an organization.

## 2. Create or join an organization

Choose an existing organization if you have been invited. Otherwise, create
one with a clear business name. Enter the two-letter code for the country where
the business is established, then affirm the separate **Business use only**
statement. That statement confirms business purpose, that you are at least 18,
and that you have authority to create the Workspace for the named organization.
It is not the Terms checkbox and is not pre-selected.

The organization owns:

- Applications and their evidence;
- members and roles;
- capability and commercial-readiness state; and
- USD Service Credits and billing records.

Use the organization switcher before launching if you belong to more than one
organization. Moving to another organization changes the resources and balance
you are viewing; it does not transfer an Application.

## 3. Read Service Credit state

Open **Billing & funding** and read the available, reserved, and used Service
Credit amounts. These reads are supported; the presence of checkout or plan
controls does not make those mutations available.

Do not submit payment details or call an internal endpoint to add credit. If
the organization does not already have enough available Service Credits, stop
before publication or deployment.

## Verify

Before continuing, confirm that:

- the intended organization is active;
- the organization is eligible for the requested capability; and
- **Available** Service Credits are greater than zero.

A displayed **Reserved** amount is already held for in-progress work and is
not available for a new launch.

## Next

- [Deploy from GitHub](./github.md) with the checked Manifest V5 starter. You
  can build and validate it before the organization has credits; stop before
  publication if **Available** is not enough.

If sign-in, organization, or balance state does not update, use
[Sign-in, organization, and Service Credit reads](../troubleshooting/account-funding.md).
