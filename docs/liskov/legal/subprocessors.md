---
title: Liskov Subprocessor and International Transfer Schedule
description: The providers PROOF uses to process customer personal data, where they process it, and on what legal basis.
---

# Liskov Subprocessor and International Transfer Schedule

**Version 1.0 — effective 1 September 2026**

This Schedule identifies the third parties engaged by MOOSE LABS LTD trading as PROOF (**PROOF**) to process Customer Personal Data on a customer’s behalf under the Liskov Data Processing Addendum, and the recipients that process limited personal data for their own purposes.

It does **not** list Acurast processors or other Network Participants. They are independent network participants that execute workloads at the customer’s direction; PROOF sends them no customer account data, and the customer is the Controller of anything it chooses to process in a Distributed Workload (Master Business Terms, clause 7).

PROOF’s own systems run in the United Kingdom (London). The primary database, secrets service and log service are hosted on Fly.io in London.

## 1. Subprocessors

| Legal entity | Service and purpose | Personal Data it may process | Processing location | Transfer basis |
|---|---|---|---|---|
| Fly.io, Inc. (United States) | Application hosting and managed PostgreSQL for the Liskov control plane, secrets service and log service | All hosted Customer Data and Account Data | United Kingdom (London region) | Data stays in the UK; Fly.io Data Processing Agreement for any support access from outside the UK |
| Tigris Data, Inc. (United States) | Object storage for runtime images and uploaded artifacts | Customer application artifacts, to the extent they contain personal data | Distributed object storage written from London; may be replicated to other regions on access | Tigris Data Processing Addendum incorporating the EU Standard Contractual Clauses and the UK Addendum |
| Amazon Web Services EMEA SARL (Luxembourg) | Hosting for the Liskov artifact upload and IPFS pinning service | Customer application artifacts, upload metadata | United Kingdom (London region, eu-west-2) | Data stays in the UK; AWS Data Processing Addendum |
| Plus Five Five, Inc., trading as Resend (United States) | Transactional email: invitations, sign-in links, billing and service notices | Recipient name and email address, message content | United States | UK Extension to the EU-US Data Privacy Framework; Resend Data Processing Addendum with the EU Standard Contractual Clauses and UK Addendum |
| Not Just Tickets Ltd, trading as Plain (United Kingdom, company 12736513) | Customer support conversations sent to support@proof.computer and other PROOF mailboxes | Name, email address, organisation, support content | United Kingdom and European Union | No restricted transfer; Plain Data Processing Addendum |
| Rebase, Inc., trading as Autumn (United States) | Subscription and entitlement orchestration between Liskov and Stripe | Organisation identifier and organisation name, plan and entitlement state | United States | EU Standard Contractual Clauses and UK Addendum under Autumn’s terms |
| Functional Software, Inc., trading as Sentry (United States) | Error monitoring for the control plane | Technical error events; configured not to send request bodies, headers, cookies or personal identifiers | European Union (Frankfurt data region) | Data stored in the EU; UK Extension to the EU-US Data Privacy Framework and Sentry Data Processing Addendum for support access |
| Tailscale Inc. (Canada) | Private network connectivity for managed runtime SSH sessions | Device identifiers, network addresses and public keys of runtime instances and connecting clients; user identifiers on the PROOF tailnet | Canada and United States | Canada is covered by UK adequacy regulations; Tailscale Data Processing Agreement with the EU Standard Contractual Clauses and UK Addendum |
| GitHub, Inc. (United States) | Sign-in (OAuth), repository access the customer authorises, and workflow identity for builds | GitHub account identifier, login and profile fields the customer authorises; repository contents the customer connects | United States | UK Extension to the EU-US Data Privacy Framework; GitHub Data Protection Agreement |
| Vercel Inc. (United States) | Hosting for proof.computer, docs.proof.computer and the Liskov console’s static assets | Request logs (IP address, user agent, URL) | United States and global edge | UK Extension to the EU-US Data Privacy Framework; Vercel Data Processing Addendum |

## 2. Independent controllers and other recipients

These providers determine their own purposes for the limited personal data they receive, or receive data the customer directs to them. They are described in the Privacy Notice.

| Recipient | Purpose | Data shared | Location | Basis |
|---|---|---|---|---|
| Stripe Payments UK Limited and Stripe, Inc. | Payment processing, tax calculation, invoices and receipts; fraud prevention and payment compliance for Stripe’s own purposes | Name, billing address, VAT number, email, payment method (PROOF never receives full card details), transaction details | United Kingdom, Ireland and United States | Stripe’s own privacy notice; UK Extension to the EU-US Data Privacy Framework and Stripe Data Processing Agreement for processor activities |
| Google Ireland Limited (Google Analytics) | Website analytics on proof.computer, only with consent | Pseudonymous analytics identifiers, page and event data; IP addresses are not stored by Google Analytics 4 | European Union and United States | UK Extension to the EU-US Data Privacy Framework; Google Ads Data Processing Terms |
| Telegram Messenger Inc. | Optional operational notifications a customer configures to a Telegram chat it controls | The customer’s chat identifier and the notification text | Customer-directed | Customer-directed disclosure under Telegram’s terms |
| DB-IP (db-ip.com) | Best-effort geolocation of network participants’ addresses for placement and monitoring | Network addresses of Acurast processors (not customer data) | European Union | Provider terms; no customer personal data |

PROOF may also disclose personal data to professional advisers, insurers, courts, regulators and law-enforcement bodies as described in the Privacy Notice.

## 3. Transfer assessment register

PROOF keeps a transfer risk assessment for each restricted transfer in section 1 and reviews it when a provider, location, scope or legal instrument changes, after an incident, and at least annually. Supplementary measures in use: data minimisation at the source (Sentry sends no request content; Autumn receives an organisation identifier and name only), encryption in transit and at rest, and access limited to named PROOF personnel.

## 4. Change notification

PROOF publishes changes to this Schedule on this page and gives at least 15 days’ notice before a new Subprocessor materially processes Customer Personal Data, subject to the urgent-change provision in the DPA. To receive change notices by email, write to **privacy@proof.computer** with the subject line **Subprocessor notices**. A notice states the legal entity and service, the purpose and data, the processing location, the planned effective date, the transfer basis, and the objection route and deadline.

## 5. Vendor onboarding

Before adding a provider that will process Customer Personal Data, PROOF determines its role from the facts, completes due diligence proportionate to the risk, puts Article 28 processing terms in place, identifies the processing locations, selects a transfer basis and completes a transfer risk assessment where required, confirms deletion, incident-notice and audit commitments, restricts the provider’s own use of the data, and updates this Schedule and the Privacy Notice.

---

MOOSE LABS LTD trading as PROOF · Version 1.0 · effective 1 September 2026 · previous versions are archived by PROOF and available on request from legal@proof.computer.
