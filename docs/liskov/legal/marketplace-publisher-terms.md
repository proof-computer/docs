---
title: Liskov Marketplace Publisher Terms — draft
description: Draft terms for independent publishers; not in force because independent publishing is not available.
draft: true
---

# Liskov Marketplace Publisher Terms — draft

:::caution[Not in force]
Draft derived from the review version of 3 September 2026. Independent
(third-party) publishing is not available through the Liskov Marketplace, so
these terms are not in force and are excluded from the production
documentation build. They take effect only if PROOF activates independent
publishing, publishes them as a versioned document and links them from the
Marketplace Terms.
:::

These Publisher Terms would form part of the Liskov Contract for a Customer that submits or publishes an Item through the Marketplace (**Publisher**). Capitalised words have the meanings in the Master Business Terms and the Marketplace Terms.

## 1. Publisher eligibility and verification

### 1.1 Business status

A Publisher must act wholly or mainly for business purposes, be at least 18 if an individual, have authority to publish for the named organisation and provide accurate contact information.

### 1.2 Verification

PROOF verifies identity, organisation, domain, repository control, signing keys, source provenance, sanctions status and authority before admitting a Publisher. A verification label indicates only the checks described with the label at that time; it is not a quality or security warranty.

### 1.3 Account security

Publisher must protect its Workspace, repository, signing keys, release pipeline and maintainers. It must notify PROOF promptly of compromise and revoke affected releases and keys.

## 2. Submission requirements

Every submitted version must provide:

- Item and Publisher name;
- version and release date;
- the public GitHub repository and immutable reference (tag or commit) holding the complete source for that version, together with the build scripts, workflow, lockfiles and dependency inputs needed to reproduce the artifact;
- the Item Licence and required notices;
- a software bill of materials and third-party licence inventory;
- declarations of build inputs, generated code, requested permissions, data handled, network destinations and any runtime-fetched code;
- supported architecture, runtime, Network and Liskov version;
- resource requirements and expected Network cost drivers;
- external telemetry and where it is sent;
- material external charges and account requirements;
- support and security contact;
- maintenance status and end-of-life information;
- known material vulnerabilities, limitations and unsafe configurations; and
- export-control or geographic restrictions.

Public inspectable source is mandatory for every version; a binary-only or private-source submission is refused. PROOF prescribes the descriptor schema and rejects incomplete metadata. Secrets, credentials, private keys, production data and unnecessary Personal Data may not be included in a submission.

## 3. Publisher promises

Publisher represents and warrants throughout publication that:

(a) it has all rights and authority needed to submit, license and distribute the Item and Listing Content;

(b) the Item and Listing Content comply with law, the AUP and applicable licences;

(c) the listing is accurate, not misleading, and discloses material permissions, data use, telemetry, external services and costs;

(d) the Item does not intentionally contain malware, credential theft, hidden mining, backdoors, destructive functions or undisclosed remote control;

(e) it has not embedded private keys, seed phrases, live production credentials or unlawfully obtained data;

(f) it has applied reasonable secure-development and dependency practices appropriate to the Item;

(g) it will not manipulate rankings, installs, reports or verification;

(h) it will maintain a reachable security contact and respond reasonably to material vulnerability reports;

(i) it will promptly correct or disclose a material security defect, licence breach, rights issue or misleading statement;

(j) it will not use a listing to evade sanctions, export controls or regulated-activity requirements; and

(k) it will not require an undisclosed payment for the listed core functionality.

## 4. Licence to PROOF

### 4.1 Listing and operation licence

Publisher grants PROOF and its service providers a worldwide, non-exclusive, royalty-free licence while the Item is submitted or listed, and for a reasonable archival and dispute period, to host, copy, format, reproduce, display, index and distribute Listing Content; ingest, cache and make the Item available as necessary for Marketplace operation; scan, sandbox, test, analyse and review the Item for compatibility, security, malware, secrets, licences and policy compliance; create previews and technical metadata; use Publisher’s name and marks only to identify Publisher and the Item; and preserve evidence and a restricted copy where necessary for security, complaints, legal claims or compliance.

### 4.2 No ownership transfer

Publisher retains ownership, subject to third-party and open-source rights. PROOF may not sell or relicense the Item outside the Item Licence merely because it is submitted.

### 4.3 Moral rights

To the extent legally possible and necessary for the permitted formatting and display, Publisher consents to acts that might otherwise infringe moral rights; PROOF will not intentionally misattribute authorship.

## 5. Review, admission and publication

### 5.1 Discretion to publish

Submission does not guarantee publication. PROOF reviews every version manually before it is listed and may require changes, reject, label, restrict or remove an Item for quality, compatibility, security, legal, policy, capacity or strategic reasons, consistently with applicable law and, where required, with a statement of reasons.

### 5.2 Automated checks

PROOF may use automated provenance, signature, source-availability and reputation checks. Automated checks can produce false positives or miss defects. Publisher remains responsible for the Item; User remains responsible for evaluation.

### 5.3 Material changes

Publisher must submit a new version before a material change to permissions, telemetry, external charges, licence, ownership, data handling, security behaviour or dependencies. PROOF re-reviews material changes.

### 5.4 Signing and provenance

Publisher must build through a workflow whose provenance attestation PROOF can verify and must use its own controlled keys. PROOF refuses an unsigned or unverifiable release. A signature proves control of a key, not that the code is safe or lawful.

### 5.5 Publisher attestation

Before each first publication and each material version, Publisher confirms through a versioned, affirmative control that it has the rights needed to publish and license the Item; that the listing, licence, permissions, telemetry, external dependencies and charges are complete and accurate; that the Item does not intentionally contain malware, hidden mining, credential theft, backdoors or live secrets; that it will maintain a monitored security contact; and that the Item is free through Liskov and does not require an undisclosed payment for its listed core functionality.

## 6. Ranking integrity

Publisher must not generate fake launches, clicks, reports or engagement; coordinate reciprocal manipulation; conceal ownership; or pay for undisclosed endorsements. PROOF may discount suspicious signals and suspend Items or accounts.

## 7. Suspension, restriction and termination

### 7.1 Grounds

PROOF may reject, restrict, label, downgrade, suspend or remove an Item or Publisher account where the Item or listing breaches these Terms, the AUP, law or rights; information is inaccurate or incomplete; a material vulnerability or malicious behaviour is suspected; Publisher fails verification or becomes a sanctions or export risk; Publisher manipulates ranking or evades enforcement; the Item is abandoned, incompatible or creates disproportionate support burden; a Network, repository, licence or dependency makes distribution unsafe or unlawful; or PROOF discontinues the relevant Marketplace category or feature.

### 7.2 Notice and reasons

Where lawful and reasonably practicable, PROOF gives Publisher notice and a statement of principal reasons. It may withhold detail that would prejudice security, investigation, law enforcement, reporter safety or abuse detection.

### 7.3 Opportunity to remedy

For a remediable non-urgent issue, PROOF normally allows a reasonable cure period. Immediate action may be taken for malware, active exploitation, child safety, terrorism, sanctions, fraud, rights emergencies or serious harm.

### 7.4 Appeal

Publisher may appeal within 14 days using the route in the notice. A significant appeal is reviewed by a person not materially involved in the first decision where practicable. The Item remains restricted during appeal unless PROOF decides otherwise.

### 7.5 Termination by Publisher

Publisher may request delisting at any time, subject to preservation needed for law, security, existing licence rights and dispute records. Publisher remains responsible for past versions and claims.

## 8. Data protection

Publisher is responsible for privacy information, lawful bases, data minimisation and processor arrangements for Personal Data handled by its external services. Publisher must disclose material telemetry, recipient, purpose and opt-out or configuration, and must not collect secrets or Personal Data covertly.

## 9. Warranties and liability

Publisher is responsible for its Item and Listing Content. Its warranties and indemnity in the Master Business Terms apply to third-party claims caused by them. Liability is governed by the Master Business Terms.

## 10. Contact

Marketplace operations: marketplace@proof.computer  
Security: security@proof.computer  
Legal and rights correspondence: legal@proof.computer
