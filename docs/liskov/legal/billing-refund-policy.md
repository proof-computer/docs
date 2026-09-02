---
title: Liskov Billing, Service Credit, and Refund Policy — review draft
description: Draft rules for subscriptions, USD Service Credits, reserves, settlement, taxes, disputes, and exceptional refunds.
draft: true
---

# Liskov Billing, Service Credit, and Refund Policy — review draft

:::caution Not in force
Version 0.1, dated 2 September 2026. Customer funding remains release-gated.
This policy is a legal-review draft and has no contractual effect.
:::

This policy forms part of the Liskov Master Terms.

## 1. Business billing

Liskov is a B2B service. Prices, billing periods, allowances, usage charges,
and plan limits are shown in the applicable plan, quote, or Order Form. Unless
stated otherwise:

- recurring fees are charged in advance;
- usage and other variable charges may be charged in arrears or settled from
  USD Service Credits;
- amounts are exclusive of VAT and other applicable taxes; and
- the Customer is responsible for taxes other than taxes on PROOF's net income.

Where the Customer must withhold tax, it must provide required documentation
and, except where prohibited, pay any additional amount needed for PROOF to
receive the invoiced amount.

Stripe processes payments, invoices, refunds, and disputes. Autumn may
orchestrate plan and subscription state. The Liskov ledger remains authoritative
for Service Credits, reserves, usage, and final charges.

## 2. USD Service Credits

USD Service Credits are a non-transferable contractual credit usable only for
eligible Liskov services. They:

- are denominated in USD for accounting and pricing;
- are not cash, a deposit, a bank or payment account, e-money, a stablecoin,
  a cryptoasset, or an investment;
- do not earn interest and are not held on trust or safeguarded as customer
  money;
- cannot be transferred between customers or Organizations unless PROOF
  expressly corrects an administrative error; and
- do not give the Customer title to ACU, USDC, DOT, or another asset.

**Purchased Service Credits do not expire through passage of time.** They
remain subject to the Agreement, Organization eligibility, suspension,
termination, legal requirements, and the supported uses available when the
Customer seeks to spend them.

Promotional, trial, or goodwill credit is separate from purchased credit. It
has no cash value, is not refundable, may carry campaign-specific conditions
or an expiry disclosed when granted, and may be withdrawn for abuse or error.

:::warning Legal review required
The characterization of Service Credits, non-safeguarding language, and
no-expiry treatment require the formal UK prepaid-balance and e-money perimeter
review before customer funding is enabled.
:::

## 3. Funding

The launch funding rail is Stripe USD only. The Customer does not deposit ACU
or USDC into Liskov and Liskov does not create a Customer crypto balance or
wallet.

A credit is issued only after the payment provider confirms a successful
payment and Liskov reconciles the event. A checkout page, pending card
authorization, invoice, or payment-provider message is not itself a Service
Credit.

We may delay or refuse crediting while checking fraud, sanctions, payment
status, identity, tax, duplicate events, or inconsistent records.

## 4. Quotes, reserves, and final charges

Before spend-bearing managed work, Liskov may present a quote and place a
bounded reserve against available Service Credits. A reserve is a temporary
hold, not a final charge and not a guarantee that work will start or succeed.

The final charge is determined from the applicable pricing policy and available
execution and settlement evidence, up to the authorized reserve. Unused reserve
is released to the available balance. If required evidence is missing,
unreadable, or contradictory, the reserve may remain under review until the
amount can be determined safely.

An Application failure may still consume third-party compute and result in a
charge. A network refusal before spend or a managed outcome that the published
billing rules classify as not billable results in the corresponding release.

PROOF's ACU purchases, sales, transfers, fees, gross network refunds, and
treasury gains or losses are not Customer balances. A managed Customer is
charged and credited only in USD Service Credits.

## 5. Self-custody charges

Under an accepted Self-Custody Signer Schedule, the Customer holds its own ACU
and pays Acurast directly through its signer. Network ACU movement is governed
by Acurast and does not become a Liskov Service Credit refund or reversal.

The Customer must still pay Liskov plan and service fees in USD or USD Service
Credits as shown in its Order Form or pricing schedule.

## 6. Subscription renewal and cancellation

The Customer may cancel a rolling subscription using the supported billing
portal or by contacting support. Cancellation takes effect at the end of the
current paid billing period unless the plan or Order Form states otherwise.

Recurring fees already charged are not automatically prorated or refunded.
Usage, network commitments, taxes, and other accrued amounts remain payable.
Cancellation does not force-stop existing Acurast jobs.

We will give reasonable advance notice of a price increase for a recurring
subscription. The new price applies from the next renewal after the notice
period. A changed usage price applies only to work authorized after its stated
effective time, not to an already settled charge or existing reserve.

## 7. Refunds

Payments and purchased Service Credits are generally non-refundable. **We may
approve a refund in exceptional circumstances, case by case, in our reasonable
discretion and subject to applicable law.** To request review, email
[support@proof.computer](mailto:support@proof.computer) with:

- the Organization and billing-contact details;
- the payment, invoice, or transaction reference;
- the amount requested;
- the reason and relevant non-secret evidence; and
- confirmation of the original payment method.

A request does not create a right to a refund. When considering it, we may take
into account unused purchased credit, consumed services, committed or
non-recoverable third-party costs, plan fees, taxes, payment-provider fees,
fraud and sanctions controls, chargebacks, prior adjustments, and the reason
for the request.

An approved refund:

- is calculated from eligible unused purchased USD Service Credit value, not a
  token quantity or current token value;
- is made to the original payment method where reasonably possible;
- may require identity, authority, and payment verification;
- will reverse or reduce the corresponding Service Credit so there is no double
  recovery; and
- is never an ACU withdrawal, redemption, or token-for-token refund.

Promotional credit is never refundable. Missing the availability target does
not automatically create a refund or service credit unless an Order Form says
otherwise.

## 8. Chargebacks, disputes, and failed payments

The Customer should contact support before initiating a payment dispute so we
can investigate. A chargeback, reversal, refund, or failed payment may cause us
to reverse related credits, place an equivalent hold, restrict spend, suspend
the Organization, or recover a resulting negative balance.

The Customer remains liable for valid charges, reasonable provider fees caused
by an unjustified dispute, and services consumed before reversal, to the extent
permitted by law.

Report a billing discrepancy promptly and preferably within 30 days after the
relevant statement. Delay may make investigation harder but does not waive a
right that cannot lawfully be waived.

## 9. Records

The Liskov ledger records purchased and promotional credits, reserves,
releases, final charges, refunds, and corrections. Original records are not
silently rewritten; corrections are linked entries.

The Customer is responsible for downloading invoices and keeping records
needed for its accounting, tax, and compliance obligations.

## 10. Account closure

Purchased Service Credits do not expire merely because time passes. Account
closure does not convert them to cash or create an automatic refund. Subject to
eligibility and retained records, unused purchased credits may be restored if
the same Organization reactivates. The Customer may request exceptional refund
review under section 7.

We may retain financial and audit records after closure as required for tax,
accounting, fraud prevention, dispute, and legal obligations.
