---
title: Uptime Prober release contract
description: Review the pinned first-party fixture and its prerequisites while customer launch remains release-gated.
---

# Uptime Prober release contract

:::caution Release-gated v1
Uptime Prober is currently an internal first-party engineering acceptance
fixture. It is not a supported customer offering. Do not enter a Telegram bot
token or attempt to launch it until the
[capability matrix](../reference/capabilities.md) removes this gate.
:::

Uptime Prober renders a public URL inside an Acurast phone's protected WebView,
captures a PNG, and sends it to your Telegram chat every five minutes. The
screenshot path runs in the job. The intended user provides their own bot;
there is no shared PROOF Telegram bot.

## Intended prerequisites

A future supported user will need a Telegram bot they control, a conversation
that has already sent `/start` to that bot, and the conversation's numeric chat
ID. The bot token is a managed secret and must never appear in source, a chat
ID field, logs, or a support message.

A complete, publicly reachable `https://` URL is also required. The page must
work without an interactive login, customer VPN, or inbound connection to the
processor. The page owner will see ordinary outbound requests from a changing
network location.

## Exact option contract

| Console option | Runtime destination | Kind | Required |
| --- | --- | --- | --- |
| **Host to probe** | `UPTIME_PROBER_HOST` | Variable | Yes; default `https://example.com` |
| **Telegram bot token** | `UPTIME_PROBER_TG_BOT_TOKEN` | Managed secret | Yes |
| **Telegram chat ID** | `UPTIME_PROBER_TG_CHAT_ID` | Variable | Yes |

The source listing is `proof/uptime-prober`. Its current descriptor pins:

```text
CID:    ipfs://QmQCpRJ593xRyKko9smvtFixzfAGwDuG6gXBemRtUeSe4U
SHA-256: 7545ffe44288c548ff4dea09ef0c0dc318a8dd490c5dc822becec3ff0d307d57
Encryption: none
```

Public release must preserve or deliberately version these values. A different
Console value represents a different offering version and must carry its own
displayed evidence.

## Source

The Uptime Prober's source is public, under **Apache-2.0**, in
[`proof-computer/liskov-marketplace-offerings`](https://github.com/proof-computer/liskov-marketplace-offerings)
under `uptime-prober/`. Public release pins an immutable tag rather than a
branch, and the listing shows the exact commit, the licence, and the digest of
that source tree alongside the SBOM committed beside it.

What the offering declares: it reads the host URL the launching user configures,
sends the resulting PNG and status line only to that user's own Telegram bot via
`api.telegram.org`, and fetches no code at runtime. The probed host is variable
by design — the offering exists to probe a URL the customer chooses, so that
destination cannot be enumerated in advance.

## Required acceptance evidence

A successful internal acceptance message contains a screenshot plus HTTP
status, observed latency, and timestamp. Release evidence must show that:

- it came from your bot to your intended chat;
- the screenshot is the configured host;
- the timestamp is current; and
- later messages continue on the expected tick.

Also verify the listing version, pinned CID/digest, effective policy,
Acurast job/processor, and signed runtime instance in Liskov. The screenshot
proves observed page output at one time; it is not an uptime service-level
agreement or proof that the origin is trustworthy.

Customer troubleshooting will be published only when the launch gate is
removed. Until then, do not send the bot token to support or attempt an
unpublished workaround.
