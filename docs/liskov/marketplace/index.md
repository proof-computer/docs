---
title: Marketplace release reference
description: Review the intended first-party Marketplace contract while customer launch remains release-gated.
---

# Marketplace release reference

:::caution Release-gated v1
Marketplace launch is limited to internal first-party engineering acceptance.
Catalog visibility or a successful internal launch does not make the path
available to customers. Do not submit secrets or approve spend through this
path yet.
:::

The intended v1 Marketplace is a curated collection of first-party
applications. A supported launch will copy one exact offering version into the
customer's organization as a normal Liskov Application, without depending on
a shared publisher deployment.

The retained [option-contract](./options.md), [Uptime Prober](./uptime-prober.md),
and [evidence](./verify.md) pages describe the release criteria. They are not
customer launch recipes while the gate remains.

## What a public listing must carry

A public Marketplace listing is not admitted on artifact provenance alone. Each
listed version must bind two independent facts, and neither compensates for the
other:

1. **Publicly inspectable source.** The complete, human-readable source sits at
   an immutable commit or tag in a public repository, with an explicit licence,
   an SBOM, and stated build inputs, permissions, data flows, network
   destinations and any runtime-fetched code.
2. **An exact source-to-artifact binding.** That same source snapshot is the one
   the attested build ran on, and that build produced the exact artifact digest
   the listing pins and your launch copies.

Publicly inspectable does not mean open source. A publisher may use a
source-available licence that restricts copying, modification, redistribution or
commercial reuse while still allowing you to read the code. The listing states
the licence; read it before assuming a right to reuse.

A change to the source, dependencies, build, declared permissions, material data
or network behaviour, licence, or artifact creates a **new version** that is
reviewed and admitted again. An older admitted version keeps its evidence.
Liskov may delist a version for security, legal, provenance, support or
source-access reasons; delisting stops new launches and auto-upgrades to it and
does not stop jobs already running on-chain.

Source visible only to PROOF, and offerings with no source access at all, are
not eligible for the public Marketplace.

“Free” refers to the offering software and Marketplace fee. Acurast compute,
Liskov service, and third-party services such as Telegram or a model provider
may still have their own costs or account requirements.

Third-party publishing and publisher payouts are not part of v1. Customer
Marketplace launch additionally remains gated by commercial, funding, and
production-release approval.
