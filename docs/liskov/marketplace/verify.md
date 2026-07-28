---
title: Verify a Marketplace Application
description: Confirm the exact curated version, artifact, policy, job, runtime, and cost boundary behind a Marketplace launch.
---

# Verify a Marketplace Application

Marketplace makes launch short; it does not remove the evidence chain. Verify
the selected version before launch and the realized deployment afterward.

## Verify the listing

Record:

- offering ID and display name;
- exact version or catalog revision;
- source repository, ref, and descriptor path;
- artifact kind, CID, SHA-256 digest, and encryption mode;
- option schema and destinations;
- schedule, resources, placement, lifecycle, and spend caps; and
- Marketplace pricing plus declared external services.

Curated means PROOF controls what appears in the v1 catalog. It does not mean
the Application code can access your external accounts without the credentials you supply
or that a third-party service becomes part of Liskov.

## Verify the created Application

Confirm its organization, Application UID, offering/version provenance,
managed-option presence, effective policy version/digest, and selected artifact
version. The effective policy may contain server-resolved facts, but it must not
silently change the offering's customer authority.

## Verify execution

Follow the deployment through Acurast job registration, processor assignment,
signed runtime contact, and application-specific output. Compare job schedule
and successor relationships with the listing's lifecycle.

## Verify cost boundaries

Separate:

- Marketplace software price;
- quoted and reserved Liskov/Acurast service;
- final Service Credit charge; and
- direct external-service fees, such as Telegram or an API provider.

One party's “free” label does not erase another boundary.

Use [Inspect the proof chain](../operate/proof-chain.md) for the detailed
sequence and [Quotes, reserves, and final charges](../organizations/charges.md)
for settlement.
