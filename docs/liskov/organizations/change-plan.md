---
unlisted: true
title: Change your organization's plan
description: Choose a plan and billing interval in the Console, check the quoted charges and effective date, and confirm the change.
---

# Change your organization's plan

:::danger[Not released]

Console plan changes are release-gated. The steps below describe the planned
customer flow. Check [Capabilities and limits](../reference/capabilities.md) for
current availability.

:::

## Choose a plan and billing interval

Sign in to the Console as an organization owner or admin and select the
organization you want to change. Open **Account** and choose **Change plan**.
Select **Monthly** or **Annual**, then choose an available plan. Use this same
page to change only the billing interval of a paid plan that offers both.

Choosing a different plan or a different supported interval requests a quote.
You can leave the page before confirming without changing the subscription or
authorizing a charge.

## Check the quote

In **Review this change**, check the target plan and interval, when the change
takes effect, the charge due today, the next renewal amount and date, and how
any payment will be collected. Check which discounts and allowances change.
Use the provider amounts and effective dates shown in the server quote.

A zero charge is a quoted amount. If tax, a renewal amount, or a renewal date
is unavailable, treat it as unknown.

## Confirm and check the subscription

If a discount ends, tick the acknowledgement after checking the affected
discounts and the quoted charges. Use the confirmation button to submit the
change. The button may say **Confirm plan change**, **Confirm and pay**, or
**Continue to Stripe**, depending on the quote and any required acknowledgement.
Confirmation can authorize a charge to the payment method on file. When the
Console sends you to Stripe, complete the payment steps there.

Return to **Account** to check that the target plan is active or scheduled for
the quoted date. If the change is still processing, check the subscription
status on **Account** again before trying another change.

## Resolve a blocked change or a changed quote

- **Your usage exceeds the target plan's limits.** The page lists each limit
  you exceed, your current usage, and the target limit. Reduce usage to fit the
  plan and request a new quote, or choose **Contact support**. The Console
  blocks confirmation while any listed limit is exceeded.
- **The quote changed.** Choose **Get a new quote**. Check the new amounts,
  effective date, and any discount loss before confirming again.
- **The quote is unavailable.** Choose **Get a new quote**. If the selected
  interval is unavailable for that plan, choose an offered interval or plan.
- **The Console couldn't verify the result.** Use **Retry confirmation** to
  resend the same confirmation, or check your subscription on **Account**.
