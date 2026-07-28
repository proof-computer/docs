---
title: Spend limits
description: Bound per-job and per-generation authority without confusing caps, quotes, reserves, and final charges.
---

# Spend limits

Manifest spend fields limit what Liskov may authorize. They are safety caps,
not predicted or guaranteed prices.

```json
{
  "deployment": {
    "spend": {
      "maxRewardPlanckPerJob": "250000000000",
      "maxNativeFeePlanckPerJob": "1000000000",
      "maxServiceCreditMicrosPerGeneration": 5000000
    }
  }
}
```

The two planck fields are unsigned base-10 strings so JavaScript cannot lose
integer precision. They bound internal Acurast reward and network-fee
authority. `maxServiceCreditMicrosPerGeneration` bounds the customer-facing
charge authority: 1,000,000 micros is USD 1.00 in Service Credits.

Most customers should start from the Console's supported defaults and adjust
only with a measured reason. Too-low caps block launch rather than silently
exceeding them.

## Four different amounts

| Amount | Meaning |
| --- | --- |
| Cap | Maximum authority you authored. It is not taken immediately. |
| Quote | Current estimate based on the proposed work and market facts. |
| Reserve | Temporary hold against available Service Credits for bounded possible usage. |
| Final charge | Settled usage after execution evidence is known; unused reserve is released. |

Liskov's treasury pays Acurast in network assets. Your organization sees only
USD Service Credits; it does not acquire an ACU or USDC wallet.

## Verify before launch

Review policy caps, quote, reserve, available credit, duration, renewal, and
parallelism together. After settlement, compare the final charge and released
reserve in billing transactions. A reserve is not evidence that a processor
was assigned or that the runtime became ready.

See [Quotes, reserves, and final charges](../organizations/charges.md) for the
billing lifecycle and
[Billing, settlement, and retirement](../troubleshooting/billing-retirement.md)
when a charge remains under review.
