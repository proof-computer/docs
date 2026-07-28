---
title: Set up Liskov
description: Sign in with GitHub, select an organization and plan, and fund USD Service Credits before your first launch.
---

# Set up Liskov

This setup is shared by Marketplace and GitHub launches. It creates the
identity, organization, and billing context that will own your Application.

## Before you begin

You need a GitHub account and permission to accept the applicable Liskov terms
for your organization. Funding uses Stripe in USD. The exact amount is your
choice; launch preflight shows the reserve before a deployment proceeds.

## 1. Sign in

Open the [Liskov Console](https://liskov.proof.computer) and choose **Continue with GitHub**. Review the GitHub
authorization and return to Liskov.

Liskov uses this identity for your session and, when you bring a repository,
to verify repository access. It does not make every repository visible to
other members of an organization.

## 2. Create or join an organization

Choose an existing organization if you have been invited. Otherwise, create
one with a clear team or project name. The organization owns:

- Applications and their evidence;
- members and roles;
- plan and terms state; and
- USD Service Credits and billing records.

Use the organization switcher before launching if you belong to more than one
organization. Moving to another organization changes the resources and balance
you are viewing; it does not transfer an Application.

## 3. Choose a plan and accept terms

Open **Billing & funding**, review the available plan, and accept the displayed
terms. Plan availability can affect limits. The launch summary shows any plan-specific limit before you confirm.

## 4. Add USD Service Credits

Choose **Add funds**, enter the USD amount, and complete the Stripe checkout.
After Stripe confirms payment, return to **Billing & funding** and verify that
the available Service Credit balance increased.

USD Service Credits are the only customer balance. Liskov uses its own
treasury assets to pay Acurast; funding does not create an ACU wallet or a
right to withdraw crypto.

## Verify

Before continuing, confirm that:

- the intended organization is active;
- the plan and terms show as ready; and
- **Available** Service Credits are greater than zero.

A displayed **Reserved** amount is already held for in-progress work and is
not available for a new launch.

## Next

- [Launch from Marketplace](./marketplace.md), or
- [Deploy from GitHub](./github.md).

If sign-in, plan, checkout, or balance state does not update, use
[Sign-in, organization, and funding](../troubleshooting/account-funding.md).
