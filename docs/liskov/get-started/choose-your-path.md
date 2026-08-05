---
title: Choose your path
description: Review the available own-repository path and the release gate on Marketplace launch.
---

# Choose your path

The documented customer path starts from a GitHub repository. It finishes with
a normal Application in your organization and uses the same status, proof,
billing, and lifecycle tools described throughout these docs.

| Path | Availability | What you provide |
| --- | --- | --- |
| **GitHub** | Available only where Manifest V4 publication is enabled for the organization. | A supported repository, Manifest V4, runtime integration, and a GitHub build workflow. |
| **Marketplace** | Release-gated v1; internal first-party engineering acceptance only. | Do not provide offering secrets or approve spend as a customer yet. |

Uptime Prober is the first-party fixture used to accept the Marketplace path.
Its production presence does not make it a supported customer offering. The
[Marketplace release-boundary page](./marketplace.md) preserves the intended
outcome without presenting a launch recipe.

Choose GitHub when you need to change the code, build configuration, runtime
resources, schedule, or release authority. You will validate a strict manifest
and record an immutable artifact version before publication.

## Shared prerequisites

The GitHub path needs:

- a GitHub account for Liskov sign-in;
- a Liskov organization;
- an organization for which publication is enabled; and
- enough already-available USD Service Credits for the displayed reserve.

Customer plan selection, terms acceptance, Stripe checkout, and issuance of
new Service Credits are release-gated. You can read an existing organization's
balance, reservations, and ledger, but there is no supported customer add-funds
path yet.

You do not need an Acurast account, processor, mnemonic, or ACU wallet for the
default managed-custody path.

Continue to [Set up Liskov](./set-up-liskov.md).
