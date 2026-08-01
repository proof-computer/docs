---
title: Marketplace option contract
description: Review the intended variables, secrets, prerequisites, costs, and update evidence for a future supported launch.
---

# Marketplace option contract

:::caution Release-gated v1
Marketplace launch is currently limited to internal first-party engineering
acceptance. This page defines release criteria; it does not authorize a
customer to enter secrets, approve spend, or create an Application.
:::

A supported Marketplace launch will copy an exact curated offering version
into the selected organization. Its option form is part of that version's
contract.

## Review before entering values

Check:

- what customer outcome the offering promises;
- source repository, version, artifact CID, digest, and encryption mode;
- schedule, resources, and renewal behavior;
- external accounts, credentials, URLs, or allowlisting you must prepare;
- Marketplace price, Liskov/Acurast quote, and third-party costs; and
- whether changing an option requires a successor deployment.

“Free” on a listing means no Marketplace software fee. Compute, Liskov service,
and an external API can still cost money.

## Variables and secrets

| Option type | Use it for | Visibility |
| --- | --- | --- |
| Variable | Non-sensitive URL, mode, identifier, or default. | May be visible to authorized Application readers and diagnostics; safe to display. |
| Secret | Token, password, private key, or credential-bearing connection string. | Entered over TLS, server-wrapped, never available as a plaintext read-back. |

The form label is the supported interface. Runtime environment names are
reference details for troubleshooting, not an invitation to bypass managed
configuration.

## Names and ownership

The supported form must accept an Application name meaningful inside the active organization. Liskov
also assigns an immutable Application UID, which survives rename and binds
evidence. Launching the same offering twice creates distinct Applications,
configuration, costs, and histories.

## Updates

An offering update selects another exact version. Review its artifact,
configuration changes, schedule, and price again. Updating creates a successor
under the lifecycle policy; it does not rewrite the code or secret values
inside a running Acurast job.

## Verify

Before public release, acceptance must prove that the review identifies the
active organization, Application name, every secret label and external
account, displayed quote/reserve, and maximum commitment. The created
Application must show the selected offering ID and version.

Review [Uptime Prober](./uptime-prober.md) for the first-party acceptance
fixture's exact contract.
