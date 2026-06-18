---
title: Encrypted Logging
description: Stream end-to-end encrypted logs from the enclave with Blackbox.
---

# Encrypted Logging

Liskov can stream your application's logs back to you **end-to-end encrypted**,
from the seal inside the enclave to your terminal. This is **Blackbox**.

Because the log path is encrypted to a key you hold, PROOF infrastructure that
forwards the logs cannot read them.

:::info Early access
Blackbox is early. Some configuration and read ergonomics are still changing.
:::

## Enabling Logging

Logging is opt-in through the policy:

```json title="liskov.json (excerpt)"
{
  "blackbox": { "enabled": true }
}
```

When enabled, the runtime writes log lines into a sealed local spool and flushes
them to your sink. The writer keeps a local spool by default so first-boot output
is not lost before the sink is ready.

## Reading Logs

Read decrypted logs for an app from your machine:

```fish
proof liskov blackbox read --name my-app
```

This resolves the decryption key for your session and prints decrypted lines. The
control plane and forwarders only ever handle ciphertext.

## Ownership

Blackbox logs are encrypted to an owner key. Inspect the expected configuration
and owner with:

```fish
proof liskov blackbox owner show
```

## Related

- [Trust model](../concepts/trust-model.md) — what infrastructure can and cannot
  read
- [Sealed secrets](./sealed-secrets.md) — the same seal-to-enclave principle for
  inputs
