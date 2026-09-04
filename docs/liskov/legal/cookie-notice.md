---
title: Liskov Cookie and Similar Technologies Notice — review draft
description: Counsel-ready working notice and pre-publication register for cookies, storage, analytics, and similar technologies.
draft: true
---

# Liskov Cookie and Similar Technologies Notice

:::caution[Not in force]
Review version 1.0, dated 3 September 2026. This notice is review material, has
no effect as a published notice, and is excluded from the production
documentation build. Its publication blockers remain open.
:::

**Version:** 1.0 — 3 September 2026

This Notice explains how Moose Labs Ltd trading as PROOF.COMPUTER (**PROOF**) uses cookies, local storage, pixels, SDK identifiers and similar technologies on the Liskov website, console and related online services.

> **Publication condition:** this Notice is a legally structured template. It must not be published as complete until a technical scan has identified every technology, provider, purpose, duration and country, and consent behaviour has been tested.

## 1. What these technologies are

A cookie is a small text file placed on a device. Local storage and similar browser technologies store or access information on a device. Pixels and SDKs can send device, page, event and identifier information to us or a provider.

UK rules may require consent before information is stored on, or accessed from, a device unless a specific exception applies. Data-protection law also applies where the information is Personal Data.

## 2. Categories we use

### 2.1 Strictly necessary

These are required to provide a service you request or to secure it, such as:

- authentication and session continuity;
- load balancing and network routing;
- security, fraud prevention and rate limiting;
- storing privacy choices;
- checkout and payment continuity;
- remembering a user-interface action necessary for a requested feature.

Where a technology is genuinely strictly necessary under applicable law, we do not ask for consent. We still describe it and use it only for the necessary purpose.

### 2.2 Functional

These remember optional preferences or provide enhanced features, such as language, layout, saved filters or an embedded support tool. Some may require consent, depending on whether they are necessary for a feature you specifically request and on current law/guidance.

### 2.3 Analytics and performance

These help us understand traffic, feature use, errors and performance. We use them only with consent where required. Where we rely on a statutory exception for limited first-party analytics or service improvement, we will document the exact conditions, give required information and provide any required opt-out.

### 2.4 Advertising and cross-service measurement

These may profile interests, measure campaigns across services, create audiences or support targeted advertising. We use them only with valid consent where required. Liskov should not enable this category at launch unless there is a documented business need and compliant consent flow.

## 3. Your choices

On first visit, our consent interface should:

- prevent non-essential technologies from running before a valid choice;
- explain purposes and providers in plain language;
- offer **Accept all**, **Reject non-essential** and granular controls with comparable prominence and ease;
- avoid pre-ticked optional purposes;
- record the consent version, time and choices;
- allow withdrawal as easily as consent through a persistent settings link; and
- ask again only when reasonably necessary or when purposes materially change.

Withdrawing consent does not make earlier processing unlawful. It stops future optional access/storage after the choice is applied, although a limited suppression or consent record may remain.

Browser blocking may affect strictly necessary functionality and is not a substitute for our consent controls.

## 4. Current technology register

Complete this table from a production scan. Do not use generic placeholders on the published page.

| Name / key | Provider | Domain / app | Category | Exact purpose | Data accessed or stored | First or third party | Duration | Countries / transfer safeguard | Consent or exception |
|---|---|---|---|---|---|---|---|---|---|
| [insert] | [insert] | [insert] | Strictly necessary / Functional / Analytics / Advertising | [insert] | [insert] | [insert] | [session / period] | [insert] | [insert] |

The inventory must cover:

- public marketing pages;
- Liskov console;
- authentication/SSO;
- checkout and payment;
- support/chat widget;
- status page;
- documentation;
- embedded video/fonts/maps;
- analytics, error monitoring and session replay;
- referral/affiliate tags;
- A/B testing and feature flags;
- CDN/WAF/bot management;
- pixels and server-side event forwarding;
- mobile/desktop SDK identifiers if applicable.

## 5. Analytics configuration

Where analytics is used, configure it to minimise data:

- avoid collecting payloads, source code, secrets or full URLs containing identifiers;
- mask or omit form content;
- disable advertising features unless specifically consented;
- use the shortest workable retention;
- restrict provider access and onward use contractually;
- assess international transfers;
- avoid cross-customer tracking;
- ensure “reject” prevents client and server-side optional events;
- document any first-party analytics exception relied on.

Session replay or heatmap tools require heightened review and should not record console secrets, credentials, wallet information, support content or source code.

## 6. Similar server-side processing

A server log may record IP address, user agent, requested URL, timestamp and security event without placing a cookie. This is described in the Privacy Notice. Device storage/access rules and data-protection rules should be assessed separately; moving a tracking event server-side does not automatically remove consent requirements where a client identifier or device information is still accessed.

## 7. Third parties and transfers

A third-party provider may act as our Processor or, for some purposes, an independent Controller. Its use is subject to its contract and privacy information. We identify material providers in the register and in our subprocessor schedule where applicable. Restricted international transfers require an appropriate safeguard and assessment.

## 8. Retention

Each technology should last no longer than necessary for its purpose. Session cookies expire when the session ends. Persistent duration must be stated in the register. Consent evidence may be retained longer than the cookie itself where needed to demonstrate compliance and honour choices.

## 9. Changes

We may update this Notice and the register when technologies or law change. A new optional purpose will not be enabled for a user until any required consent is obtained.

## 10. Contact

Questions or complaints: **privacy@proof.computer** [verify]  
Privacy Notice: [insert URL]  
Consent settings: [insert persistent URL or control]

---

**Release test:** clear browser storage; visit every journey; reject non-essential; confirm no optional requests, identifiers or server-forwarded events; accept categories separately; withdraw; retest; verify embedded content; repeat logged-out/logged-in and across supported browsers/regions.
