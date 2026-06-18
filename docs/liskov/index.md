---
sidebar_position: 1
title: Liskov
description: User documentation map for Liskov.
---

# Liskov

**Deploy like it's a cloud. Prove it isn't.**

Liskov takes one policy in your repo and one motion — and your app runs sealed
in a TEE on a real Acurast phone, on real home broadband. Secrets are delivered
sealed, logs stream back encrypted, and the public front door is wired for you.

Use Liskov when you want the developer experience of a managed deploy without
giving up the properties that make confidential compute worth running: your code
stays encrypted in transit, your secrets are sealed to the enclave before they
leave your machine, and the placement is provable.

:::info Early access
Liskov is in early access. APIs, command names, and pricing may still change.
:::

## What You Can Do

Liskov is built from a set of systems you compose through one application policy:

- **GitHub-first launches** — reviewable, repeatable, OIDC-pinned launches with
  no key files on disk.
- **Sealed secrets** — secrets are encrypted to the enclave before they leave
  your machine (delivered through [Lockbox](./guides/sealed-secrets.md)).
- **Encrypted logging** — logs are end-to-end encrypted from the seal to your
  terminal (through [Blackbox](./guides/encrypted-logging.md)).
- **Baran ingress** — a public HTTPS front door from one line of policy
  (see [Baran ingress](./guides/baran-ingress.md)).
- **Encrypted code** — plaintext only lives in your repo and inside the TEE;
  ciphertext in transit.
- **Launch schedules** — replicas, windows, durations, and rolling replacements
  (see [Schedules and replicas](./guides/schedules-and-replicas.md)).
- **Dollars in, dollars out** — budgets, quotes, and settlement in USDC
  (see [Budgets and spend](./guides/budgets-and-spend.md)).
- **Spend controls** — caps, preflights, and explicit `--yes-spend` gates.

Custom runtimes (a full proot image that CI builds and Liskov serves to the
phone) are still being built.

## Documentation Map

- [Quickstart](./quickstart/index.md): install the CLI, write a `liskov.json`,
  preflight, and run your first custody deploy.
- [Concepts](./concepts/index.md): the replacement-custody model, the deployment
  lifecycle, the trust model, and how policies are versioned.
- [Guides](./guides/index.md): GitHub launches, sealed secrets, encrypted
  logging, Baran ingress, schedules, and spend.
- [Reference](./reference/index.md): the `proof liskov` CLI, the `liskov.json`
  policy schema, and the reconcile-state vocabulary.
- [Troubleshooting](./troubleshooting/index.md): replacement holds, preflight and
  spend failures, and recovery.

## If You Only Need A Server

If your app just needs a server, use a server. If it needs to be private,
placed, and provable — Liskov is the ramp. For an app that only needs a public
HTTPS route in front of an existing Acurast job, you may only need
[Baran](/baran).
