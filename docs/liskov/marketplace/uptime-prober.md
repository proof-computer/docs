---
title: Uptime Prober
description: Configure, launch, and verify screenshots of a public URL delivered every five minutes to your own Telegram bot.
---

# Uptime Prober

Uptime Prober renders a public URL inside an Acurast phone's protected WebView,
captures a PNG, and sends it to your Telegram chat every five minutes. The
screenshot path runs in the job. You provide your own bot; there is no shared
PROOF Telegram bot.

## Prepare Telegram

1. In Telegram, open **BotFather** and create a bot.
2. Store the issued bot token in a password manager. Treat it as a secret.
3. Open a conversation with your new bot and send `/start`.
4. Obtain the numeric chat ID for that conversation using a trusted Telegram
   method or bot API call.

Do not paste the token into the chat ID field, source repository, or support
message.

## Prepare the host

Use a complete, publicly reachable `https://` URL, for example
`https://example.com`. The page must work without an interactive login,
customer VPN, or inbound connection to the processor. The page owner will see
ordinary outbound requests from a changing network location.

## Enter exact options

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

Compare these values with the Console listing. If they differ, treat the
Console as a different offering version and review its displayed evidence
rather than copying old values.

## Launch and follow progress

Review the active organization, options, quote, reserve, 30-minute job
duration, five-minute renewal lead, and open-market placement. Confirm launch
once. Then use [Follow your first deployment](../get-started/first-deployment.md).

The first Telegram result can arrive after runtime contact because the probe
runs on a fixed five-minute tick.

## Verify the result

A successful message contains a screenshot plus HTTP status, observed latency,
and timestamp. Verify that:

- it came from your bot to your intended chat;
- the screenshot is the configured host;
- the timestamp is current; and
- later messages continue on the expected tick.

Also verify the listing version, pinned CID/digest, effective policy,
Acurast job/processor, and signed runtime instance in Liskov. The screenshot
proves observed page output at one time; it is not an uptime service-level
agreement or proof that the origin is trustworthy.

If Telegram delivery fails, recheck `/start`, numeric chat ID, bot-token
rotation, and Action Plan without exposing the token.
