---
title: Liskov legal review memorandum — 3 September 2026
description: Working legal-risk assessment and instructions for the final Liskov launch documents.
draft: true
---

# Liskov legal review memorandum

:::caution[Not in force]
Review version 1.0, dated 3 September 2026. This memorandum is review material,
has no contractual effect, and is excluded from the production documentation
build. Its publication blockers remain open.
:::

**Date:** 3 September 2026  
**Prepared for:** MOOSE LABS LTD trading as PROOF<br />
**Product:** Liskov  
**Jurisdictional focus:** England and Wales / United Kingdom  
**Purpose:** issue assessment and instructions for final launch documents

> This is a working legal-risk analysis produced for independent solicitor review. It is not a substitute for advice based on verified corporate, technical, financial and operational facts.

## 1. Executive assessment

The uploaded pack was a strong first draft, but several issues could not safely be solved by cosmetic edits. The principal risk is a mismatch between the apparent product architecture and conventional SaaS drafting. Liskov is not merely a hosted application: it orchestrates customer-selected workloads across infrastructure that may be operated by unrelated parties in unknown jurisdictions, and it may procure network capacity using cryptoassets. Its legal suite therefore has to allocate responsibility at the correct layer.

The recommended launch architecture is deliberately conservative:

- business customers only;
- free-only Marketplace;
- no Personal Data in standard decentralised workloads;
- no custody, exchange, transfer or seller-payout product;
- non-transferable closed-loop Service Credits;
- PROOF supplies the control plane and procures network capacity as principal;
- enterprise exceptions require a separate Order, security review and data schedule.

Subject to the launch gates below, this is a credible UK launch position. The largest residual risks are operational: what data actually reaches nodes, how payments and tokens actually move, who selects and controls nodes, what Marketplace functions are exposed, and whether the promised security and deletion controls exist.

## 2. Priority risk register

| Priority | Issue | Why it matters | Required position before launch |
|---|---|---|---|
| **BLOCKER** | Personal Data on decentralised nodes | A conventional Article 28 processor chain, location transparency, transfer safeguards, audit rights, deletion and incident response may be impossible where node operators are anonymous, dynamic or outside PROOF’s contractual control. Contract labels do not determine regulatory roles. | Standard Service must prohibit Personal Data and other regulated/sensitive data in Distributed Workloads. Enforce this in product design and onboarding. Any enterprise exception needs an approved node pool, contracts, countries, security controls, transfer mechanism and bespoke data schedule. |
| **BLOCKER** | Payments, Service Credits and network-token flow | Transferability, redemption, third-party acceptance, custody or customer beneficial ownership could move the model toward payment services, e-money or regulated cryptoasset activities. VAT timing and voucher treatment also depend on facts. | Credits must be non-transferable, usable only against PROOF-supplied services, not interest-bearing and not a customer wallet. PROOF must act as principal when procuring network capacity. Obtain FCA-perimeter and tax advice on the exact funds-flow diagram. |
| **BLOCKER** | Paid Marketplace | Collecting buyer money and paying publishers introduces seller/buyer contracting, VAT, consumer cancellation and conformity rights, chargebacks, merchant-of-record questions, sanctions/KYC, platform reporting and potentially regulated payments. | Launch free-only. No in-product price, paid licence, publisher payout, commission or required off-platform side payment. Create a separate paid-marketplace legal and payments workstream later. |
| **BLOCKER** | Marketplace / Online Safety Act scope | Listings, reviews, comments, messaging or searchable user submissions may make Liskov a regulated user-to-user or search service. Pre-moderation alone should not be treated as a complete answer without a documented scope assessment. | Complete and retain a service-scope analysis; map every content feature; carry out any required risk assessments; publish reporting/complaints terms; implement moderation, evidence retention and escalation. Keep launch catalogue curated, business-only and free of comments/DMs if possible. |
| **BLOCKER** | B2B-only positioning | A consumer route would engage mandatory pre-contract information, cancellation, digital-content/services remedies, unfair-terms scrutiny and evolving subscription-contract rules. Merely calling a user a business is not determinative. | Product, pricing and checkout must be business-oriented. Require an express business-purpose representation and organisation details. Do not knowingly accept personal/household use. Produce separate consumer terms before any B2C offer. |
| **BLOCKER** | Corporate and online disclosures | UK company and e-commerce rules require accurate identity and contact information; privacy law requires controller transparency. Missing or inconsistent entity names also weakens contract formation. | Verify legal name, company number, registered office, geographic contact address, email, VAT number/status and trading name across website footer, checkout, invoices, Orders, privacy notice and support channels. |
| **BLOCKER** | Security promises | Unverified statements about encryption, isolation, MFA, backups, audit, retention or incident notification create contractual and misrepresentation exposure. Decentralised execution has a distinct threat model. | Security/engineering sign off every DPA technical measure and public security claim. Remove aspirational controls. Document shared responsibility and node threat assumptions. |
| **BLOCKER** | Subprocessors and transfers | Hosted vendors may process Personal Data outside the UK. The controller needs notice, contractual flow-down and a valid transfer mechanism plus risk assessment where required. | Complete the subprocessor schedule, processing countries, UK adequacy status, UK IDTA/Addendum use, transfer risk assessments and vendor DPAs. Establish change-notice workflow. |
| **BLOCKER** | Sanctions and wallet operations | All UK persons must comply with applicable sanctions. USDC or token operations create wallet, counterparty, network and geography risks even where PROOF is not an FCA-registered cryptoasset business. | Define accepted tokens/networks; screen relevant wallets and counterparties; block prohibited territories/persons; document false-positive, rejection, quarantine and refund handling; ensure no refund sends value to a blocked address. |
| **BLOCKER** | Liability and insurance | A low SaaS cap may be commercially attractive but unreasonable or uninsured for security, IP and enterprise losses. Exclusions cannot cover fraud, death/personal injury caused by negligence or other non-excludable liabilities. | Board and broker approve the general and enhanced caps, cyber/technology E&O cover, deductible and contractual assumptions. Orders must not accidentally override caps without approval. |
| **HIGH** | Customer code and confidential information on nodes | A node may inspect, copy, alter, delay or exfiltrate code, inputs, outputs or traffic unless verified confidential-compute controls prevent it. | Prominent product warning; customer encryption and output validation; no secrets embedded in images; scoped credentials; approved confidential execution only by separate Order. |
| **HIGH** | Upstream network terms | PROOF cannot promise more than it receives from Acurast or another network. Upstream terms may disclaim availability, impose licences, restrict use or allocate token/network risks differently. | Legal review each upstream protocol, API, SDK, node and token term. Align suspension, IP, prohibited use, refunds and liability. Maintain a dependency register. |
| **HIGH** | UK NIS / cyber-resilience perimeter | A cloud-computing or managed-service model can enter sector-specific cyber duties depending on service characteristics, establishment and size; the UK regime is evolving. | Record a current perimeter analysis, including group-size calculations and exemptions. Reassess on headcount/turnover/balance-sheet thresholds, enterprise managed-service features, acquisitions and legislative change. |
| **HIGH** | USDC and cryptoasset characterisation | Marketing, wallet connection, conversion, routing, custody, exchange or arranging can change the regulatory analysis. Labels such as “non-custodial” are not decisive. | Restrict the product to merchant acceptance of specified assets and PROOF’s own procurement. No investment language, token recommendation, exchange quote, yield, staking, custody or transfer service without separate advice. |
| **HIGH** | VAT, invoicing and accounting for credits | Tax point, voucher classification, FX treatment, promotional credit accounting and revenue recognition depend on redemption and service facts. | UK tax adviser signs off. Ensure invoices/credit notes and ledger distinguish cash-funded, promotional, refunded, committed and consumed balances. Do not make tax promises in terms. |
| **HIGH** | Content/IP notice handling | Listings and workloads can infringe copyright, trade marks, privacy or confidentiality. Hosting defences depend in part on knowledge and expeditious action. | Operate rights-holder notice, counter-notice, repeat-abuse and evidence-preservation procedures. Designate trained owners and response targets. |
| **HIGH** | Clickwrap and version evidence | Hyperlink-only browsewrap can fail to prove incorporation. Policies can change over time. | Unambiguous assent before purchase/deployment; accessible copies; version/date; immutable acceptance record; reasonable notice of changes; exportable Order. |
| **HIGH** | Termination and data exit | Immediate deletion conflicts with an export period; indefinite retention conflicts with privacy principles. On-chain data cannot be deleted. | Give 30 days for hosted export, complete active-system deletion by 60 days after termination and routine backup overwrite by 90 days, subject to law/security. Explain immutable public-chain records separately. |
| **HIGH** | Enterprise sales drift | Sales promises can silently override the standard risk model, especially data residency, SLAs, indemnities and unlimited liability. | Contract playbook and approval matrix. No bespoke statement of work or security questionnaire becomes contractual without legal/security review. |
| **MEDIUM** | Auto-renewal and auto-top-up | Surprise billing produces disputes and, for any consumer, mandatory-law exposure. | Clear renewal period, cancellation method, price notice and auto-top-up amount/frequency/cap. Preserve authorisation evidence and make disablement easy. |
| **MEDIUM** | Open-source and app licences | Templates may combine incompatible or reciprocal licences; marketplace rights cannot exceed upstream licences. | SBOM/licence scan, publisher warranty, licence field on listing, source/notice delivery and takedown process. Do not imply PROOF ownership of third-party code. |
| **MEDIUM** | Regulated/high-impact use | Medical, financial, employment, credit, critical infrastructure and safety decisions create sector liability and reliability expectations. | Prohibit by default; require written enterprise approval, risk allocation and human oversight. Do not market Standard Service for safety-critical use. |
| **MEDIUM** | Accessibility, marketing and environmental claims | Unqualified claims can be misleading, and service access obligations may arise in context. | Substantiate performance, security, decentralisation, carbon and savings claims. Provide an accessible support route and avoid absolute claims. |
| **MEDIUM** | Retention and support content | Customers may place Personal Data or secrets into tickets despite workload restrictions. | Warning in support UI; secure support vendor; processor terms; access controls; retention policy; secret-redaction and deletion workflow. |

## 3. Contracting model

### 3.1 Contracting entity and disclosures

The same legal entity must appear throughout the customer journey. On 4 September 2026 the owner confirmed the supplier as **MOOSE LABS LTD**, company number **11435949**, a private limited company registered in England and Wales with its registered office at **The Old Bakery, Camden Road, Tunbridge Wells, England, TN1 2QP**, trading as **PROOF**. Carry those details consistently through the website, checkout, invoices, Orders, privacy notice and support channels.

The website and commercial communications should show, as applicable:

- registered company name and number;
- registered office and a geographic contact address;
- trading name;
- direct email contact;
- VAT number where registered;
- total prices or a clear method of calculation, including whether VAT and unavoidable network charges are excluded;
- steps to conclude the contract, how errors can be corrected, whether the contract is stored and accessible, and the language of the contract;
- applicable professional/regulatory information if the business later enters a regulated perimeter.

### 3.2 Business-only service

The Master Terms make the Standard Service business-only. The implementation should support that position:

- use business-facing product language and use cases;
- collect organisation name and business country;
- require a checkbox confirming the user acts wholly or mainly for business purposes and has authority to bind the customer;
- prevent under-18 use;
- avoid a personal/free tier marketed for household or hobby consumption unless separate terms are adopted;
- investigate obvious personal use rather than relying blindly on a declaration.

A sole trader can still be a consumer for a transaction mainly outside their trade, so the factual journey matters.

### 3.3 Contract formation and hierarchy

Use affirmative clickwrap. The acceptance screen should identify the legal entity and link directly to the Order, Master Terms, Credits Policy, AUP, Privacy Notice and DPA. The user should be able to download or print them before acceptance. Store the exact rendered versions and the authority representation.

The Order should contain product-specific facts that should not be hard-coded in general terms: plan, term, fees, Launch Fee basis, included support, accepted payment methods, permitted workloads, any approved node pool, data region, SLA and special liability terms.

### 3.4 Variation

A unilateral right to change terms without notice is commercially and legally weak. The replacement language distinguishes:

- immediate changes required by law, security or third-party network change, with notice as soon as reasonably practicable; and
- other material changes on at least 30 days’ notice, with a right to terminate before they take effect where they materially disadvantage the customer.

Pricing changes apply no earlier than the next renewal after notice, unless the Order clearly uses variable network costs.

## 4. Decentralised compute and data protection

### 4.1 Why the ordinary SaaS DPA is insufficient

Under the standard controller/processor model, a processor must process on documented instructions, ensure confidentiality, impose equivalent terms on subprocessors, support rights and incidents, delete or return data, make compliance information available and use lawful international-transfer safeguards. A dynamic or anonymous node population may be incompatible with those obligations where PROOF cannot identify, contract with, audit, locate or compel deletion by each node operator.

Describing node operators as independent third parties does not settle their legal role. Role analysis turns on who determines purposes and means and what each party actually does. If PROOF chooses the network, routes data and uses nodes to perform its service, a regulator or customer may argue that the nodes form part of PROOF’s processing chain. Conversely, if the customer directly chooses and contracts with a network, roles may differ. The factual architecture must be documented.

### 4.2 Recommended Standard Service restriction

For launch, the Standard Service should not permit Personal Data in Distributed Workloads. The prohibition should cover:

- ordinary Personal Data, even if pseudonymised;
- special-category and criminal-offence data;
- children’s data;
- payment-card and financial-account data;
- health, genetic and biometric data;
- credentials, private keys, seed phrases, access tokens and production secrets;
- data subject to contractual localisation or sector rules;
- confidential data where node visibility would cause material harm.

“Encrypted” data can still be Personal Data where a party can re-identify it or holds the key. Encryption is a security measure, not an automatic route outside UK GDPR.

### 4.3 Product enforcement

A contractual prohibition alone is not enough. Reasonable controls should include:

- onboarding explanation and explicit acknowledgement;
- API/CLI documentation and warnings adjacent to deployment;
- separate fields for secrets that are never sent to nodes where technically possible;
- payload-size/type guardrails and optional scanning that does not itself create disproportionate privacy risk;
- approved example datasets;
- logs that avoid payload content;
- incident playbook for accidental Personal Data deployment;
- ability to suspend, cancel or contain a job promptly;
- enterprise allow-list rather than ad-hoc exceptions.

### 4.4 Enterprise data path

An enterprise exception should be sold only after a data-flow and DPIA review. It should specify:

- exact node operators or a controlled node pool;
- processor/subprocessor contracts and audit evidence;
- processing countries and transfer mechanism;
- workload isolation and attestation;
- key management and who can decrypt;
- retention/deletion at node, cache, log and backup layers;
- incident detection and notification route;
- support access;
- data categories, subjects, volume and frequency;
- prohibited data that remains out of scope;
- customer responsibilities and verification duties.

### 4.5 Public blockchains

Wallet addresses, transaction hashes and deployment metadata can be Personal Data when linkable to an individual. Public-chain records may be globally replicated and practically immutable. The Privacy Notice therefore explains the limitation and instructs users not to place unnecessary Personal Data on-chain. PROOF should minimise on-chain metadata and avoid embedding support identifiers, emails, IP addresses or raw payloads.

### 4.6 PROOF’s data roles

The replacement DPA uses a split model:

- PROOF is normally an independent controller for account administration, billing, fraud/security, compliance, product analytics and its own business records;
- PROOF is a processor only where the customer submits Personal Data to hosted service features for processing on the customer’s instructions;
- Distributed Workload Data is outside the standard DPA because Personal Data is prohibited there;
- each party is an independent controller for its own legal/compliance records.

This is a starting allocation, not a substitute for a data-flow review.

### 4.7 Data Use and Access Act changes

The UK data-protection framework now includes amendments made by the Data (Use and Access) Act 2025, with provisions brought into force in stages. Counsel should check the commencement position at publication. Operationally, the privacy programme should include a clear data-protection complaint route, acknowledgement and response workflow, and updated procedures for access requests, legitimate interests, automated decision-making and any cookie-consent exemptions relied on.

## 5. Security and service reliability

### 5.1 Shared responsibility

The contract should not imply that PROOF secures the customer’s application. PROOF secures the components it controls; customers remain responsible for code, dependencies, access control, secrets, payloads, output validation, legal use, backups and recovery appropriate to their application.

For decentralised execution, customers must assume that:

- node identity, location, availability and trustworthiness may change;
- technical isolation can fail;
- a node may return an incorrect or incomplete result;
- jobs may be delayed, duplicated, reordered or lost;
- public networks may fork, congest, halt or change rules;
- third-party SDKs, bridges, RPC endpoints and token markets may fail;
- credentials included in a workload can be copied.

These are not reasons to exclude all responsibility. PROOF still promises reasonable skill and care for its own Services and remains responsible for liabilities that cannot lawfully be excluded.

### 5.2 Security schedule truth test

Before the DPA is used, engineering should mark each technical measure as:

- implemented and continuously enforced;
- implemented only for specified components;
- planned but not implemented; or
- not applicable.

Delete planned controls from the binding schedule or label them as roadmap information outside the contract. Particular areas to verify are encryption at rest, tenant separation, privileged access, MFA, vulnerability scanning, dependency management, audit logging, log retention, backups, restoration testing, secure development, incident exercises, vendor review and deletion from backups.

### 5.3 Incident notification

The DPA uses the statutory “without undue delay” standard and a non-binding operational target rather than an absolute 24-hour promise. A hard deadline starts when PROOF becomes aware of a Personal Data Breach, which requires a defined escalation and decision process. Security incidents that do not affect Personal Data are handled under the Master Terms and any Order/SLA.

### 5.4 Availability and beta features

Standard terms should not create an undocumented SLA. Enterprise availability, support hours, service credits and remedies belong in an Order or SLA. Preview/beta functions should be clearly labelled, optional and excluded from production assurances. “As is” language does not disapply mandatory law or the reasonable-care-and-skill promise for paid business services.

## 6. Service Credits, fiat and USDC

### 6.1 The legal substance

The replacement model treats Service Credits as a contractual account entry recording prepayment for Eligible Services supplied by PROOF. They are:

- non-transferable;
- usable only by the purchasing customer within its Workspace;
- not accepted by node operators, publishers or other customers;
- not interest-bearing;
- not represented by a transferable token;
- not a claim to any specific fiat or cryptoasset held by PROOF;
- not usable to send value to third parties;
- refundable only in the limited contractual circumstances stated in the policy.

These features reduce—but do not by themselves eliminate—payment-services/e-money risk. Counsel must review the actual journey, ledger and contractual relationships.

### 6.2 Principal, not customer-money agent

The preferred commercial flow is:

1. the customer buys Liskov services/capacity from PROOF;
2. PROOF records the prepayment as Service Credits;
3. when the customer launches a workload, PROOF consumes Credits for its fees and the network capacity supplied to the customer;
4. PROOF may separately acquire and spend ACU or another token in its own name to procure upstream capacity;
5. the customer has no proprietary interest in PROOF’s bank account, wallet or tokens and does not instruct PROOF to transmit its money to a node operator.

If the real flow instead makes PROOF an agent, custodian, exchange, broker or transmitter for customer assets, the documents must be changed and the regulatory analysis repeated.

### 6.3 USDC acceptance

Merchant acceptance of USDC should be tightly constrained:

- only listed token contract(s) and network(s);
- checkout quote expires after a short period;
- credit only after the required confirmations and receipt in the specified address;
- no responsibility for unsupported tokens, wrong networks or customer-controlled gas errors, except where caused by PROOF;
- ability to pause acceptance during a depeg, chain incident or sanctions concern;
- refunds to the lawful original payer/address where technically and legally possible, after screening;
- no promise to exchange USDC for another asset for the customer;
- no custody of a customer wallet or private key;
- clear accounting currency and FX methodology.

Do not market payment as an investment, “on-ramp”, exchange or yield feature.

### 6.4 Refunds and insolvency disclosure

Paid, unused and uncommitted Credits should be refundable when PROOF terminates without customer breach or permanently discontinues the paid Service. A customer terminating for convenience need not receive a pro-rata subscription refund, but a blanket forfeiture of a large unused prepaid network balance is commercially harsh and may be difficult to justify. The clean policy permits account-closure refunds subject to deductions and fraud/sanctions checks.

The terms disclose that balances are not safeguarded or held on trust and would ordinarily be an unsecured contractual claim on insolvency. Operationally, keep balances proportionate through low auto-top-up thresholds and spending caps.

### 6.5 Tax and accounting

Obtain advice on:

- whether Credits are outside voucher rules, a single-purpose voucher, a multi-purpose voucher or simply a payment on account;
- VAT tax point and place of supply;
- VAT treatment of network capacity, platform fees and Launch Fees;
- USDC valuation and FX evidence;
- promotional Credits and discounts;
- unredeemed balance accounting and breakage;
- refunds and credit notes;
- overseas B2B reverse-charge evidence;
- whether any marketplace reporting rules apply when paid functionality is added.

The legal documents should not state a tax result beyond making customers responsible for their own taxes and allowing PROOF to charge required VAT.

## 7. Marketplace

### 7.1 Free-only launch

The clean Marketplace Terms create a curated catalogue of free applications, templates and integrations. PROOF does not process a purchase between user and publisher, does not pay publishers and does not permit a listing to require an undisclosed side payment for the listed functionality.

This avoids trying to solve an undefined paid-marketplace model with generic clauses. Before paid listings, decide:

- seller of record, merchant of record or disclosed agent;
- who contracts with the buyer;
- who supplies digital content/service and handles conformity remedies;
- VAT collection/invoicing and platform reporting;
- PSP flow, reserves, chargebacks and negative balances;
- publisher KYC/KYB and sanctions screening;
- currency and cryptoasset handling;
- consumer cancellation and immediate-supply consent;
- licence delivery and updates;
- refunds, disputes and support;
- ranking, suspension and business-user transparency;
- IP infringement and security review;
- platform commission and tax treatment.

### 7.2 Content and Online Safety Act

The Marketplace can expose user-generated content even if the items are technical rather than social. Features to map include:

- publisher names and profiles;
- titles, descriptions, screenshots and documentation;
- source links and package metadata;
- reviews, ratings and comments;
- search suggestions and ranking;
- direct messages or support threads;
- automatic imports from GitHub or registries;
- public activity feeds.

The safest initial design is manual approval before publication, no public comments/DMs, verified business publishers, clear reporting, and fast delisting. That design may reduce risk but should not be treated as a definitive statutory exemption. Keep a written scope decision and revisit it before each social/search feature.

The Notice-and-Action Policy provides a single route for illegality, safety, IP, privacy and security reports. Operational procedures must triage urgent threats, preserve evidence lawfully, notify affected publishers where appropriate, give reasons, and offer a proportionate appeal.

### 7.3 Publisher rights and open source

Publishers retain their rights and grant PROOF only the licence needed to host, reproduce, scan, test, display and distribute the listing/package. Each listing must identify its applicable licence. PROOF’s Marketplace terms cannot override an open-source licence; users receive rights under the package’s stated licence, not an invented PROOF licence.

Require publishers to warrant rights, disclose dependencies and known material vulnerabilities, avoid secrets, maintain accurate metadata and cooperate with security/takedown requests. Use automated malware, secret and licence scanning, but do not describe it as a guarantee.

### 7.4 Ranking and moderation

Document the principal ranking parameters in plain language: relevance, compatibility, security/review status, maintenance, quality, popularity and commercial relationship if any. At free-only launch there should be no paid placement unless plainly labelled. Give business publishers reasons for restriction/suspension except where doing so would undermine security, law enforcement or abuse prevention.

## 8. Acceptable use and regulated workloads

The AUP must be enforceable but not so vague that routine security work becomes a breach. It therefore distinguishes authorised testing from attack, and allows written exceptions for enterprise use.

Prohibited areas include unlawful content, IP infringement, malware, phishing, credential theft, botnets, denial of service, spam, unauthorised scanning, open relays/proxies, sanctions evasion, child sexual abuse material, terrorist content, exploitative content, circumvention of controls, proof-of-work mining unless authorised, and unsafe/high-impact use without approval.

PROOF should maintain:

- abuse intake and severity matrix;
- emergency suspension authority;
- documented evidence and decision logs;
- contact route for law enforcement;
- repeat-abuser policy;
- appeal process where appropriate;
- rules for disclosure that comply with data protection and applicable legal process;
- transparency metrics if regulatory scope requires them.

## 9. Liability architecture

### 9.1 Statutory limits

English law does not permit exclusion of liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation. Other negligence, implied-term and misrepresentation exclusions are subject to statutory controls including reasonableness in standard business terms. A clause’s label is not decisive.

### 9.2 Recommended caps

The clean Master Terms use:

- an uncapped/non-excludable bucket for liabilities that cannot lawfully be limited and the customer’s obligation to pay valid charges;
- an enhanced aggregate cap of 200% of Fees paid or payable in the relevant 12-month period for breach of confidentiality, data-protection obligations and the express IP indemnities;
- a general aggregate cap of 100% of Fees paid or payable in the relevant 12-month period, with the enhanced cap replacing rather than adding to it for protected claims;
- a £100 cap for a wholly free Service, subject to non-excludable liability.

This is a negotiation starting point. Review against insurance, average contract value and realistic direct-loss scenarios. Enterprise Orders may need a monetary floor or cap based on annual contract value rather than historic fees in a new contract.

### 9.3 Excluded loss

The draft excludes indirect/consequential loss and specified business losses such as profit, revenue, anticipated savings and goodwill, whether direct or indirect to the extent English law permits. It does not attempt to exclude every direct data-restoration or incident-response cost; those remain within the applicable cap. This is more defensible than saying PROOF has no liability for any data loss while selling a data-processing service.

### 9.4 Network risk

PROOF is not made liable merely because an independent network or node fails. However, the exclusion does not protect PROOF from its own failure to exercise reasonable care in selecting, configuring or operating components it controls. The wording uses causation rather than a blanket third-party disclaimer.

### 9.5 Indemnities

The customer indemnity is limited to third-party claims caused by Customer Content, Applications or unlawful use, with defence-control protections. PROOF gives a conventional, limited IP-infringement remedy for the proprietary Services. The indemnities fall within the enhanced cap except for fraud/deliberate misconduct and payment obligations, reducing one-sided enforceability concerns.

## 10. Privacy, cookies and marketing

### 10.1 Privacy Notice

The replacement Privacy Notice covers account, contact, billing, wallet/public-chain, support, telemetry, security and marketing data; controller/processor role separation; sources; purposes and lawful bases; recipients; international transfers; retention; rights; complaints; children; and blockchain immutability.

Verify the retention table against actual systems. Avoid “we never” claims unless technically guaranteed. Where fraud/security profiling is used, explain meaningful effects and confirm whether any solely automated decision has legal or similarly significant effect.

### 10.2 Cookie and storage consent

Before publication, run a scan across public website, app, authentication, support widget, analytics and embedded content. Categorise cookies, local storage, SDK identifiers, pixels and similar access/storage. Non-essential technologies should not run until valid consent. The interface should make rejection as straightforward as acceptance and preserve consent/version evidence. A generic notice does not cure a banner that fires analytics early.

The Data (Use and Access) Act has modified the UK framework and created or adjusted exceptions for some low-risk storage/access. Rely on a specific documented exception, not a broad “legitimate interests” theory, and verify commencement/current ICO guidance.

### 10.3 Electronic marketing

Separate service messages from marketing. Obtain or document the appropriate PECR basis for email/SMS marketing, honour objections promptly and maintain suppression lists. Do not upload customer contacts to ad platforms without a lawful and transparent basis.

## 11. Sanctions, export controls and illegal use

PROOF should screen the legal customer and, where proportionate, controlling persons and relevant wallet addresses. Contract rights should allow refusal, freezing of service access (not unlawful dealing), investigation and termination. Do not promise a refund where making it would breach sanctions; hold and report only as law requires.

Export-control analysis should cover:

- customer code and cryptography;
- technical data supplied across borders;
- sanctioned-country access;
- US-origin software/cloud components with re-export conditions;
- workloads involving military, dual-use, surveillance, nuclear, missile, chemical or biological applications;
- node locations that cause prohibited export/re-export.

Because a decentralised scheduler may select an unknown country, location-sensitive workloads should be prohibited unless an approved pool enforces geography.

## 12. NIS and broader cyber regulation

Liskov should maintain a standing assessment under the Network and Information Systems Regulations 2018 and any amending/replacement cyber-security legislation. Questions include whether Liskov is a “cloud computing service” or managed service, whether PROOF is established in the UK for the regime, whether a small/micro-enterprise exemption applies, whether group undertakings affect size, and whether an exception removes that exemption.

Reassessment triggers should include:

- crossing employee/turnover/balance-sheet thresholds;
- entering a corporate group;
- supplying managed monitoring, administration or security functions;
- acquiring critical-sector customers;
- receiving a designation or regulator contact;
- a material incident;
- legislation extending scope to managed service providers or supply-chain services.

Do not wait for a threshold event to implement proportionate security and incident governance; contract and GDPR obligations apply independently.

## 13. International reach

English governing law does not disapply mandatory law in every customer country. Before actively targeting the EU, US states or other markets, review:

- local consumer and auto-renewal rules;
- privacy representative/registration and transfer requirements;
- EU Digital Services Act and Platform-to-Business rules;
- sales tax/VAT/GST;
- cryptoasset and money-transmission regimes;
- sanctions/export controls;
- local hosting/telecommunications rules;
- enforceability of liability and jurisdiction clauses.

At launch, record permitted and blocked countries and make sales/marketing consistent with that scope.

## 14. Intellectual property and corporate housekeeping

Confirm that Moose Labs Ltd owns or has sufficient rights to all Liskov code, branding, domains, documentation, designs and datasets. Obtain written IP assignments and confidentiality obligations from founders, employees and contractors. Audit open-source dependencies, especially reciprocal licences and copied examples. Register or clear the Liskov and PROOF marks in priority territories.

Customer data/code remains customer-owned. PROOF receives a narrow operational licence. Aggregated analytics must be genuinely de-identified and should not be used to train general models on customer code or content without explicit opt-in terms.

## 15. Operational sign-off required

The detailed matrix is in `12-LAUNCH-SIGN-OFF-MATRIX.md`. The board should receive a one-page certification from Legal, Security, Engineering, Finance/Tax, Product and Operations confirming that:

- the contract describes the actual service;
- all mandatory disclosures are correct;
- clickwrap/version evidence works;
- the Standard Service data prohibition is implemented;
- security measures and deletion periods are true;
- payment and token flow matches the approved diagram;
- sanctions and abuse handling are live;
- Marketplace features match the free-only terms;
- no unsupported marketing claim is live;
- insurance and liability caps align.

## 16. Change-control triggers

Repeat legal review before enabling any of the following:

- paid Marketplace listings, commissions or publisher payouts;
- transferable or peer-to-peer credits;
- cash or crypto withdrawal on demand;
- customer token custody, hosted wallets, key recovery or transaction signing by PROOF;
- token exchange, routing, brokerage, staking, yield or investment features;
- Personal Data or confidential regulated data on decentralised nodes;
- node selection/operation by PROOF beyond the reviewed model;
- consumer plans;
- public comments, messages, social feeds or user-generated search features;
- AI model training on customer content;
- healthcare, financial, employment, critical-infrastructure or safety-critical use;
- a materially broader geographic launch;
- contractual data residency or confidential-compute guarantees;
- enterprise terms with uncapped liability, broad indemnity or bespoke audit rights.

## 17. Principal legal materials for counsel to verify

The following are starting points, not an exhaustive opinion. Check amendments, commencement and current regulator guidance on the publication date.

- UK GDPR and Data Protection Act 2018: https://www.legislation.gov.uk/ukpga/2018/12/contents
- Data (Use and Access) Act 2025: https://www.legislation.gov.uk/ukpga/2025/18/contents
- ICO guidance hub: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/
- ICO international transfers: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/
- Privacy and Electronic Communications Regulations 2003: https://www.legislation.gov.uk/uksi/2003/2426/contents
- Electronic Commerce (EC Directive) Regulations 2002: https://www.legislation.gov.uk/uksi/2002/2013/contents
- Companies (Trading Disclosures) Regulations 2008: https://www.legislation.gov.uk/uksi/2008/495/contents
- Unfair Contract Terms Act 1977: https://www.legislation.gov.uk/ukpga/1977/50/contents
- Misrepresentation Act 1967: https://www.legislation.gov.uk/ukpga/1967/7/contents
- Consumer Rights Act 2015: https://www.legislation.gov.uk/ukpga/2015/15/contents
- Consumer Contracts Regulations 2013: https://www.legislation.gov.uk/uksi/2013/3134/contents
- Digital Markets, Competition and Consumers Act 2024: https://www.legislation.gov.uk/ukpga/2024/13/contents
- Electronic Money Regulations 2011: https://www.legislation.gov.uk/uksi/2011/99/contents
- Payment Services Regulations 2017: https://www.legislation.gov.uk/uksi/2017/752/contents
- Money Laundering Regulations 2017: https://www.legislation.gov.uk/uksi/2017/692/contents
- FCA cryptoassets guidance/registration: https://www.fca.org.uk/firms/financial-crime/cryptoassets-aml-regime
- UK sanctions guidance: https://www.gov.uk/guidance/uk-sanctions
- Online Safety Act 2023: https://www.legislation.gov.uk/ukpga/2023/50/contents
- Ofcom online-safety guidance: https://www.ofcom.org.uk/online-safety/
- Network and Information Systems Regulations 2018: https://www.legislation.gov.uk/uksi/2018/506/contents
- ICO NIS guidance: https://ico.org.uk/for-organisations/the-guide-to-nis/
- Copyright, Designs and Patents Act 1988: https://www.legislation.gov.uk/ukpga/1988/48/contents
- Contracts (Rights of Third Parties) Act 1999: https://www.legislation.gov.uk/ukpga/1999/31/contents
- Late Payment of Commercial Debts (Interest) Act 1998: https://www.legislation.gov.uk/ukpga/1998/20/contents
- HMRC VAT vouchers guidance: https://www.gov.uk/guidance/vat-treatment-of-vouchers-from-1-january-2019

## 18. Bottom line

The clean suite is suitable as a disciplined negotiation and launch baseline, not as a substitute for factual verification. The most important commercial decision is to keep the first release within the narrow model the text describes. Expansion can be documented later; launching broad functionality under labels that conceal unresolved data, payments or platform roles is materially riskier.
