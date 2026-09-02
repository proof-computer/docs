---
title: Liskov Subprocessors and External Services — review draft
description: Draft inventory separating processors used by MOOSE LABS LTD from customer-directed and independently controlled external services.
draft: true
---

# Liskov Subprocessors and External Services — review draft

:::caution Not in force or complete
Version 0.1, dated 2 September 2026. This is a candidate inventory for owner,
privacy, and legal verification. It must not be represented as the current
production subprocessor list.
:::

The effective list will distinguish three relationships:

1. **PROOF subprocessors** that process Customer Personal Data for MOOSE LABS
   LTD in providing Liskov;
2. **independent controllers**, such as payment providers processing data for
   their own legal and fraud obligations; and
3. **Customer-directed external services**, which the Customer chooses or which
   form part of the external decentralized execution network.

## Candidate production inventory

| Service | Candidate role | Purpose | Data | Location / transfer position | Release state |
| --- | --- | --- | --- | --- | --- |
| Fly.io | PROOF subprocessor — confirm contracting entity | Liskov API and service hosting | Account, Organization, Application, operational, security, secrets/log metadata, and Customer Content handled by hosted services | Regions and transfer mechanism to verify | In production |
| Vercel | PROOF subprocessor and/or independent website provider — confirm | Liskov Console and documentation delivery, request/security logs | IP, device/request data, and data transmitted through hosted frontend functions if any | Regions and transfer mechanism to verify | Console/docs in production |
| Amazon Web Services | PROOF subprocessor — confirm exact services and contracting entity | Artifact upload, object storage, or related infrastructure | Artifact and operational metadata; Customer Content depending on path | Regions and transfer mechanism to verify | Owner verification required |
| Autumn | PROOF billing subprocessor — confirm hosted entity and DPA | Plan, subscription, entitlement, and billing orchestration | Customer and Organization identifiers, plan/subscription state, and shadow billing metadata | Location and transfer mechanism to verify | Selected architecture; production enablement gated |
| Stripe | Independent controller and/or processor depending on activity | Checkout, payment, invoice, tax, refund, dispute, and fraud processing | Billing identity, payment, invoice, tax, fraud, and transaction data | Stripe contracting entity, locations, and terms to verify | Customer funding release-gated |
| GitHub | Customer-directed provider; may also support authentication/integration | Login, source access, workflow identity, build, and release integration | GitHub identity, repository and workflow metadata, source/artifact data selected by Customer | Governed by Customer/GitHub terms and integration configuration | In production for supported paths |
| Acurast and Polkadot participants | External decentralized network; legal role to be determined | Job registration, processor selection, execution, public-chain evidence, and settlement | Public chain identifiers and any Application data the Customer makes available to a processor | Processor location varies; role and transfer mechanism require counsel | Core external execution dependency |
| IPFS providers and gateways | Customer-directed/external content network; exact PROOF providers to verify | Content-addressed artifact distribution | Public artifact bytes and metadata; current supported JavaScript bundles are unencrypted | Replication location is not controlled or reliably retractable | Used by supported artifact paths |

## Not yet verified

Before publication, the owner inventory must confirm:

- every database, object store, secrets/logging service, email provider,
  monitoring or analytics provider, support tool, identity provider, backup
  service, and billing provider that processes personal data;
- the exact legal entity and contracting terms for each provider;
- purpose, data categories, countries/regions, onward subprocessors, and
  transfer safeguard;
- which entries are subprocessors versus independent controllers or
  Customer-directed recipients; and
- whether a Customer can object or select a region or alternative.

## Changes and objections

When this list becomes effective, PROOF will give the notice stated in the Data
Processing Addendum before adding a new subprocessor. A Customer may object on
reasonable data-protection grounds by contacting
[support@proof.computer](mailto:support@proof.computer) during the notice
period.

External networks and Customer-directed providers may change participants
without being conventional PROOF subprocessors. Their treatment will be stated
separately and will not be hidden inside the subprocessor change process.
