---
title: Choose your path
description: Review the available own-repository Manifest V5 path and the release gate on Marketplace launch.
---

# Choose your path

The documented customer path starts from a GitHub repository. It finishes with
a normal Application in your organization and uses the same status, proof,
billing, and lifecycle tools described throughout these docs.

| Path | Availability | What you provide |
| --- | --- | --- |
| **GitHub** | v1 with retained Manifest V5 source import. | A GitHub repository, an organization admin to bind it as the Application's source, and the checked V5 starter or a worker in its shape. |
| **Marketplace** | Release-gated v1; internal first-party engineering acceptance only. | Do not provide offering secrets or approve spend as a customer yet. |

Uptime Prober is the first-party fixture used to accept the Marketplace path.
Its production presence does not make it a supported customer offering. The
[Marketplace release-boundary page](./marketplace.md) preserves the intended
outcome without presenting a launch recipe.

Choose GitHub when you need to change the code, build configuration, runtime
resources, schedule, or release authority. You will validate a strict Manifest
V5 document, bind your repository to the Application, and publish only a build
that GitHub attested from that exact source.
[Manifest V4](../build/manifest-v4.md) remains supported for existing
Applications; its own-repository publication is rollout-gated by organization.

## Shared prerequisites

The GitHub path needs:

- a GitHub account for Liskov sign-in;
- a Liskov organization, with an `admin` who can bind the repository as the
  Application's source;
- Node.js 22 or later, pnpm, and the `proof` CLI with
  `@proof-computer/proof-cli-liskov` `0.14.0`; and
- enough already-available USD Service Credits for the displayed reserve when
  you publish.

Customer plan selection, terms acceptance, Stripe checkout, and issuance of
new Service Credits are release-gated. You can read an existing organization's
balance, reservations, and ledger, but there is no supported customer add-funds
path yet.

You do not need an Acurast account, processor, mnemonic, or ACU wallet for the
default managed-custody path.

Continue to [Set up Liskov](./set-up-liskov.md).
