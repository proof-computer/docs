---
title: Marketplace release boundary
description: Understand the intended curated launch path and why it is not yet available to customers.
---

# Marketplace release boundary

:::caution Release-gated v1
Marketplace launch and Uptime Prober are currently limited to internal
first-party engineering acceptance. They are not supported customer paths. Do
not enter a Telegram token, approve Marketplace spend, or rely on a listing to
create an Application until the [capability matrix](../reference/capabilities.md)
removes this gate.
:::

## Intended outcome

The first curated offering is intended to be **Uptime Prober**. It opens a
public URL inside an Acurast phone, captures a screenshot, and sends the result
to the operator's Telegram bot. A future supported launch should create a
normal Liskov Application in the selected organization rather than attach the
customer to a shared publisher deployment.

## Release criteria

A customer recipe will be appropriate only after the product owners confirm:

- the exact first-party listing and its admitted version;
- listing-to-Application artifact and policy provenance;
- clear prerequisites, option labels, secret handling, quote, reserve, and
  maximum commitment;
- collision-safe Application naming and an actionable post-launch timeline;
- a supported customer funding and commercial-terms path; and
- complete production acceptance and public release approval.

Internal first-party acceptance may exercise these facts in production. That
acceptance does not authorize a customer to repeat the journey.

## Safe customer path today

Use [Deploy from GitHub](./github.md) only if Manifest V4 publication is enabled
for your organization and it already has enough available Service Credits.
You can review the [Uptime Prober contract](../marketplace/uptime-prober.md) and
[Marketplace evidence model](../marketplace/verify.md) as release-boundary
reference, not as launch instructions.
