---
title: Liskov Privacy Notice
description: How PROOF uses personal data about the people who use Liskov, our websites and our support channels.
---

# Liskov Privacy Notice

**Version 1.1 — effective 8 September 2026**

This Privacy Notice explains how MOOSE LABS LTD trading as PROOF (**PROOF**, **we**, **us**) uses Personal Data in connection with Liskov, our websites, accounts, support, billing, security, Marketplace and business communications.

It applies where we decide why and how Personal Data is used and therefore act as Controller. Where we process Personal Data only on a business customer’s instructions inside the hosted parts of Liskov, the customer is the Controller and our Data Processing Addendum applies. Data that a customer processes in a Distributed Workload on the Acurast network never reaches our systems: the customer is its Controller, and this Notice does not cover it.

## 1. Who we are

**Controller:** MOOSE LABS LTD trading as **PROOF**<br />
**Company number:** 11435949<br />
**VAT registration:** GB311456142<br />
**Registered office and postal address:** The Old Bakery, Camden Road, Tunbridge Wells, England, TN1 2QP<br />
**Privacy contact and data protection officer:** privacy@proof.computer<br />
**Legal and e-commerce contact:** hello@proof.computer

MOOSE LABS LTD is registered with the UK Information Commissioner’s Office as a data controller. We have appointed a data protection officer, who can be reached at privacy@proof.computer. We are established in the United Kingdom and have not appointed a representative elsewhere.

## 2. Liskov, the Acurast network and public chains

Liskov orchestrates workloads that run on independently operated Acurast processors. Those processors are not our systems. We do not receive, store or inspect the code, inputs, outputs, logs or secrets of a running workload, and we send the processors no data about you or your organisation. If you choose to process Personal Data in an Application, you are its Controller and are responsible for doing so lawfully; the Master Business Terms (clause 7) explain what may not be placed in a workload.

The job records we write to the Acurast chain and to IPFS identify the job, the artifact and PROOF’s own service accounts. They contain no name, email address or other identifier of you or your organisation. A public blockchain record is permanent and globally replicated; we cannot erase or change it once written.

## 3. Personal Data we collect

### 3.1 Sign-in and account data

You sign in with GitHub or with a sign-in link sent to your email address. We record your GitHub account identifier and login, the display name and email address GitHub provides or you enter, when you signed in, and the session identifier. We create a personal Workspace for you automatically when you first sign in.

### 3.2 Organisation and acceptance data

When you create an organisation Workspace we record its name, the country in which the business is established, your declaration that you are acting for business purposes, are at least 18 and are authorised to bind the organisation, and your acceptance of the Master Business Terms: the organisation, the accepting person, the version accepted, the time, the surface (console or API), the IP address and the browser identification string at acceptance. We record the same facts for team members you invite, together with the GitHub login or email address you invite them with.

### 3.3 Billing and tax data

Payments are taken by Stripe on a page Stripe hosts. Stripe collects your name, billing address, VAT number where you supply one, and payment method; we never receive full card details. We retain the Stripe customer and invoice references, the billing address and VAT number used for tax, the subtotal, tax and total of each purchase, plan and subscription state, and the Service Credit ledger (purchases, reservations, consumption, adjustments and refunds). Our subscription orchestration provider, Autumn, receives your organisation’s identifier and name and its plan state.

### 3.4 Application and service data

We hold the applications, manifests, policies and configuration you create; the secrets you seal, which are encrypted so that only the runtime that receives them can read them; the artifacts you upload for deployment; managed logs from your applications, if you enable them; deployment, launch and job records; and reservation and settlement records that price your usage.

### 3.5 Support and communications

Messages you send to our mailboxes are handled in our support tool, Plain. We send invitations, sign-in links and billing, security and service notices by email through Resend. If you connect a Telegram chat for notifications, we hold the chat identifier you give us.

### 3.6 Technical and security data

Our servers record the IP address, browser identification string, requested URL, time and response code of requests to the console and API, and security events such as sign-ins, invitations, role changes and refused requests. Our error-monitoring service receives technical error reports that are configured to exclude request content, headers and personal identifiers. The console sets no cookies; see the Cookie Notice for the browser storage it uses.

### 3.7 Marketplace data

When you launch a Marketplace Item we record the launch in your Workspace as we do for any application. At the date of this Notice all Items are published by PROOF; there are no publisher profiles, reviews, ratings, comments or messages.

### 3.8 Product analytics

We use OpenPanel to understand how people use the authenticated Liskov console and command-line tool and whether the service is useful to business customers. We send an opaque account identifier, an opaque organisation identifier, the plan, seat count and organisation type, and a closed event name. Depending on the event, this may include a safe console page or control identifier, a command identifier and CLI version, success or failure, a billing lifecycle change, or pre-tax revenue and currency. We do not send names, email addresses, application or repository names, secrets, free text, command arguments, full URLs, URL queries or fragments, or page contents. Session replay and OpenPanel AI features are disabled.

OpenPanel receives the IP address and browser identification string with the request. It uses them to derive approximate location and a salted daily device identifier; it discards the raw IP address rather than storing it as an event property. The console stores its OpenPanel profile, group, device and session state only in memory while the page is open. It sets no analytics cookie and writes no analytics value to local storage, session storage or IndexedDB. Analytics is enabled by default for this business service. A CLI invocation can be excluded with `--no-analytics`, and you may object to this processing by contacting privacy@proof.computer.

### 3.9 Website data

proof.computer uses Google Analytics only with your consent, as described in the Cookie Notice. docs.proof.computer uses no analytics.

### 3.10 Sensitive data

We do not intentionally collect Special Category Data or criminal-offence data. Please do not include it in support messages or free-text fields. We may process limited information about suspected fraud or sanctions exposure where necessary to investigate it, with an appropriate legal condition.

## 4. Where Personal Data comes from

Directly from you; from an administrator who creates or manages your account or invites you; automatically from your use of the services; from GitHub when you sign in or connect a repository; from Stripe about the status of a payment; and from public sources such as company registers where we verify a business.

If you provide Personal Data about another person, such as a team member you invite, you must be authorised to do so.

## 5. Purposes and lawful bases

| Purpose | Personal Data | Lawful basis |
|---|---|---|
| Create and administer accounts, Workspaces and team membership | sign-in, organisation, acceptance | performance of a contract; legitimate interests in supplying business services |
| Supply, operate and support Liskov | account, application, service, support, technical | contract; legitimate interests in service delivery and reliability |
| Take payments, issue invoices and credit notes, and keep the Service Credit ledger | billing and tax | contract; legal obligation for tax and accounting |
| Keep the services and our customers secure, and prevent fraud and abuse | technical, security, account | legitimate interests in protecting customers, PROOF and others; legal obligation where applicable |
| Comply with sanctions, law-enforcement and regulatory requests | account, billing, communications | legal obligation; legitimate interests |
| Send service, security and legal notices | contact, account | contract; legal obligation |
| Send business marketing | contact, organisation | legitimate interests in business marketing, subject to your right to object; consent where the law requires it |
| Understand how proof.computer is used | analytics identifiers | consent |
| Understand use of the authenticated Liskov console and CLI, improve the service, and measure business performance | opaque account and organisation identifiers, product events, technical data, billing lifecycle and revenue | legitimate interests in improving and measuring a business service, subject to your right to object |
| Establish, exercise or defend legal claims, and corporate governance | relevant records | legitimate interests; legal obligation |

Where we rely on legitimate interests, we have assessed the purpose, its necessity and the effect on you. You can ask us about an assessment.

## 6. Automated decisions

We use rules to flag unusual sign-ins, payment failures and suspected abuse. A flag may hold a payment, isolate a workload or send a case for review by a person. We do not make decisions based solely on automated processing that have legal or similarly significant effects on you. Stripe applies its own fraud checks to payments under its own privacy notice.

## 7. Who receives Personal Data

- your organisation’s administrators and team members;
- the providers that host and operate Liskov and handle email, support, error monitoring and networking, each listed with its location and transfer basis in the Subprocessor and International Transfer Schedule;
- Stripe, which processes payments and tax as an independent controller for its own purposes;
- GitHub, which you use to sign in and whose repositories you may connect;
- OpenPanel, for product analytics on the authenticated Liskov console and CLI;
- Google, for analytics on proof.computer with your consent;
- Telegram, if you configure notifications to a chat you control;
- professional advisers, auditors and insurers;
- a buyer, investor or successor in a genuine corporate transaction, under confidentiality; and
- courts, regulators and law-enforcement bodies where required or lawfully necessary.

We do not sell Personal Data. We do not share customer source code, secrets or application data for advertising, and we do not use them to train models.

## 8. Acurast processors and public data

Acurast processors execute workloads that customers direct to them. We do not send them Personal Data, and we treat them as independent network participants rather than as our processors. We look up the approximate location of a processor from its network address, using a geolocation provider, to place workloads and monitor the network. Chain and IPFS records for jobs are public and permanent; they identify jobs and PROOF’s service accounts, not people.

## 9. International transfers

Liskov’s database, secrets and logs are stored in the United Kingdom (London). Some providers process data in the United States, Canada or the European Union. For each restricted transfer we rely on a lawful mechanism: the UK Extension to the EU-US Data Privacy Framework where the provider is certified, the UK Addendum to the EU Standard Contractual Clauses or the UK International Data Transfer Agreement in the provider’s data-processing terms, or UK adequacy regulations (for Canada). The Subprocessor and International Transfer Schedule names the mechanism for each provider. Contact us for more information about a safeguard.

Distributed Workloads are not a data-residency service. The location of an Acurast processor is not guaranteed; if you process Personal Data in a workload, you are the exporter for any transfer that results.

## 10. How long we keep Personal Data

| Data | Retention |
|---|---|
| Sign-in sessions | The session expires 24 hours after sign-in; a sign-in link is valid for 15 minutes and a command-line sign-in request for 10 minutes |
| Invitations | 14 days if not accepted; the acceptance record is kept with the organisation |
| Account and organisation data | While the account is active, then as below for a closed account |
| Terms acceptance and business-eligibility records | For the life of the organisation and six years after it closes |
| Billing, invoice, tax and Service Credit ledger records | Six years after the end of the financial year they relate to |
| Applications, configuration, secrets and artifacts | While the application exists; a deleted application is tombstoned and its secrets and artifacts are removed |
| Managed application logs | For the retention period of the log sink you configure, within your plan’s allowance (24 hours by default), then pruned automatically |
| Request logs and security events | 12 months |
| Error reports | 90 days |
| Liskov product analytics | While PROOF’s OpenPanel account remains active; OpenPanel deletes the data within 30 days after the account is terminated |
| Support conversations | Three years after the conversation closes |
| Marketplace launch and moderation records | Six years after the matter closes |
| Cookie consent | In your browser only, for 12 months |
| Closed account | Export available for 30 days after closure; deleted from active systems within 60 days; backups overwritten within 90 days |
| Chain and IPFS records | Permanent; controlled by the public network |

We may keep a limited record for longer to establish, exercise or defend a legal claim, to comply with a sanctions or preservation requirement, or to prevent repeat abuse. Such records are access-restricted.

## 11. Security

Our systems run in London on Fly.io with encryption in transit and at rest. Access to production is limited to named PROOF personnel using hardware-backed multi-factor authentication, on a least-privilege basis that we review. Production and development environments are separate, and production Personal Data is not used in development or testing. Changes are peer-reviewed; our build pipeline runs dependency, vulnerability, secret, licence and provenance checks and produces a software bill of materials. Secrets you seal are encrypted so that only the receiving runtime can read them. The measures are summarised, not warranted, here; the Data Processing Addendum sets out the binding measures for customer data.

No system is completely secure. Report a suspected security issue to security@proof.computer, and never send a private key or seed phrase.

## 12. Your rights

You have rights, subject to conditions, to be informed, to access your Personal Data, to have it corrected or erased, to restrict or object to processing, to receive certain data in a portable format, to withdraw consent, and to obtain safeguards in relation to automated decisions. To exercise a right, email **privacy@proof.computer**. We may ask you to verify your identity and, where we hold data only as a customer’s Processor, we may refer your request to that customer. We cannot erase a record held on a public blockchain.

## 13. Complaints

Complain to us at privacy@proof.computer; we will acknowledge a complaint without undue delay and tell you the outcome or how to escalate it. You may also complain to the UK Information Commissioner’s Office at [ico.org.uk/make-a-complaint](https://ico.org.uk/make-a-complaint/) or to your local supervisory authority.

## 14. Marketing

You can opt out of marketing using the unsubscribe link or by contacting us. We will still send essential service, billing, security and legal messages while you have an account. We keep a minimal suppression record so we do not contact you again by mistake.

## 15. Cookies and browser storage

See the [Cookie and Similar Technologies Notice](./cookie-notice).

## 16. Children

Liskov is a business service and is not directed to people under 18. Contact us if you believe a child’s data has been provided to us.

## 17. Third-party services

GitHub, Stripe, Telegram and any repository, wallet or network you connect are governed by their own privacy notices. A link or integration is not an endorsement.

## 18. Changes

We update this Notice when our processing or the law changes, and publish the new version and date. We will tell Workspace administrators about a material change.

## 19. Contact

Privacy questions and rights requests: **privacy@proof.computer**  
Security reports: **security@proof.computer**  
Postal address: **The Old Bakery, Camden Road, Tunbridge Wells, England, TN1 2QP**

---

MOOSE LABS LTD trading as PROOF · Version 1.1 · effective 8 September 2026 · previous versions are archived by PROOF and available on request from legal@proof.computer.
