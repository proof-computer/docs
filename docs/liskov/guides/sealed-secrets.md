---
title: Sealed Secrets
description: Deliver secrets encrypted to the enclave with Lockbox.
---

# Sealed Secrets

Secrets never travel in plaintext and never live in your repo. Liskov delivers
them **sealed**: encrypted to the enclave before they leave your machine (or your
CI), stored only as sealed records by the control plane, and decrypted inside the
TEE at runtime. This delivery path is **Lockbox**.

## Declaring Secrets In Policy

The policy declares which secrets the app needs and the environment variable each
becomes at runtime. It declares names and targets only — never values:

```json title="liskov.json (excerpt)"
{
  "secrets": {
    "declarations": [
      { "secretId": "stripe-key", "required": true, "target": "env", "name": "STRIPE_KEY" },
      { "secretId": "database-url", "required": true, "target": "env", "name": "DATABASE_URL" }
    ]
  }
}
```

| Field | Meaning |
| --- | --- |
| `secretId` | Stable id for the secret within the policy. |
| `name` | Environment variable the secret becomes inside the job. |
| `target` | Delivery target; `env` injects it as an environment variable. |
| `required` | Whether the secret must be granted before deploy. |

## Delivery From CI

In a GitHub launch, a Lockbox manifest maps each `secretId` to a GitHub secret
name and the Lockbox ingestion endpoint, authorized by OIDC. The workflow seals
each value to the enclave key and uploads the sealed record — the plaintext never
leaves the runner unencrypted.

## What The Control Plane Stores

Only sealed-secret records and their digests. Policies reference secret versions
by id and digest, so a published policy commits to exactly which sealed secrets
it expects. The plaintext exists only inside the TEE after the loader decrypts
it.

## Preflight Catches Missing Grants

```fish
proof liskov custody preflight my-app
```

If a `required` secret is not yet granted, preflight reports it before any spend.
Grant the missing secrets and preflight again.

## Related

- [Trust model](../concepts/trust-model.md) — the secret boundary
- [GitHub launches](./github-launches.md) — the OIDC-pinned delivery path
