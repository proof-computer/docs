---
title: Integrations
description: The systems your organization connects to Liskov, whose account each one needs, and whether it is live or on the roadmap.
---

# Integrations

The Console **Integrations** page (`/settings/integrations`) lists the
systems your organization connects, or will connect, to Liskov. The rail
item that used to say Runtime SSH is this page. `/settings/runtime-ssh`
still lands here for one release.

Each row states what the integration is, whose account it needs, and one of
two statuses:

- **Live** — available to your organization now. Where a setup link is
  shown, you can configure it today.
- **Roadmap** — designed and planned, and not available yet. Where a
  details page is shown, you can read exactly what it will require before
  it arrives.

Check whose account it is before you enable anything. Where the account is
yours, you own the credentials, the access policy, the audit trail, and any
bill that provider sends you. Where the account is Liskov's, the whole path
is our responsibility.

## Live

| Integration | Whose account | Where to set it up |
| --- | --- | --- |
| Liskov-Managed SSH | Liskov | Console Integrations → Liskov-Managed SSH; [Open a shell in a running job](./runtime-ssh.md) |
| GitHub App | You install it | Sign-in and application import. Installation coverage on its own page lands next. |
| Telegram | You | [Notifications](../organizations/records-notifications.md) |

Managed SSH is Preview on Developer and above. Liskov operates a single-machine
relay it cannot read. Relay traffic counts against the plan's included log
volume and is charged at the log overage rate above it.

## Roadmap

| Integration | Whose account | Notes |
| --- | --- | --- |
| Tailscale | You | Preview on Pro and above when a live policy version can name it. A V5 application cannot select `provider.kind = "tailscale"` today. Details are on Console Integrations → Tailscale. |
| Acurast Tunnel SSH | Acurast | A shell over the Acurast tunnel. |
| Acurast Tunnel | Acurast | Public hostname for a job; not selectable in the live policy version. |
| Cloudflare Tunnel | You | Your zone and hostname; not selectable in the live policy version. |
| Email & webhook | You | You can record a destination; nothing is sent to it yet. |
| Self-custody signer | You | You hold the key that funds deployments and releases secrets. |

Roadmap items are listed because several of them will need something from
you — a Tailscale account, a Cloudflare zone, a signing key you hold.
Knowing that now gives you time to arrange it.
