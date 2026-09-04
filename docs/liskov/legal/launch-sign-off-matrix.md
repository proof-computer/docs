---
title: Liskov launch legal sign-off matrix — 3 September 2026
description: Unapproved legal, privacy, security, finance, product, and operational launch gates for Liskov.
draft: true
---

# Liskov launch legal sign-off matrix

:::caution[Not in force]
Review version 1.0, dated 3 September 2026. This matrix is review material, has
no contractual effect, and is excluded from the production documentation build.
Every blocker remains open until its owner records evidence and approval.
:::

**Review date:** 3 September 2026  
**Instruction:** no item marked **BLOCKER** may be assumed complete. Record owner, evidence link, decision/date and approver.

## A. Corporate, contract and sales

| Priority | Requirement | Required evidence / decision | Owner | Status |
|---|---|---|---|---|
| **BLOCKER** | Contracting entity | Companies House extract; verified legal name, company number, registered office, trading name | Legal/Company Secretary | ☐ |
| **BLOCKER** | Website/e-commerce disclosures | Footer, contact page, checkout and invoices show required identity/address/email/VAT/price information | Legal/Product | ☐ |
| **BLOCKER** | B2B-only journey | Business-purpose checkbox, organisation/country field, under-18 exclusion, business-oriented marketing; consumer use response | Product/Legal | ☐ |
| **BLOCKER** | Clickwrap | Screenshot/test of affirmative acceptance; direct document links; no pre-ticked acceptance | Product/Legal | ☐ |
| **BLOCKER** | Acceptance evidence | Immutable record of customer/workspace, user, authority statement, Order, document versions, timestamp and relevant technical evidence | Engineering/Legal | ☐ |
| High | Order template | Plan, term, renewal, fees, Launch Fee basis, usage limits, support, data path, SLA and approved exceptions are explicit | Sales/Legal | ☐ |
| High | Contract precedence | Checkout/Order incorporates documents in approved order; POs do not override | Legal/Sales Ops | ☐ |
| High | Sales claims | Security, performance, savings, decentralisation, geography, carbon and compliance claims substantiated | Marketing/Legal/Engineering | ☐ |
| High | Enterprise deviations | Approval matrix for cap, indemnity, data, audit, SLA, security and governing-law changes | Legal/Board | ☐ |
| Medium | Version/change notice | Version repository, administrator notice, effective-date and termination/refund process | Legal/Product | ☐ |
| Medium | Domain/email ownership | PROOF controls legal/privacy/security/support/marketplace mailboxes and monitors them | Operations | ☐ |

## B. Product architecture and decentralised network

| Priority | Requirement | Required evidence / decision | Owner | Status |
|---|---|---|---|---|
| **BLOCKER** | Supply-layer diagram | Current diagram distinguishing PROOF control plane, upstream network, node operators, customer wallet, payment providers and users | Architecture/Legal | ☐ |
| **BLOCKER** | Upstream contracting | Acurast/other Network terms reviewed; rights, fees, token use, suspension, IP, liability and data position mapped | Legal/Engineering | ☐ |
| **BLOCKER** | Principal model | Finance/Legal confirm PROOF buys capacity/tokens as principal and does not hold/transmit customer assets as agent | Finance/Legal | ☐ |
| **BLOCKER** | Node threat model | Document node identity/location/visibility, sandbox/attestation limits, output integrity, interruption and deletion | Security/Architecture | ☐ |
| **BLOCKER** | Workload warnings | Console/API/CLI/docs display data, secret, location and output-validation warnings before launch | Product/Engineering | ☐ |
| High | Spending controls | Hard/soft cap behaviour, settlement overrun, retries and cancellation tested/documented | Engineering/Finance | ☐ |
| High | Network failure runbook | Fork, chain halt, depeg, RPC outage, node compromise and upstream-price event procedures | SRE/Security | ☐ |
| High | Geographic restrictions | Product cannot imply residency; approved enterprise node-pool control tested | Architecture/Legal | ☐ |
| Medium | Proof/result validation | Documentation identifies what a proof/attestation establishes and does not establish | Engineering/Legal | ☐ |
| Medium | Dependency register | Networks, bridges, RPCs, wallets, SDKs, token issuers and critical licences tracked with owners | Engineering | ☐ |

## C. Data protection and privacy

| Priority | Requirement | Required evidence / decision | Owner | Status |
|---|---|---|---|---|
| **BLOCKER** | Data map | All Personal Data from website, app, auth, billing, support, analytics, Marketplace, wallets and logs mapped | Privacy/Engineering | ☐ |
| **BLOCKER** | Workload Personal Data prohibition | Technical/product enforcement plus customer acknowledgement; accidental submission runbook | Product/Security/Legal | ☐ |
| **BLOCKER** | Role assessment | Written Controller/Processor analysis for each data flow; no reliance on labels | Privacy/Legal | ☐ |
| **BLOCKER** | Subprocessor list | Exact legal entities, purposes, data, countries and assurance links completed | Privacy/Procurement | ☐ |
| **BLOCKER** | Vendor contracts | Article 28 terms, security, breach, deletion, audit and onward-processing clauses executed | Legal/Procurement | ☐ |
| **BLOCKER** | International transfers | Adequacy/IDTA/Addendum and transfer-risk assessments completed per route | Privacy/Legal | ☐ |
| **BLOCKER** | DPA TOMs | Security/Engineering sign each Annex 2 control; aspirational text removed | CISO/Engineering/Legal | ☐ |
| **BLOCKER** | Retention/deletion | System-by-system retention; 30-day export, day-60 active deletion, day-90 backup overwrite technically achievable | Engineering/Privacy | ☐ |
| High | Rights/complaints | DSAR and data complaint workflow, identity verification, statutory timing and ownership tested | Privacy/Support | ☐ |
| High | Breach process | Awareness/escalation definition, 48-hour target, customer notices and regulator decision tree exercised | Security/Privacy | ☐ |
| High | Public blockchain minimisation | On-chain fields reviewed; no direct identifiers/support IDs/payloads; immutability notice live | Engineering/Privacy | ☐ |
| High | Support data | Support tool DPA, access, retention and secret warning/redaction controls | Support/Security | ☐ |
| Medium | ICO obligations | Data protection fee/registration and any DPO/representative requirement confirmed | Legal/Privacy | ☐ |
| Medium | Legitimate interests | LIAs for security, analytics, B2B marketing and Marketplace integrity | Privacy | ☐ |
| Medium | Automated decisions | Fraud/sanctions/abuse rules documented; human review and explanation route | Compliance/Privacy | ☐ |

## D. Payments, Service Credits, cryptoassets and tax

| Priority | Requirement | Required evidence / decision | Owner | Status |
|---|---|---|---|---|
| **BLOCKER** | Funds-flow diagram | Fiat/USDC receipt, Credit issue, ledger, network-token acquisition/spend, refund and chargeback shown end-to-end | Finance/Product/Legal | ☐ |
| **BLOCKER** | FCA perimeter opinion | UK counsel confirms current model does not require e-money/payment/cryptoasset authorisation or registration, or identifies action | Legal/Board | ☐ |
| **BLOCKER** | Closed-loop enforcement | No credit transfer, user payout, cash withdrawal, third-party acceptance or transferable token path | Engineering/Product | ☐ |
| **BLOCKER** | Customer wallet custody | No private-key custody/recovery/signing by PROOF; wallet UX accurately describes customer authorisation | Security/Product/Legal | ☐ |
| **BLOCKER** | Supported USDC routes | Exact token contract, chain IDs, confirmations, quote source/expiry, wrong-network and depeg handling configured | Finance/Engineering | ☐ |
| **BLOCKER** | Sanctions screening | Customer/wallet screening, blocked geography, escalation, false positive, freeze/rejection/refund procedure live | Compliance/Finance | ☐ |
| **BLOCKER** | Tax/VAT advice | Written advice on Credits/vouchers, tax point, place of supply, VAT, FX, promotions, refunds, network/Launch Fees | Tax/Finance | ☐ |
| High | Refund capability | Original payer/address verification, deductions, minimum, timelines, ledger/credit notes and legal holds tested | Finance/Support | ☐ |
| High | Insolvency/balance exposure | Board approves no-safeguarding disclosure; customer balance limits and just-in-time top-up | Board/Finance | ☐ |
| High | Auto top-up | Explicit opt-in, trigger/amount/cap, receipts, disablement and failed-payment behaviour | Product/Finance | ☐ |
| High | Chargebacks | Ledger reversal, negative balance, dispute and suspension workflow | Finance/Support | ☐ |
| Medium | Accounting controls | Paid/promotional/committed/consumed/refunded balances separated; reconciliation and audit trail | Finance | ☐ |
| Medium | Financial promotions | Marketing reviewed to remove investment, yield, appreciation, “on-ramp/exchange” or token-recommendation language | Legal/Marketing | ☐ |

## E. Marketplace, content and platform safety

| Priority | Requirement | Required evidence / decision | Owner | Status |
|---|---|---|---|---|
| **BLOCKER** | Free-only implementation | No price field, checkout, commission, payout, transferable Credits, tips or undisclosed required side payment | Product/Engineering | ☐ |
| **BLOCKER** | Online Safety Act scope | Written feature-by-feature assessment; applicable risk assessments/duties completed before public launch | Legal/Trust & Safety | ☐ |
| **BLOCKER** | Publication workflow | Verified business Publisher, manifest, manual approval, versioning and material-change review | Marketplace Ops/Security | ☐ |
| **BLOCKER** | Notice-and-action | Monitored form/mailbox, triage, reasons, counter-notice, appeal and recordkeeping live | Trust & Safety/Legal | ☐ |
| **BLOCKER** | Emergency escalation | Child safety, terrorism, imminent threat, active malware and law-enforcement procedures with on-call owners | Trust & Safety/Security | ☐ |
| High | Security scanning | Malware, secret, dependency, licence and provenance scans; limitations accurately described | Security/Engineering | ☐ |
| High | IP/open-source | Item Licence required; notices/source obligations; rights-owner and repeat-abuse procedure | Legal/Marketplace Ops | ☐ |
| High | Ranking transparency | Principal factors documented; no undisclosed paid placement; manipulation controls | Product/Legal | ☐ |
| High | Publisher notices/appeals | Templates and independent reviewer for significant decisions | Marketplace Ops | ☐ |
| High | Feature gates | Public reviews, comments, DMs, activity feed and user-content search disabled pending separate sign-off | Product | ☐ |
| Medium | Publisher security | Security contact, signing/provenance and compromise/revocation workflow | Security/Marketplace Ops | ☐ |
| Medium | Transparency reporting | Metrics/record format capable of satisfying applicable platform duties | Trust & Safety | ☐ |

## F. Security, reliability and operations

| Priority | Requirement | Required evidence / decision | Owner | Status |
|---|---|---|---|---|
| **BLOCKER** | Security baseline | Current architecture/control evidence for access, MFA, encryption, isolation, secrets, patching, logging and vendors | CISO/Engineering | ☐ |
| **BLOCKER** | Incident response | On-call, severity, containment, evidence, communications, privacy/legal and post-incident process tested | Security/SRE | ☐ |
| **BLOCKER** | Backup/deletion truth | Actual scope/frequency/restoration test and backup overwrite align with contract | SRE/Engineering | ☐ |
| High | Vulnerability disclosure | Safe-harbour/scope/reporting policy and internal triage | Security/Legal | ☐ |
| High | Secure SDLC | Code review, dependency scan, release provenance, secrets scanning and remediation targets documented | Engineering/Security | ☐ |
| High | Availability claims | Standard support versus SLA clearly separated; status/maintenance process | SRE/Product | ☐ |
| High | Business continuity | Critical providers, recovery priorities, communication and manual fallback | SRE/Operations | ☐ |
| Medium | Access review | Joiner/mover/leaver, privileged access and periodic review evidence | Security/People Ops | ☐ |
| Medium | Logs | Payload minimisation, retention, integrity, access and alerting verified | Security/Privacy | ☐ |
| Medium | Enterprise questionnaires | Controlled response library; no unchecked commitments become contractual | Security/Legal/Sales | ☐ |

## G. Liability, insurance and governance

| Priority | Requirement | Required evidence / decision | Owner | Status |
|---|---|---|---|---|
| **BLOCKER** | Liability caps | Board approves 100% general / 200% enhanced / £100 free caps or revised figures | Board/Legal | ☐ |
| **BLOCKER** | Insurance | Broker confirms cyber and technology E&O limits, exclusions, territories, crypto/decentralised-compute and contractual liability | Finance/Board | ☐ |
| High | IP ownership | Founder/employee/contractor assignments; repository and brand ownership; open-source audit | Legal/Engineering | ☐ |
| High | Regulatory register | NIS/cyber, data, online safety, payments/crypto, sanctions and tax assessments with owners/triggers | Legal/Compliance | ☐ |
| High | Country launch list | Permitted/blocked markets and mandatory local-law review | Board/Legal | ☐ |
| High | Claims escalation | Legal hold, insurer notice and external counsel process | Legal/Security | ☐ |
| Medium | Board approval | Minutes approving launch model, residual risks, policies and delegated emergency powers | Board/Company Secretary | ☐ |
| Medium | Training | Support, sales, engineering, finance and moderators trained on data/payment/abuse limits | Operations/Legal | ☐ |
| Medium | Review cadence | Quarterly first-year legal/operational review and trigger-based review | Legal/Board | ☐ |

## H. Cookie, marketing and website release

| Priority | Requirement | Required evidence / decision | Owner | Status |
|---|---|---|---|---|
| **BLOCKER** | Technology inventory | Production scan of cookies, storage, pixels, SDKs, server-side events and embeds | Privacy/Engineering | ☐ |
| **BLOCKER** | Consent behaviour | Reject prevents optional client/server events; accept granular; withdrawal works; consent evidence retained | Product/Privacy | ☐ |
| High | Cookie exceptions | Specific DUAA/PECR exception and commencement/guidance documented for any no-consent analytics | Legal/Privacy | ☐ |
| High | Marketing basis | B2B marketing rules, consent where required, suppression and CRM/ad-platform sharing documented | Marketing/Privacy | ☐ |
| High | Privacy publication | Notice matches actual processing, providers, countries, retention and contacts | Privacy/Legal | ☐ |
| Medium | Accessibility | Legal pages and consent controls keyboard/screen-reader usable; plain-language support route | Product | ☐ |
| Medium | Release archive | PDFs/HTML and hashes of every legal version stored; old URLs remain retrievable internally | Legal/Engineering | ☐ |

## Final approval record

| Function | Name | Decision / conditions | Date | Signature / recorded approval |
|---|---|---|---|---|
| Board |  |  |  |  |
| Legal |  |  |  |  |
| Privacy |  |  |  |  |
| Security |  |  |  |  |
| Engineering |  |  |  |  |
| Product |  |  |  |  |
| Finance/Tax |  |  |  |  |
| Operations/Support |  |  |  |  |
