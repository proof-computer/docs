---
title: Liskov Master Terms — review draft
description: Draft business terms governing access to and use of Liskov.
draft: true
---

# Liskov Master Terms — review draft

:::caution Not in force
Version 0.1, dated 2 September 2026. This document is a legal-review draft and
has no contractual effect.
:::

These Master Terms govern access to and use of Liskov by business customers.

## 1. Parties and business use

These Terms are between **MOOSE LABS LTD**, company number 11435949, a private
limited company registered in England and Wales with its registered office at
The Old Bakery, Camden Road, Tunbridge Wells, England, TN1 2QP, trading as
**PROOF** ("PROOF", "we", "us" or "our"), and the business identified in the
applicable account or Order Form (the "Customer", "you" or "your").

Liskov is supplied only for business use. It is not offered to consumers. The
person accepting the Agreement represents that they:

- are at least 18 years old;
- act wholly or mainly for purposes relating to a trade, business, craft, or
  profession; and
- have authority to bind the Customer.

If these statements are not true, that person must not accept the Agreement or
use the Service.

## 2. The Agreement

The "Agreement" consists of these Terms, the documents linked below, each
applicable Order Form, and any schedule expressly accepted by both parties:

- the [Acceptable Use Policy](./acceptable-use-policy.md);
- the [Billing, Service Credit, and Refund Policy](./billing-refund-policy.md);
- the [Service Description and Availability Policy](./service-availability.md);
- the [Privacy Notice](./privacy-notice.md); and
- where applicable, the [Data Processing Addendum](./data-processing-addendum.md),
  [Self-Custody Signer Schedule](./self-custody-schedule.md), and Marketplace
  terms.

If documents conflict, the following order applies: an Order Form; the Data
Processing Addendum for personal-data matters; a product schedule for its
specific subject; these Terms; then the remaining policies. A later expressly
agreed document prevails over an earlier one on the same subject.

## 3. Accounts and Organizations

The Customer must provide accurate account, billing, tax, and Organization
information and keep it current. The Customer is responsible for:

- choosing Organization administrators and authorized users;
- actions taken through its accounts, credentials, API tokens, repositories,
  integrations, and self-custody signer;
- maintaining appropriate access controls and promptly removing access that is
  no longer required;
- protecting credentials and using available multi-factor authentication; and
- notifying us promptly at support@proof.computer of suspected compromise.

An Organization administrator may bind the Organization through configuration,
spend, publication, deployment, access, and lifecycle actions within the
permissions we expose. The Customer must resolve disputes with its users and
may not rely on PROOF to determine internal authority.

## 4. The Service

Liskov is a control plane that helps Customers build, configure, publish,
deploy, observe, update, and retire Applications executed through the external
Acurast network. Features, limits, support boundaries, and availability are
described in the Service Description, documentation, applicable plan, and
Order Form.

We will provide Liskov with reasonable care and skill. Unless an Order Form
expressly says otherwise, the Service is supplied on a best-effort basis and
without a contractual service-level guarantee or downtime-credit commitment.

We may impose documented technical, security, spend, storage, retention, rate,
and usage limits. Preview, beta, evaluation, free, and experimental features
may be changed, suspended, or withdrawn at any time and may have additional
terms.

## 5. Managed custody

Managed custody is Liskov's default chain-settlement model. In that model:

- the Customer buys and spends USD Service Credits for Liskov services;
- PROOF operates service-side signing authority and uses its own treasury ACU
  to register, fund, settle, and retire Acurast jobs within approved policies
  and spend controls;
- PROOF-operated Acurast accounts are service accounts, not Customer wallets;
- the Customer acquires no ownership, custody, redemption, or withdrawal right
  in ACU held, moved, committed, reclaimed, or spent by PROOF; and
- chain-level receipts and recoveries are treasury facts. Customer billing is
  determined in USD Service Credits under the Billing Policy.

Managed custody does not mean that PROOF can cancel or rewrite an Acurast job
after the network owns its schedule. Pausing or retiring an Application stops
future Liskov planning but may not stop an existing job or its charges.

## 6. Self-custody

Self-custody applies only where we expressly enable it and the Customer accepts
the Self-Custody Signer Schedule. The Customer then holds and funds its own ACU
account and runs its own signer. PROOF does not receive or recover the private
key and does not silently fall back to managed custody.

The Customer remains responsible for Liskov subscription and service fees in
USD even where it pays Acurast network costs directly in ACU.

## 7. Customer Applications and responsibilities

The Customer is solely responsible for its Application, source, artifacts,
dependencies, configuration, data, outputs, external services, legal
compliance, and business results, except to the extent a failure was caused by
PROOF's breach of the Agreement.

The Customer must:

- have all rights and licences needed for Customer Content;
- assess whether Liskov and Acurast are suitable for its workload;
- test its Application and implement appropriate redundancy, retries,
  monitoring, backups, recovery, key management, and incident response;
- avoid including secrets in source, public artifacts, logs, or support
  bundles;
- comply with the Acceptable Use Policy and applicable law; and
- obtain all notices, permissions, lawful bases, and safeguards required for
  personal data or regulated data processed by its Application.

Liskov is not designed for a use where failure could reasonably cause death,
personal injury, material property or environmental harm, or failure of a
critical legal or safety obligation, unless an Order Form expressly approves
that use.

## 8. Customer Content and licence

"Customer Content" means source, artifacts, manifests, configuration, data,
logs, secrets, instructions, and other material submitted by or for the
Customer.

As between the parties, the Customer owns Customer Content. The Customer grants
PROOF and its service providers a worldwide, non-exclusive, limited licence to
host, copy, build, transmit, encrypt, decrypt where required to provide the
Service, execute, display, and otherwise process Customer Content only as
necessary to provide, secure, support, and comply with law in relation to the
Service.

The Customer understands that some supported artifact paths use IPFS or other
replicated content-addressed systems. Material published to such systems may be
cached or copied by third parties and may not be practically retractable. The
Customer must not publish confidential material through an unencrypted public
artifact path.

## 9. Personal data

Each party will comply with applicable data-protection law. The Privacy Notice
governs personal data for which PROOF acts as controller. The Data Processing
Addendum governs Customer Personal Data processed by PROOF as processor.

The Customer decides whether its Application processes personal data and is
responsible for doing so lawfully. Acurast processors are external network
participants, not hardware owned by PROOF. Their location and availability may
vary. The Customer must assess and implement any required data-minimisation,
encryption, transfer, residency, consent, notice, retention, and security
measures before sending personal data to an Application.

## 10. Confidentiality and security

Each party will protect the other party's non-public information using at least
reasonable care and use it only to perform or exercise rights under the
Agreement. Confidential information excludes information that is lawfully
public, already known without restriction, independently developed, or
lawfully received from another source.

A recipient may disclose confidential information where required by law, after
giving notice where legally permitted. The recipient will disclose no more than
reasonably required.

Security measures reduce risk but do not make any system invulnerable. TEE
attestation, encryption, signed evidence, and source provenance each support
specific technical claims; none is a guarantee that an Application is safe,
correct, confidential, continuously available, or free from vulnerabilities.

## 11. External services and the Acurast network

Acurast, Polkadot, processors, GitHub, IPFS, Stripe, Autumn, and Customer-chosen
providers are independently operated. Their services, terms, fees, and risks
may apply separately.

PROOF may hold ACU, operate infrastructure, participate in Acurast governance,
receive ecosystem benefits, and vote in its own interests. This does not give
PROOF unilateral control of Acurast or Polkadot, create an agency or fiduciary
relationship, or require PROOF to vote on Customer instructions.

The Customer accepts that decentralized infrastructure may experience
processor churn, limited capacity, variable performance or geography, forks,
reorganizations, delayed or failed finality, network or runtime upgrades,
governance changes, fee or token-price movement, RPC failure, TEE
vulnerabilities, and permanent cessation. PROOF cannot reverse a finalized
extrinsic, force a processor to accept or continue work, or recreate an
external network that has ceased to operate.

PROOF remains responsible for the parts of Liskov it controls, subject to the
Agreement, but is not responsible for an external service merely because
Liskov interoperates with it.

## 12. Fees, Service Credits, and taxes

The Customer will pay the fees, taxes, and charges stated in its plan, Order
Form, quote, or applicable pricing schedule. Fees may include recurring plan
fees, usage charges, and separately identified services.

USD Service Credits are non-transferable contractual credits usable only for
eligible Liskov services. They are not a bank account, deposit, stored-value
wallet, cryptoasset, investment, or claim to ACU or any other token. Purchased
Service Credits do not expire merely through passage of time. Refunds are not
automatic and are considered only in exceptional circumstances under the
Billing Policy.

The Customer authorizes our payment providers to collect amounts due. We may
suspend paid functionality for failed, disputed, reversed, or overdue payment.
The Customer may not set off amounts unless required by law.

## 13. Service and Agreement changes

We may change the Service to improve it, address security or legal issues,
adapt to external networks, or add, change, or withdraw features. We will use
reasonable efforts to give advance notice of a materially adverse change to a
generally available paid feature.

We will not retroactively change a settled charge or an already authorized
reserve. If a material change substantially reduces the paid Service, the
Customer may stop using the affected Service or terminate at the end of the
current billing period. Refunds remain governed by the Billing Policy.

We may update the Agreement. Material changes will be notified through the
Service or the Customer's account email and will take effect on the stated
date. Changes required urgently for law or security may take effect sooner.
Continued use after the effective date constitutes acceptance where permitted
by law; if we require affirmative acceptance, the Customer may not continue
until it accepts.

## 14. Suspension

We may limit or suspend access immediately where we reasonably believe this is
necessary to address:

- an actual or suspected breach of the Agreement;
- unlawful, sanctioned, fraudulent, abusive, or harmful activity;
- a security incident or risk to the Service, a processor, another customer,
  or a third party;
- non-payment, chargeback, or exceeded spend or resource limit;
- an instruction from a regulator, court, law-enforcement body, or external
  service provider; or
- an emergency affecting the Service or an external network.

Where reasonably possible, we will give notice, explain the basis, limit the
suspension to the affected scope, and provide an opportunity to remedy it.
Urgent action may occur first. The Customer may ask
support@proof.computer to review a suspension.

Suspension of Liskov does not necessarily stop an existing Acurast job, reverse
network spend, or prevent charges already committed. The Customer remains
liable for accrued amounts.

## 15. Term and termination

The Agreement begins when the Customer first accepts it or an Order Form and
continues until terminated. Subscription periods and renewal are stated in the
applicable plan or Order Form.

Either party may terminate for material breach if the breach is not remedied
within 30 days after written notice, unless it cannot be remedied. Either party
may terminate immediately if the other becomes insolvent or ceases business.
PROOF may terminate immediately for serious Acceptable Use, sanctions,
security, fraud, or payment violations.

The Customer may close an account or terminate a rolling subscription in the
supported account flow. PROOF may discontinue the Service on at least 30 days'
notice where reasonably practicable.

## 16. Effect of termination

On termination:

- the Customer's right to start new work ends;
- accrued fees, usage, network commitments, taxes, and payment obligations
  remain due;
- existing Acurast jobs may continue to their chain-owned scheduled end;
- retirement, settlement, evidence preservation, and financial review may
  continue;
- the Customer should export available Customer Content before access ends;
  and
- PROOF will return or delete Customer Personal Data as required by the Data
  Processing Addendum, subject to legal, security, backup, and financial-record
  retention.

Purchased Service Credits do not expire by time. Account closure does not turn
them into cash or create an automatic refund. Where the Customer remains
eligible to contract with us, an unused balance may be restored if the
Organization is reactivated. Exceptional refund requests are considered under
the Billing Policy.

Clauses which by their nature should survive termination do so, including
payment, intellectual property, confidentiality, disclaimers, liability,
indemnities, records, and general provisions.

## 17. Intellectual property and feedback

PROOF and its licensors own Liskov, its documentation, software, designs,
brands, and all related intellectual property, excluding Customer Content and
third-party open-source components. We grant the Customer a limited,
non-exclusive, non-transferable right to use the Service during the Agreement
for its internal business purposes.

If the Customer provides feedback, it grants PROOF a perpetual, worldwide,
irrevocable, royalty-free right to use it without restriction or attribution.
This does not transfer ownership of Customer Content.

## 18. Warranties and disclaimers

Except as expressly stated in the Agreement, and to the fullest extent
permitted by law, the Service is supplied without other conditions, warranties,
or representations, whether express, implied, statutory, or otherwise. We do
not warrant that the Service, an Application, a processor, or an external
network will be uninterrupted, error-free, secure, compatible, profitable,
fit for a particular purpose, or produce any particular result.

Nothing in this clause limits the express promise to use reasonable care and
skill or any liability that cannot lawfully be excluded.

## 19. Liability

Nothing in the Agreement excludes or limits either party's liability for:

- death or personal injury caused by negligence;
- fraud or fraudulent misrepresentation;
- wilful misconduct; or
- any liability that cannot lawfully be excluded or limited.

Subject to that, neither party is liable for indirect or consequential loss, or
for loss of profit, revenue, anticipated savings, business, opportunity,
goodwill, reputation, data, code, token value, or digital assets, arising from
the Agreement, even if foreseeable. This does not relieve the Customer of its
obligation to pay amounts properly due.

Subject to the unlimited matters above, each party's aggregate liability
arising out of or in connection with the Agreement will not exceed the fees
paid or payable by the Customer for the Service during the 12 months immediately
before the first event giving rise to the claim.

:::warning Legal review required
The cap, excluded-loss language, any separate data/confidentiality cap, and
insurance alignment must be approved by counsel before publication.
:::

## 20. Indemnity

The Customer will indemnify PROOF against third-party claims, damages, and
reasonable costs arising from Customer Content, the Customer's Application,
the Customer's breach of the Acceptable Use Policy, or an allegation that the
Customer lacked a required right, consent, lawful basis, or licence, except to
the extent caused by PROOF's breach of the Agreement.

PROOF must notify the Customer promptly, allow the Customer to control the
defence and settlement, and provide reasonable cooperation at the Customer's
cost. The Customer may not settle in a way that admits fault by or imposes a
non-monetary obligation on PROOF without consent.

:::warning Legal review required
Counsel must approve the scope, procedure, and any reciprocal PROOF IP
indemnity before publication.
:::

## 21. Sanctions, export, and anti-bribery

Each party will comply with applicable sanctions, export-control,
anti-bribery, and anti-corruption law. The Customer represents that neither it
nor its controlling persons are prohibited from receiving the Service and that
it will not make the Service available for a prohibited territory, person, end
user, or end use.

We may screen customers and transactions and may refuse, suspend, report, or
block activity where reasonably required for compliance.

## 22. Notices

Operational notices may be given through the Service or to the account email.
Legal notices to PROOF must be sent to support@proof.computer with the subject
"Legal notice" and by post to the registered office stated above. Notices to
the Customer may be sent to its account or Order Form contact. Email notice is
received on the next business day after sending unless the sender receives a
delivery failure.

## 23. General

Neither party may assign the Agreement without the other's consent, not to be
unreasonably withheld, except that PROOF may assign it as part of a merger,
reorganization, financing, or sale of all or substantially all of the relevant
business.

Neither party is liable for delay or failure caused by circumstances beyond its
reasonable control, but payment obligations already due are not excused. The
affected party will use reasonable efforts to reduce the effect and resume
performance.

The Agreement is the entire agreement about its subject and replaces prior
statements on that subject. Neither party relies on a statement not set out in
the Agreement, without limiting liability for fraud. A failure to enforce a
right is not a waiver. If a provision is unenforceable, it will be adjusted to
the minimum extent necessary and the remainder continues.

The parties are independent contractors. The Agreement creates no partnership,
agency, employment, fiduciary, trustee, or beneficiary relationship. A person
who is not a party has no right under the Contracts (Rights of Third Parties)
Act 1999 to enforce it.

## 24. Governing law and courts

The Agreement and any non-contractual obligations arising from it are governed
by the law of England and Wales. The courts of England and Wales have exclusive
jurisdiction.

## 25. Contact

Questions about these Terms should be sent to
[support@proof.computer](mailto:support@proof.computer).
