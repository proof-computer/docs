---
title: Liskov legal implementation copy — review draft
description: Counsel-ready working copy for business status, acceptance, workload, payment, Marketplace, and privacy flows.
draft: true
---

# Liskov implementation copy

:::caution[Not in force]
Review version 1.0, dated 3 September 2026. This copy is implementation guidance,
has no contractual effect, and is excluded from the production documentation
build. Product/Legal approved only the business-status wording and consumer
response in section 1 on 4 September 2026; all other linked URLs and factual
statements still require approval before use.
:::

**Version:** 1.0 — 3 September 2026

Use the wording below in the product journey, adapted only after Legal confirms the linked document URLs and factual statements.

## 1. Account creation — business status

> **Business use only**  
> I confirm that I am acting wholly or mainly for purposes relating to a trade, business, craft or profession, that I am at least 18, and that I have authority to create this Workspace and bind the organisation named above.

Required checkbox; not pre-ticked.

Field label:

> **Country where your business is established**

Store an assigned ISO 3166-1 alpha-2 country code. Record the statement as
`liskov.business-eligibility.v1`; do not collect date of birth or identity
documents for this declaration.

If a person cannot make the statement, refuse organisation creation and show:

> Liskov is currently available only for business use. Do not create an
> organisation for personal, family or household use. If you believe your use
> is business use and need help, contact hello@proof.computer.

There is no self-service or manual consumer exception.

## 2. Contract acceptance

> By creating the Workspace, I agree on behalf of **[Customer legal name]** to the **Order**, **Liskov Master Business Terms**, **Service Credits and Payments Policy**, **Acceptable Use Policy**, and, where applicable, the **Data Processing Addendum** and **Marketplace Terms**. I have had the opportunity to download or print them.

Required checkbox; direct links; show version/effective date and contracting entity adjacent to the button.

Button:

> **Create Workspace and accept**

Do not use “By continuing you agree” without an affirmative control.

## 3. Standard Service workload warning

Show before the first Launch, in CLI/API documentation and adjacent to payload/secret configuration:

> **Do not deploy Personal Data or secrets**  
> Standard Liskov workloads may run on independently operated nodes in unknown locations. Do not include Personal Data, confidential regulated data, private keys, seed phrases, passwords or unrestricted credentials. Assume code, inputs, outputs, metadata and traffic may be observable by a node unless your Enterprise Order expressly says otherwise. Encrypt appropriate data, use scoped/short-lived credentials and verify outputs.

Required acknowledgement on first Launch and after a material change:

> I confirm this workload contains no prohibited data and is suitable for decentralised execution.

## 4. Launch cost authorisation

> **Estimated cost: [amount]**  
> This is an estimate based on the displayed assumptions. Actual Network Costs may vary with execution, retries, protocol charges and final settlement. Your configured hard limit is **[amount]**. By launching, you authorise PROOF to consume Service Credits for the applicable Network Costs and Liskov Fees up to that limit, subject to the disclosed settlement tolerance of **[amount/percentage]**.

Button:

> **Authorise and launch**

If no hard cap is technically enforceable, do not call it a hard limit; use “alert threshold” and state that it does not stop spend.

## 5. Service Credit purchase

> You are buying non-transferable Liskov Service Credits for Services supplied by MOOSE LABS LTD trading as PROOF. Credits are not money, an investment or a transferable token; they do not earn interest and cannot be used to pay another user or Marketplace publisher. Amounts are not safeguarded or held on trust. Refunds are available only as stated in the Service Credits and Payments Policy.

Show exact Credits, price, tax, payment fee and any expiry before payment.

Checkbox:

> I have reviewed the Service Credits and Payments Policy and authorise this purchase for **[Customer]**.

## 6. USDC payment warning

> Send only **[exact token name and contract]** on **[network and chain ID]** to the address shown. Transfers using another token, contract, bridge or network may be permanently lost. Verify the address, network, amount and fee in your wallet. Credits are issued only after **[confirmation rule]** and compliance checks. PROOF does not take custody of your wallet or private keys.

Quote:

> Quote: **[USDC amount]** for **[Credit value]**, expires **[timestamp and timezone]**. Network fees are paid separately by you.

Button:

> **I have verified the payment details**

## 7. Auto top-up

> When your paid Credit balance falls below **[trigger]**, charge **[amount]** to **[payment method]**. Maximum **[number/amount]** per **[billing period]**. We will send a receipt after each top-up. You can disable future top-ups at any time; disabling does not reverse a payment already initiated or a non-cancellable Network cost already committed.

Checkbox or explicit toggle, off by default:

> **Enable auto top-up**

## 8. Marketplace publisher attestation

Before each first publication and material version:

> I confirm on behalf of **[Publisher]** that:
>
> - we have the rights needed to publish and license this Item;
> - the listing, licence, permissions, telemetry, external dependencies and charges are complete and accurate;
> - the Item does not intentionally contain malware, hidden mining, credential theft, backdoors or live secrets;
> - Standard Service execution does not require Personal Data;
> - we will maintain a monitored security contact and respond to material vulnerability and rights reports; and
> - the Item is free through Liskov and does not require an undisclosed payment for its listed core functionality.

Required checkbox; versioned evidence.

Button:

> **Submit for review**

Do not auto-publish at launch.

## 9. Marketplace user warning

> This Item is supplied by **[Publisher]** under **[Item Licence]**, not by PROOF. Review its source, permissions, dependencies, telemetry, external terms and security before use. Marketplace review or scanning is not a guarantee. Deploy first in an isolated environment, use least privilege, do not include Personal Data or secrets, and validate outputs. Liskov Network Costs may apply even though the Item is free.

Button:

> **Review and deploy**

## 10. Marketplace report acknowledgement

> Thank you. We have recorded report **[ID]** concerning **[Item/version]**. Please do not send illegal content, private keys or unnecessary Personal Data. We may contact you for evidence and may share relevant information with the Publisher or authorities where lawful. For an immediate threat to life, contact emergency services.

## 11. Suspension notice template

Subject: **Liskov access restricted — [Workspace/Item]**

> We have temporarily restricted **[scope]** from **[time/date]** because **[plain-language principal reason]**. The action was taken under **[contract/policy clause]** to address **[security/legal/payment/policy risk]**.
>
> **What you need to do:** [steps/evidence/remediation]  
> **Deadline:** [date/time]  
> **Effect on workloads/data/charges:** [explain]  
> **Appeal:** reply or use [URL] within 14 days, identifying why the decision is wrong and providing supporting evidence.
>
> We may withhold details where disclosure would undermine security, law enforcement, reporter safety or legal restrictions.

## 12. Material terms change notice

Subject: **Liskov legal terms update effective [date]**

> We are updating **[document]** on **[effective date]**. The material changes are: **[plain-language summary]**. The previous and new versions are available at **[links]**.
>
> The change affects you because **[impact]**. If it materially disadvantages your paid Service, you may terminate the affected self-service Order before the effective date through **[method]** and receive the refunds due under the Contract. Continued use after the effective date constitutes acceptance where the Contract permits.

## 13. Service discontinuation notice

Subject: **Liskov [Service] will be discontinued on [date]**

> We will discontinue **[Service/feature]** on **[date]** because **[reason]**. The affected functionality and migration options are **[details]**. You can export relevant hosted Customer Data until **[date]**. Where the Contract requires, we will refund prepaid Subscription Fees for the unused period and unused refundable Service Credits.

## 14. Account closure and data copy

> Closing the Workspace stops access and new Launches. Hosted Customer Data remains available for export for up to 30 days after termination and is deleted from active PROOF-controlled systems by day 60 and routine backups by day 90, subject to law/security. PROOF cannot delete public blockchain records, copies held by independent Networks or data in your own systems. Unused paid Service Credits are handled under the Credits Policy after verification and deductions.

Confirmation input:

> Type the Workspace name **[name]** to request closure.

## 15. Cookie banner

First layer:

> **Your privacy choices**  
> We use necessary storage to operate and secure Liskov. With your permission, we also use optional analytics and functionality to understand and improve the service. You can accept, reject or choose by purpose, and change your mind later.

Buttons of comparable prominence:

> **Accept all** | **Reject non-essential** | **Choose settings**

Persistent footer/control:

> **Privacy choices**

Do not deploy until “Reject non-essential” has been tested to stop all optional client-side and server-side events.

## 16. Support secret warning

Adjacent to support message/attachment field:

> Do not send private keys, seed phrases, passwords, unrestricted API keys, production Personal Data or illegal content. Redact sensitive values and provide a safe reproduction where possible.
