---
title: Liskov Subprocessor and International Transfer Schedule — incomplete review draft
description: Pre-publication template for verified Liskov subprocessors, transfers, retention, and processing records.
draft: true
---

# Liskov Subprocessor and International Transfer Schedule

:::caution[Not in force]
Review version 1.0, dated 3 September 2026. This incomplete schedule is review
material, has no contractual effect, and is excluded from the production
documentation build. Its publication blockers remain open.
:::

**Version:** 1.0 — 3 September 2026  
**Status:** must be completed from the production data-flow/vendor register before publication

This Schedule identifies third parties engaged by MOOSE LABS LTD trading as PROOF (**PROOF**) to process Customer Personal Data on behalf of a customer under the Liskov Data Processing Addendum.

It does **not** list every independent Network Participant. Personal Data is prohibited in Standard Service Distributed Workloads. Any approved enterprise node pool must be listed in the applicable Enterprise Order/data schedule with its own role and transfer analysis.

## 1. Current Subprocessors

| Legal entity | Service / purpose | Personal Data | Hosting / processing countries | Transfer mechanism | Security/assurance link | Change date |
|---|---|---|---|---|---|---|
| [insert exact contracting entity] | Cloud hosting / compute / database / storage | [insert] | [insert] | UK adequacy / UK IDTA / UK Addendum / not restricted | [insert] | [insert] |
| [insert] | Authentication / identity | [insert] | [insert] | [insert] | [insert] | [insert] |
| [insert] | Email / transactional communications | [insert] | [insert] | [insert] | [insert] | [insert] |
| [insert] | Customer support | [insert] | [insert] | [insert] | [insert] | [insert] |
| [insert] | Monitoring / error logging | [insert] | [insert] | [insert] | [insert] | [insert] |
| [insert] | Analytics / product telemetry | [insert] | [insert] | [insert] | [insert] | [insert] |
| [insert] | Card / bank payments and invoicing | [insert] | [insert] | [insert] | [insert] | [insert] |
| [insert] | Cryptoasset payment / blockchain monitoring | [insert] | [insert] | [insert] | [insert] | [insert] |
| [insert] | Sanctions / fraud / identity verification | [insert] | [insert] | [insert] | [insert] | [insert] |
| [insert] | Backup / disaster recovery | [insert] | [insert] | [insert] | [insert] | [insert] |

Delete unused rows and add every processor that can access Customer Personal Data, including support personnel and providers receiving server-side events.

## 2. Independent Controllers / recipients

Some providers may determine their own purposes for limited Personal Data and act as independent Controllers rather than Subprocessors—for example, a bank, card scheme, cryptoasset issuer, public blockchain, tax authority, fraud consortium or professional adviser. Record them separately and describe them in the Privacy Notice.

| Recipient / category | Purpose | Controller rationale | Data shared | Countries | Privacy information |
|---|---|---|---|---|---|
| [insert] | [insert] | [insert] | [insert] | [insert] | [insert] |

## 3. Transfer assessment register

For each Restricted Transfer, retain:

| Exporter | Importer | Roles | Countries | Data / frequency | Transfer tool | TRA date / owner | Supplementary measures | Review trigger |
|---|---|---|---|---|---|---|---|---|
| [insert] | [insert] | Controller→Processor / Processor→Processor | [insert] | [insert] | UK IDTA / EU SCCs + UK Addendum | [insert] | [insert] | law/provider/scope change; incident; annual review |

Supplementary measures may include encryption, key control, minimisation, pseudonymisation, government-request policy, transparency reporting, access controls and technical inability to access content. Do not list a measure unless it applies to the actual transfer.

## 4. Change notification

Customers may subscribe at **[insert URL/email]**. PROOF will normally give at least 15 days’ prior notice before a new Subprocessor materially processes Customer Personal Data, subject to the urgent-change provision in the DPA.

A notice should state:

- legal entity and service;
- purpose/data;
- countries;
- planned effective date;
- transfer mechanism; and
- objection route/deadline.

## 5. Vendor onboarding checklist

Before adding a provider:

- determine Controller/Processor/joint-controller status by facts;
- complete security/privacy due diligence proportionate to risk;
- execute Article 28 terms where it is a Processor;
- identify all processing countries and remote-access locations;
- select and execute a transfer mechanism;
- complete a transfer risk assessment where required;
- confirm deletion/return, incident notice, audit and subprocessor flow-down;
- restrict provider use/training/advertising;
- update privacy/cookie notices and data map;
- test configuration to minimise data and payloads;
- obtain internal approval and set review/exit owner.

## 6. Enterprise node pool schedule

Use a separate table in an Enterprise Order if Personal Data is ever approved for decentralised execution:

| Node operator legal entity | Node identifiers | Country/region | Processor role / contract | Data categories | Security/attestation | Transfer mechanism | Retention/deletion | Incident route | Audit evidence |
|---|---|---|---|---|---|---|---|---|---|
| [insert] | [insert] | [insert] | [insert] | [insert] | [insert] | [insert] | [insert] | [insert] | [insert] |

An open, anonymous or dynamically changing node population is not approved merely by completing a generic DPA.
