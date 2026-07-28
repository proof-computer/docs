---
title: Launch from Marketplace
description: Launch a curated first-party application, supply its options safely, and reach a verifiable Liskov Application.
---

# Launch from Marketplace

This quickstart launches **Uptime Prober**. It opens a URL every five minutes
inside an Acurast phone, captures a screenshot, and sends the result to your
own Telegram bot.

## Before you begin

Complete [Set up Liskov](./set-up-liskov.md). You also need:

- an `https://` URL that is reachable from the public internet;
- a Telegram bot token from BotFather; and
- the numeric chat ID for a conversation that has already sent `/start` to
  that bot.

The offering software and Marketplace fee are free. The launch still uses
Acurast compute and Liskov service, shown in the preflight quote. Telegram is
an external service with its own terms.

## 1. Review the offering

Open **Marketplace**, select **Uptime Prober**, and review:

- source repository and listed version;
- artifact content identifier (CID) and digest;
- schedule and compute requirements;
- required options; and
- estimated reserve and external services.

The listing identifies exact bytes. Launching creates a copy in your
organization; it does not connect you to a shared PROOF bot.

## 2. Enter launch options

Provide:

| Option | Value |
| --- | --- |
| **Host to probe** | A complete `https://` URL, such as `https://example.com`. |
| **Telegram bot token** | The token BotFather issued. This is a managed secret. |
| **Telegram chat ID** | The numeric chat ID that should receive results. |

Choose an Application name you will recognize. Review the update choice if the
Console offers one; a Marketplace update never changes your running job without
the Application lifecycle creating a successor.

The secret value travels to PROOF over TLS for server-side wrapping. It is not
stored in the listing or retained as plaintext. See
[Secrets](../configure/secrets.md) for the complete trust boundary.

## 3. Review and launch

Review the effective options, quote, reserve, and spend limits. Launch only
when the organization and maximum commitment are correct.

The launch creates the Application, stores its managed configuration, and
starts the supported deployment flow. Do not resubmit if the page is waiting;
open the new Application and follow its status.

## 4. Verify the result

Open the Application. Use [Follow your first deployment](./first-deployment.md)
until runtime is ready. A successful result is a Telegram message from your
bot with:

- a screenshot of the configured host;
- HTTP status;
- observed latency; and
- a timestamp.

Allow time for external processor acceptance and the next five-minute probe tick; Liskov does not promise an exact startup time. The first result may arrive after the Application reports runtime contact.

## What happens next

The Acurast job is time-boxed. Liskov plans successors according to the
effective policy; actual overlap or a gap is recorded as evidence rather than
assumed. Your bot token remains managed by your Application and is delivered
only through job-bound grants.

Next, [verify the Marketplace Application](../marketplace/verify.md) or learn
how to [monitor logs and activity](../operate/logs-activity.md).
