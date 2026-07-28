---
title: Choose your path
description: Decide whether to launch a curated Marketplace application or deploy code from your own GitHub repository.
---

# Choose your path

Liskov has two starting paths. Both finish with a normal Application in your
organization and use the same status, proof, billing, and lifecycle tools.

| Choose | When it fits | What you provide |
| --- | --- | --- |
| **Marketplace** | You want to run a curated application without maintaining its source or build. | Offering options, required secret values, a name, and spend approval. |
| **GitHub** | You own the workload and need source-to-runtime provenance. | A supported repository, Manifest V4, runtime integration, and a GitHub build workflow. |

Marketplace is usually the fastest first experience. The
[Uptime Prober](../marketplace/uptime-prober.md) sends periodic screenshots of
a URL to your Telegram bot and demonstrates managed secrets, outbound network
access, time-boxed execution, and proof inspection.

Choose GitHub when you need to change the code, build configuration, runtime
resources, schedule, or release authority. You will validate a strict manifest
and record an immutable artifact version before publication.

## Shared prerequisites

Both paths need:

- a GitHub account for Liskov sign-in;
- a Liskov organization;
- an eligible plan and accepted terms; and
- enough available USD Service Credits for the displayed reserve.

You do not need an Acurast account, processor, mnemonic, or ACU wallet for the
default managed-custody path.

Continue to [Set up Liskov](./set-up-liskov.md).
