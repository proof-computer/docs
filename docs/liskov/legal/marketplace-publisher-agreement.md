---
title: Liskov Marketplace Publisher Agreement — review draft
description: Draft B2B agreement for third parties that submit and maintain offerings in the Liskov Marketplace.
draft: true
---

# Liskov Marketplace Publisher Agreement — review draft

:::caution Not in force
Version 0.2, dated 2 September 2026. Third-party Marketplace publishing and
payouts are not v1 capabilities. This agreement requires legal and product
approval before publisher onboarding.
:::

This Publisher Agreement is between MOOSE LABS LTD, trading as PROOF, and the
business identified in an accepted publisher application or Order Form (the
"Publisher"). It supplements the Liskov Master Terms.

## 1. Eligibility and authority

The Publisher represents that it is a business, its accepting representative
has authority to bind it, and all submitted identity, tax, payment, support,
and contact information is accurate and current.

PROOF may perform identity, sanctions, tax, security, source, ownership,
reputation, and technical checks and may reject an application without an
obligation to list an offering.

## 2. Offering submission

For each offering and version, the Publisher must provide complete and accurate:

- name, description, Publisher identity, category, and support contact;
- the complete human-readable source snapshot at an immutable repository
  commit or tag, its licence, build scripts, workflow, lockfiles, toolchain,
  dependency inputs, and generated-code origins;
- an SBOM, third-party licence inventory, test/review instructions, artifact,
  source and artifact digests, and signed build provenance requested by PROOF;
- configuration, permissions, secrets, data, networking, schedule, placement,
  resource, and spend requirements;
- pricing request and any external fees;
- documentation, limitations, known risks, dependencies, regions, and
  end-of-life information;
- every runtime-fetched code path or external service that can materially
  change behavior;
- security contact, vulnerability process, and material known vulnerabilities;
  and
- privacy, data-processing, export, sanctions, regulatory, and age or user
  restrictions relevant to the offering.

The Publisher must not conceal functionality, permissions, data flows,
dependencies, generated code, remote code, external services, or costs. It
must not include a credential, private key, production data, or unnecessary
personal data in submitted source. Every update or material source, build,
dependency, permission, data/network, licence, or artifact change must be
submitted as a new immutable version and repeat the applicable review.

## 3. Publisher warranties

The Publisher warrants that:

- it owns or has all rights needed to submit, licence, distribute, market, and
  support the offering;
- the offering and listing do not infringe rights, contain unlawful material,
  or breach another agreement;
- provenance, security, performance, privacy, and compatibility statements are
  accurate and not misleading;
- submitted source and build materials are complete and correspond to the
  exact artifact, and no undeclared step or fetched code materially changes its
  behavior;
- the offering does not include malicious, deceptive, hidden, or unauthorized
  functionality;
- it complies with the Acceptable Use Policy and applicable law; and
- it will maintain required open-source notices and comply with all component
  licences.

The Publisher does not warrant that software is defect-free unless its listing
expressly gives that warranty, but it must not knowingly withhold a material
defect or vulnerability.

## 4. Licence to PROOF

The Publisher grants PROOF a worldwide, non-exclusive, royalty-free licence
during the Agreement to host, copy, validate, build, scan, test, cache,
distribute, display, market, demonstrate, and make the offering available to
Customers, and to use Publisher names, marks, screenshots, and listing content
for those purposes.

The licence includes reasonable internal testing and retention of immutable
provenance, audit, security, billing, and dispute evidence after delisting. It
does not transfer ownership of the offering or Publisher marks.

The review licence includes access to complete source and build material for
each submitted version and permission to perform automated and manual analysis
in an isolated environment. PROOF will not use confidential Publisher source
for model training, generalized code generation, or unrelated product
development. Access, reviewer authorization, retention, deletion, and incident
handling for a future confidential-source lane must follow the separately
published review process and applicable confidentiality terms.

The Customer licence must be stated in the listing. If no separate licence is
approved, no offering will be published.

## 5. Review and admission

PROOF controls Marketplace admission, categorization, presentation,
entitlement, effective listing, and whether a version may be launched.
Submission, validation, attestation, or prior listing does not require PROOF to
publish or continue publishing an offering.

Public source or offering content is not the authoritative price or admission
record. PROOF's approved Marketplace record controls the effective listing,
price, supported version, and availability.

### 5.1 Public Marketplace source requirement

Every version admitted to the public Marketplace must expose complete,
human-readable, publicly inspectable source at the exact immutable snapshot
bound to its build provenance and artifact digest. The source may use an
open-source or source-available licence, but the listing must state what
Customers may copy, modify, redistribute, or use commercially.

Source visibility alone is insufficient. The admitted evidence must bind:

`source snapshot → controlled build → signed provenance → artifact digest → Marketplace version → deployed artifact`.

An artifact that is attested but lacks complete inspectable source, or source
that does not correspond to the exact artifact, is not eligible for public
listing.

### 5.2 Future confidential-source review

PROOF may later invite a Publisher to apply for a confidential-source tier.
That tier is unavailable until PROOF expressly enables it after approving its
review licence, isolated access, reviewer controls, audit, retention/deletion,
incident response, IP-contamination, no-training, and operational-capacity
requirements.

If enabled, the Publisher must give PROOF complete continuing access to the
exact source and build materials for every listed version. Restricting or
withdrawing required access blocks new versions and may delist an existing
version. A confidential review is not public auditability and the listing must
say so.

### 5.3 Binary-only distribution

Binary-only offerings are not eligible for public Marketplace listing,
Marketplace curation, auto-upgrade, or Marketplace assurance labels. PROOF may
separately agree a private Organization-specific Enterprise distribution. That
distribution is not a public Marketplace offering and must state that source
was not reviewed.

### 5.4 Exact review claims

PROOF may publish separate evidence-backed statements such as Publisher
identity verified, public source available, build provenance verified,
automated checks passed, or manual review completed on a specified date for a
specified version and scope. Neither party may combine those facts into a broad
"PROOF verified", "safe", or equivalent certification claim.

PROOF may build, test, scan, or manually review an offering but has no duty or
ability to find every defect, vulnerability, malicious behavior, licence
problem, or unlawful use. Review does not transfer Publisher responsibility to
PROOF and is not a warranty of security, correctness, lawfulness, maintenance,
or fitness for purpose.

## 6. Security and vulnerability response

The Publisher must maintain a monitored security contact and promptly:

- investigate credible vulnerability or abuse reports;
- notify PROOF of a vulnerability, compromise, malicious dependency, provenance
  failure, source/artifact divergence, loss of required source access, lost
  signing authority, or unlawful behavior that may affect a Customer;
- provide impact, affected versions, mitigations, and a remediation plan;
- cooperate on Customer notice, suspension, evidence preservation, and lawful
  disclosure; and
- release a fixed version or withdraw affected versions as appropriate.

PROOF may immediately suspend, delist, block launch, warn Customers, or take
other proportionate protective action. The Publisher must not retaliate against
good-faith researchers.

## 7. Maintenance and support

The Publisher will provide the support, compatibility period, response target,
and maintenance stated in its listing or Order Form. It must give reasonable
advance notice of a material reduction, end of support, licence change, or
withdrawal, except where urgent security action is required.

The Publisher must not imply that PROOF provides Publisher support or warrants
the offering unless PROOF agrees in writing.

## 8. Pricing and fees

The Publisher may request a price, but PROOF controls the admitted effective
price and may require changes before listing. The applicable Publisher
Schedule will state:

- price and currency;
- PROOF Marketplace or service fees;
- calculation and metering;
- taxes and withholding;
- refund and chargeback allocation;
- reserve, minimum, threshold, and payout timing; and
- required payment-provider account and verification.

**No Publisher revenue share or payout is owed unless a Publisher Schedule is
signed and paid third-party Marketplace transactions are expressly enabled.**
Source code, a listing field, test transaction, or provisional dashboard value
does not create a payout obligation.

PROOF may withhold or offset amounts reasonably connected to refunds,
chargebacks, fraud, sanctions, tax, breach, duplicate payment, Customer dispute,
or reserves stated in the Publisher Schedule. PROOF will provide reasonable
supporting records.

## 9. Taxes

The Publisher is responsible for its income, corporation, payroll, employment,
and other taxes arising from payouts. Each party is responsible for transaction
taxes allocated to it by law and the Publisher Schedule.

The Publisher must provide valid tax forms and payment details. PROOF may
withhold tax where legally required and provide available evidence of the
withholding.

:::warning Legal review required
Merchant-of-record, VAT, platform reporting, payment-services, refund, and
Publisher-payout treatment must be approved before paid third-party offerings
are enabled.
:::

## 10. Customer data and privacy

The Publisher may access Customer or end-user data only where the listing and
Customer configuration clearly authorize it and only for the stated purpose.
The Publisher must comply with data-protection law, provide required notices,
honour rights, apply data minimisation and security, and enter any required
controller or processor terms directly with the Customer.

The Publisher must not sell, repurpose, re-identify, or combine Customer data
for advertising, profiling, model training, or another unrelated purpose
without clear lawful authority and Customer agreement.

## 11. Records and audit

The Publisher will keep accurate source, licence, SBOM, dependency,
declaration, provenance, build, artifact, review, security, support, usage,
pricing, tax, and payout records for the period required by law and the
Publisher Schedule.

On reasonable notice, PROOF may request evidence necessary to verify compliance.
Where a material incident or credible breach exists, PROOF may require an
independent audit proportionate to the risk. PROOF will protect Publisher
confidential information and avoid unnecessary access to source or systems.

## 12. Suspension, delisting, and termination

PROOF may suspend or delist an offering immediately for legal, sanctions,
security, source-access, source/artifact correspondence, review-evidence,
provenance, fraud, payment, support, quality, compatibility, reputational, or
Agreement concerns. Where practicable, PROOF will explain the reason and give
an opportunity to remedy it.

Either party may terminate this Agreement on 30 days' written notice or for
uncured material breach under the Master Terms. Termination stops new listings
and launches but does not erase Customer licences already granted, immutable
evidence, accrued fees, refunds, chargebacks, tax duties, or existing network
activity.

The parties will cooperate on an orderly wind-down and accurate Customer
communication. Urgent security or legal withdrawal may occur first.

## 13. Indemnity

The Publisher will indemnify PROOF and affected Customers against third-party
claims and reasonable costs arising from an allegation that the offering or
listing infringes rights, violates law, causes unauthorized data processing,
or breaches the Publisher's warranties, except to the extent caused by PROOF or
the Customer acting outside the approved offering and documentation.

The defence and settlement procedure in the Master Terms applies.

:::warning Legal review required
Counsel must approve the scope, beneficiaries, control, cap treatment, and any
reciprocal obligations before publication.
:::

## 14. Liability and general terms

The Master Terms' disclaimers, liability limits, confidentiality, notices,
assignment, force majeure, general provisions, and English law and jurisdiction
apply to this Agreement. The Publisher Schedule may state a separate cap for
Publisher payouts or specific risks.

If this Agreement conflicts with the Master Terms about Marketplace publishing,
this Agreement prevails. An accepted Publisher Schedule prevails for the
specific offering and commercial terms it identifies.

## 15. Contact

Publisher, legal, security, or payout questions should be sent to
[support@proof.computer](mailto:support@proof.computer).
