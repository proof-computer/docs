---
title: Verify a Marketplace Application
description: Review the evidence a supported Marketplace launch must expose after its release gate is removed.
---

# Verify a Marketplace Application

:::caution Release-gated v1
Marketplace launch is limited to internal first-party engineering acceptance.
This checklist records the public evidence contract; it is not a customer
launch or spend procedure.
:::

A future Marketplace launch must not remove the evidence chain. Its release
acceptance must verify the selected version and the realized deployment.

## Verify the listing

Record:

- offering ID and display name;
- exact version or catalog revision;
- source repository, immutable ref, source path, licence, and source digest;
- SBOM reference and the declared build inputs, permissions, data flows,
  network destinations, and any runtime-fetched code;
- artifact kind, CID, SHA-256 digest, and encryption mode;
- option schema and destinations;
- schedule, resources, placement, lifecycle, and spend caps; and
- Marketplace pricing plus declared external services.

Curated means PROOF controls what appears in the v1 catalog. It does not mean
the Application code can access your external accounts without the credentials you supply
or that a third-party service becomes part of Liskov.

## Read the evidence claims one at a time

A listing states what was established, claim by claim. There is deliberately no
single "verified" or "safe" mark, because these are different facts and any of
them can be absent:

| Claim | What it means |
| --- | --- |
| Publisher identity | The build was attested by a GitHub identity Liskov recognises. |
| Public source | The complete source is readable by anyone at the exact immutable commit the listing names, under the stated licence, and its digest matches what Liskov read. |
| Build provenance | Signed evidence binds that repository, commit, and workflow to the exact artifact digest. |
| Automated checks | Automated analysis ran and passed for this version. |
| Manual review | A person reviewed this version, on a stated date and to a stated scope. |

A claim shown as **missing**, **stale** or **failed** is not a passing claim.
"Not applicable" means the check does not apply to this version, not that it
passed. Open the source link and read the licence yourself — that is what public
inspectability is for.

## What review is not

Admission and review reduce risk. They do not prove the absence of malicious
code, vulnerabilities, defects, unlawful behaviour, or undeclared external
changes, and they are not a security certification. The Publisher remains the
author and remains responsible for the offering's completeness, accuracy,
licences, security, maintenance, vulnerability response, support and compliance.

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
