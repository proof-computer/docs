---
title: Set up Liskov
description: Sign in with GitHub, select an organization, and read its existing Service Credit state.
---

# Set up Liskov

This setup establishes the identity and organization context that will own your
Application.

:::caution Release boundary
Plan selection, terms acceptance, Stripe checkout, and issuance of new USD
Service Credits are release-gated. Marketplace and Uptime Prober are also
limited to internal first-party engineering acceptance. This page does not
provide a customer funding or Marketplace launch path.
:::

## Before you begin

You need a GitHub account and access to an existing Liskov organization. To
continue to a deployment, that organization must already be eligible for the
requested capability and have enough available Service Credits for its
displayed reserve.

## 1. Sign in

Open the [Liskov Console](https://console.liskov.proof.computer) and choose **Continue with GitHub**. Review the GitHub
authorization and return to Liskov.

Liskov uses this identity for your session and, when you bring a repository,
to verify repository access. It does not make every repository visible to
other members of an organization.

## 2. Create or join an organization

Choose an existing organization if you have been invited. Otherwise, create
one with a clear team or project name. The organization owns:

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

- [Deploy from GitHub](./github.md) if publication is enabled for the
  organization.

If sign-in, organization, or balance state does not update, use
[Sign-in, organization, and Service Credit reads](../troubleshooting/account-funding.md).
