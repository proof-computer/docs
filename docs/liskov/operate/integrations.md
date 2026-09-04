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
| GitHub App | You install it | Console Integrations → GitHub App; [What the GitHub App covers](#what-the-github-app-covers) |
| Telegram | You | [Notifications](../organizations/records-notifications.md) |

Managed SSH is Preview on Developer and above. Liskov operates a single-machine
relay it cannot read. Relay traffic counts against the plan's included log
volume and is charged at the log overage rate above it. Its detail page lists
each exact-job attachment and lets an administrator revoke one attachment for
everyone on it without ending the job.

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

## What the GitHub App covers

The GitHub App is the one integration whose absence locks you out rather than
degrading a single feature. It is how you sign in, how an application is
imported from your repository, how a policy change reaches you as a pull
request, how a sealed secret is written, and how the marketplace catalogue is
read — five jobs, one credential.

Console **Integrations → GitHub App** shows the installation's status and every
repository your applications are bound to, with the applications that use it and
what each uses it for.

### Access is resolved one repository at a time

The App is installed on the repositories you choose, not on your whole account.
Each repository is listed with one of two states:

- **granted** — the installation still covers this repository.
- **revoked upstream** — it does not. The next import or publish from that
  repository will fail, and the page names the applications it will fail for.

Removing a repository from the installation breaks precisely the applications
bound to it and nothing else. Without this page you would find out at the next
import or publish; with it you can check before you need to.

### The token model

Liskov holds an App private key and signs a short-lived token with it at the
moment one is needed. Nothing customer-specific is stored, so there is no token
of yours in our database to leak or to expire unnoticed.

That also means **revocation is entirely yours**: uninstalling the App on GitHub
cuts every path above immediately, including your ability to sign in.

### What you do on GitHub, not here

Installing the App, adding a repository to the installation, removing one, and
uninstalling all happen in GitHub's own settings. The Console page reads what
your installation covers; it does not change it.

Reading the page needs the **Maintainer** or **Admin** role.
