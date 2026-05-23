---
title: Customer Domains
description: Customer hostname and DNS delegation content target.
---

# Customer Domains

This page will document customer hostnames for Switchboard sessions.

## Planned Coverage

- Canonical Switchboard endpoint versus customer CNAME.
- DNS validation requirements.
- `_acme-challenge` delegation.
- `switchboard hostname status`.
- Signed hostname add/remove paths when they are ready for public docs.
- Common DNS and ACME failure modes.

The trust model must remain explicit: operators do not receive customer DNS
tokens or PROOF canonical-zone authority.
