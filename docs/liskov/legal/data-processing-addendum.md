---
title: Liskov Data Processing Addendum — review draft
description: Draft UK controller-to-processor terms for Customer Personal Data processed through Liskov.
draft: true
---

# Liskov Data Processing Addendum — review draft

:::caution Not in force
Version 0.1, dated 2 September 2026. This addendum requires privacy, security,
infrastructure, and legal review and has no contractual effect.
:::

This Data Processing Addendum ("DPA") forms part of the Liskov Master Terms
between MOOSE LABS LTD, trading as PROOF ("PROOF"), and the Customer.

## 1. Scope and roles

This DPA applies where PROOF processes Customer Personal Data on behalf of the
Customer in providing Liskov. The Customer is controller and PROOF is processor
for that processing, except where either party acts as an independent controller
under applicable law.

"Customer Personal Data" means personal data contained in Customer Content and
processed by PROOF on the Customer's behalf. It excludes business-contact,
account, billing, fraud, security, and relationship data for which PROOF acts as
controller under the Privacy Notice.

"Data Protection Law" means the UK GDPR, the Data Protection Act 2018, the Data
(Use and Access) Act 2025 as in force, PECR, and other applicable UK
data-protection law. Terms such as controller, processor, personal data,
processing, and data subject have their meanings in Data Protection Law.

## 2. Customer instructions

PROOF will process Customer Personal Data only:

- to provide, secure, support, and improve the contracted Service;
- as documented in the Agreement, Customer configuration, support request, or
  other written instruction; or
- as required by UK law, in which case PROOF will inform the Customer before
  processing unless law prohibits notice.

PROOF will notify the Customer if, in its opinion, an instruction infringes
Data Protection Law. PROOF may suspend the affected processing while the
parties resolve the issue.

The Customer is responsible for the lawfulness, fairness, accuracy, and
transparency of Customer Personal Data and instructions, including required
notices, lawful bases, consents, rights, minimisation, retention, and transfer
safeguards. The Customer will not instruct PROOF to process special-category or
criminal-offence data unless the Customer has identified a valid legal
condition, implemented proportionate safeguards, and confirmed that the
Service is suitable.

## 3. Confidentiality

PROOF will ensure that personnel authorized to process Customer Personal Data
are bound by confidentiality and receive appropriate privacy and security
training. Access will be limited to personnel and systems that need it for the
permitted processing.

## 4. Security

Taking account of the state of the art, implementation costs, the nature,
scope, context, and purposes of processing, and risk to individuals, PROOF will
maintain appropriate technical and organizational measures. The draft measures
are described in Schedule 2.

The Customer is responsible for secure Application design, access
configuration, end-user devices, Customer-controlled integrations, backups,
keys held by the Customer, data minimisation, and encryption required by the
Customer's use case.

## 5. Personal-data breaches

PROOF will notify the Customer without undue delay after becoming aware of a
personal-data breach affecting Customer Personal Data. The notice will provide,
as information becomes available:

- the nature of the breach and affected data or data subjects;
- likely consequences;
- measures taken or proposed; and
- a contact for follow-up.

Notification is not an admission of fault. The Customer is responsible for
notifications to regulators and data subjects, and PROOF will provide
reasonable assistance taking account of the processing and information
available.

## 6. Data-subject rights and compliance assistance

Taking account of the nature of processing, PROOF will provide reasonable
assistance for the Customer to respond to data-subject requests and meet its
security, breach-notification, data-protection-impact-assessment, and prior-
consultation obligations.

If PROOF receives a request relating to Customer Personal Data, it will direct
the requester to the Customer where reasonably possible and will not respond
on the Customer's behalf unless instructed or legally required.

The Customer will reimburse reasonable costs for exceptional assistance beyond
the standard Service unless caused by PROOF's breach.

## 7. Subprocessors

The Customer gives general written authorization for PROOF to use subprocessors
listed in the then-current subprocessor list. PROOF will:

- give at least 30 days' notice of a new subprocessor where reasonably
  practicable;
- impose written data-protection obligations providing materially equivalent
  protection to this DPA; and
- remain responsible for the subprocessor's performance of those obligations.

The Customer may object during the notice period on reasonable data-protection
grounds. The parties will work in good faith on a commercially reasonable
alternative. If none is available, either party may terminate only the affected
Service; fees and refunds remain governed by the Agreement.

## 8. International transfers

PROOF will not make a restricted transfer of Customer Personal Data for which
it is responsible without a lawful transfer mechanism. Where required, the
parties incorporate the UK International Data Transfer Addendum to the EU
Standard Contractual Clauses, populated so the Customer is exporter and PROOF
is importer, or another mechanism specified in the subprocessor list or Order
Form.

PROOF will provide information reasonably needed for the Customer's transfer
risk assessment and implement supplementary measures where required and
proportionate.

## 9. Acurast external execution

The Customer understands that it instructs Liskov to submit Applications for
execution by processors participating in the external decentralized Acurast
network. Processor identity, availability, and location can change, and some
network records are public and persistent.

The Customer must not place personal data in public-chain fields or unencrypted
public artifacts. Before deploying other personal data, the Customer must
assess the workload, minimize the data, choose suitable encryption and access
controls, and establish any required transfer or residency safeguards.

:::warning Legal classification required
Before this DPA becomes effective, counsel must confirm whether and when
Acurast processors are subprocessors, independent recipients, or otherwise
within the parties' processing arrangements, and must approve the applicable
international-transfer and transparency treatment. Contract wording cannot
replace that factual and legal analysis.
:::

## 10. Return and deletion

On termination of the affected Service and at the Customer's choice, PROOF will
delete or return Customer Personal Data, unless UK law requires retention. The
Customer must make its choice and complete available exports before account
access ends.

Data in backups may remain isolated and beyond ordinary use until the relevant
backup cycle deletes it. PROOF may retain audit, security, financial, legal,
and immutable chain records that are not Customer Personal Data or that it must
retain as controller. Data copied to public chains, IPFS, or third-party systems
outside PROOF's control may not be retractable.

## 11. Information and audits

PROOF will make available information reasonably necessary to demonstrate
compliance with this DPA. No more than once in any 12-month period, unless a
breach or regulator reasonably requires more, the Customer may request an
audit by an independent qualified auditor bound by confidentiality.

Audits must use available reports and remote review first, avoid access to
other customers' data or security-sensitive systems, occur on reasonable
notice during business hours, and not unreasonably disrupt the Service. The
Customer bears its costs unless an audit identifies a material breach by
PROOF.

## 12. Government requests

Where legally permitted, PROOF will notify the Customer of a binding request
for Customer Personal Data. PROOF will review the request for facial validity,
challenge an unlawful or disproportionate request where reasonably appropriate,
and disclose only what it is legally required to disclose.

## 13. Liability and precedence

Liability arising under this DPA is subject to the limitations in the Master
Terms unless an Order Form expressly provides a separate data-protection cap.
Nothing limits data-subject rights or regulatory powers under Data Protection
Law.

If this DPA conflicts with the Master Terms on processing Customer Personal
Data, this DPA prevails.

## Schedule 1 — processing details

| Item | Description |
| --- | --- |
| Subject matter | Provision, security, support, and operation of Liskov for Customer Applications. |
| Duration | The Agreement plus the return, deletion, backup, and legally required retention period. |
| Nature and purpose | Hosting, orchestration, storage, transmission, configuration, secret and log handling where enabled, support, security, and deletion. |
| Data subjects | Customer personnel, Customer end users, contractors, suppliers, and other people whose data the Customer lawfully submits. |
| Personal data | Identifiers, contact data, Application inputs and outputs, logs, support data, network metadata, and other data selected by the Customer. |
| Sensitive data | Not required by the standard Service. Customer must not submit it without satisfying section 2 and confirming suitability. |
| Frequency | Continuous or occasional, as initiated by the Customer's configuration and use. |
| Customer rights | The Customer controls instructions, access, configuration, export, correction, and deletion through supported features and requests. |

## Schedule 2 — draft security measures

PROOF's standard measures are intended to include:

- access control based on least privilege and role;
- authentication, credential protection, and administrative access review;
- encryption in transit and encryption at rest where supported and appropriate;
- envelope protection for managed secrets and separation of secret metadata;
- tenant and service isolation appropriate to the architecture;
- logging, monitoring, vulnerability and dependency management, and incident
  response;
- change control, code review, versioned deployment, and recovery procedures;
- confidentiality commitments and security awareness for authorized personnel;
- provider due diligence and written subprocessor obligations; and
- secure deletion or isolation at end of retention.

:::warning Security review required
Replace this intended-control list with the verified production controls,
including key management, backup, recovery, vulnerability, access-review,
incident, and provider evidence, before publication.
:::
