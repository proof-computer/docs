---
title: Liskov Cookie and Similar Technologies Notice
description: The cookies, browser storage and analytics used on PROOF’s websites and the Liskov console, and your choices.
---

# Liskov Cookie and Similar Technologies Notice

**Version 1.0 — effective 1 September 2026**

This Notice explains how MOOSE LABS LTD trading as PROOF (**PROOF**) uses cookies, browser storage and similar technologies on **proof.computer**, **docs.proof.computer** and the Liskov console at **console.liskov.proof.computer**.

## 1. What these technologies are

A cookie is a small text file placed on a device. Browser storage (local storage and session storage) keeps information on a device without a cookie. An analytics script sends page and event information to a provider. UK law requires consent before information is stored on, or read from, a device unless the storage is strictly necessary to provide a service you have asked for.

## 2. What we use

### 2.1 Strictly necessary

We do not ask for consent for these; they exist only to sign you in, keep you signed in and remember a setting you chose.

| Name | Where | Type | Purpose | Lasts |
|---|---|---|---|---|
| `proof.slipway.sessionToken` | Liskov console | local storage and session storage | Holds your sign-in session token after you sign in with GitHub or an email link. Cleared when you sign out. The server-side session expires after 24 hours. | Until sign-out |
| `proof.slipway.cliLogin.bounceStartedAtMs` | Liskov console | session storage | Prevents a redirect loop while signing the command-line tool in | Browser tab |
| `proof.slipway.theme` | Liskov console | local storage | Remembers your light or dark theme choice | Until cleared |
| `theme` | docs.proof.computer | local storage | Remembers your light or dark theme choice | Until cleared |
| `proof.consent` | proof.computer | local storage | Records the choice you made in the cookie banner so we do not ask again | 12 months |

The Liskov console sets **no cookies**; sign-in uses a token held in browser storage.

### 2.2 Analytics (only with your consent)

On **proof.computer** we use Google Analytics 4 (Google Ireland Limited) to understand how the website is used. It runs only after you choose **Accept all** or enable analytics in the banner. Google Analytics 4 does not log or store IP addresses.

| Name | Where | Purpose | Lasts |
|---|---|---|---|
| `_ga` | proof.computer | Distinguishes visitors | 2 years |
| `_ga_C9DLBP64TK` | proof.computer | Keeps session state for the analytics property | 2 years |

docs.proof.computer and the Liskov console use **no analytics**.

### 2.3 Third-party requests that are not cookies

Some pages load resources from third parties. Loading a resource sends your IP address and browser details to that provider but does not store anything on your device:

- fonts from Google Fonts (all three sites);
- the Tailwind CSS script from Tailwind Labs’ content-delivery network and, on the search page, a search library from Cloudflare’s cdnjs (proof.computer only).

When you pay, you are taken to a checkout page hosted by Stripe, and when you sign in you are taken to GitHub. Their own cookie notices apply on their pages.

## 3. Your choices

On your first visit to proof.computer a banner offers **Accept all**, **Reject non-essential** and **Choose settings** with equal prominence. Nothing optional runs until you choose. You can change your choice at any time using the **Privacy choices** link in the site footer. Withdrawing consent stops analytics from the moment you withdraw it; it does not make earlier processing unlawful.

Your choice is stored only in your browser. We do not keep a server-side record of it. Clearing your browser storage clears the choice and the banner appears again.

Browser settings that block cookies or storage may stop you signing in to the console, because the session token is strictly necessary.

## 4. Server-side records

Our servers record the IP address, browser type, requested URL, timestamp and response code of requests, and an error-monitoring service receives technical error reports that are configured not to include request content or personal identifiers. These records are described in the Privacy Notice; they do not store anything on your device.

## 5. Changes

We update this Notice when the technologies we use change. A new optional purpose will not run for you until you have consented to it.

## 6. Contact

Questions: **privacy@proof.computer**  
Privacy Notice: [docs.proof.computer/liskov/legal/privacy-notice](./privacy-notice)

---

MOOSE LABS LTD trading as PROOF · Version 1.0 · effective 1 September 2026 · previous versions are archived by PROOF and available on request from legal@proof.computer.
