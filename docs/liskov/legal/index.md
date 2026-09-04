---
title: Liskov legal review — 3 September 2026
description: Counsel-ready working drafts, launch blockers, and the recommended legal model for Liskov.
draft: true
---

# Liskov legal review — read me first

:::caution[Not in force]
Review version 1.0, dated 3 September 2026. This suite is review material, has
no contractual effect, and is excluded from the production documentation build.
Its publication blockers remain open.
:::

**Review date:** 3 September 2026  
**Product:** Liskov  
**Proposed contracting entity:** Moose Labs Ltd trading as PROOF.COMPUTER ("PROOF")  
**Status:** counsel-ready working draft; not approved for publication until the launch gates below are signed off.

## What this bundle does

This bundle replaces the uploaded legal drafts with a coherent UK business-to-business launch suite. It deliberately separates:

1. the hosted Liskov control-plane and support services supplied by PROOF;
2. compute and other infrastructure supplied through independently operated decentralised networks and node operators; and
3. blockchain, wallet and cryptoasset transactions authorised or controlled by the customer.

That separation is substantive. Calling a balance “credits”, the service “non-custodial”, or a catalogue a “marketplace” does not determine its legal treatment. The operating model must match the contract.

## Recommended launch model

Launch on the following basis unless UK counsel approves a broader model:

- customers act wholly or mainly for business purposes;
- the public Marketplace contains only free listings and does not collect buyer money, pay publishers, or facilitate side payments;
- standard decentralised workloads must not contain Personal Data, special-category data, criminal-offence data, payment-card data, regulated health data, authentication secrets, or other data requiring a known processing location or conventional processor chain;
- paid Service Credits are non-transferable contractual prepayments usable only for services supplied by PROOF;
- PROOF purchases any network tokens or network capacity as principal and does not hold tokens or fiat money on trust for customers;
- customer wallets remain customer-controlled and PROOF does not take possession of private keys;
- no service level, data-residency promise, confidential-compute promise, certification, recovery objective or security control is advertised unless it has been operationally verified;
- no paid Marketplace, seller payout, staking, yield, exchange, brokerage, token transfer, or custody feature is enabled under this suite.

## Publication blockers

Do not publish or enable click-acceptance until all items marked **BLOCKER** in `01-LEGAL-REVIEW-MEMORANDUM.md` and `12-LAUNCH-SIGN-OFF-MATRIX.md` are resolved. At minimum:

- insert and verify PROOF’s company number, registered office, legal/privacy/support email addresses and VAT treatment;
- confirm every data flow, subprocessor, hosting country, retention period and international-transfer mechanism;
- technically enforce the Standard Service restriction on Personal Data in decentralised workloads, rather than relying only on contract wording;
- confirm the actual money, USDC, token and network-cost flow with regulatory and tax advisers;
- adopt sanctions screening and rejected/refunded wallet procedures;
- complete an Online Safety Act service-scope assessment before enabling publisher listings, reviews, comments, messaging or search over user-submitted content;
- complete a cookie/storage inventory and deploy a consent mechanism before non-essential storage or analytics runs;
- verify the security measures in the DPA and remove anything that is aspirational;
- agree liability caps against current insurance cover and enterprise sales expectations;
- preserve affirmative clickwrap evidence: displayed documents, version, timestamp, user, workspace, IP/device evidence where lawful, and the exact accepted Order.

## Documents in the clean suite

- Master Business Terms
- Service Credits and Payments Policy
- Acceptable Use Policy
- Privacy Notice
- Data Processing Addendum
- Cookie and Similar Technologies Notice
- Free Marketplace Publisher and User Terms
- Marketplace Notice-and-Action Policy
- Subprocessor and International Transfer Schedule template
- Legal Review Memorandum
- Change Log
- Launch Sign-off Matrix

## Precedence

For a customer contract, use this order of precedence unless an Order says otherwise:

1. signed or click-accepted Order;
2. Data Processing Addendum, but only for data-protection matters;
3. any expressly incorporated Service Level Agreement or Security Schedule;
4. Master Business Terms;
5. Service Credits and Payments Policy;
6. product policies, including the Acceptable Use Policy and Marketplace terms.

## Important limitation

The wording reduces avoidable risk but cannot cure an operating model that contradicts it. In particular, a clause cannot make unknown node operators a compliant processor chain, convert a transferable balance into an unregulated product, or remove statutory platform-safety duties. Independent UK regulatory, data-protection and tax review remains necessary before launch and whenever the product model changes.
