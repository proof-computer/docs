---
title: Secrets
description: Declare, ingest, deliver, rotate, and verify managed secrets with the correct v1 trust boundary.
---

# Secrets

Managed secrets keep plaintext out of your repository and ordinary Application
reads. They are declared by stable ID and delivered to a specific job as an
environment variable or file.

## The v1 trust boundary

When you enter a secret, your browser sends plaintext to PROOF over TLS. The
Liskov secrets service briefly observes it so the server can wrap it; Liskov
does not persist the plaintext. It stores an encrypted envelope and later
re-encrypts the selected version into an identity-, policy-, deployment-, job-,
and expiry-bound grant for the target processor.

This is server-wrap ingestion, not client-side sealing and not a claim that
PROOF can never observe plaintext. At runtime, the Liskov SDK authenticates the
job context, verifies and decrypts the grant inside the processor's trusted
execution environment (TEE), then installs the declared destination.

## Declare destinations

```json
{
  "configuration": {
    "secrets": [
      {
        "secretId": "api-token",
        "required": true,
        "destination": {
          "kind": "env",
          "name": "API_TOKEN"
        }
      },
      {
        "secretId": "service-config",
        "required": false,
        "destination": {
          "kind": "file",
          "path": "/run/secrets/service.json"
        }
      }
    ]
  }
}
```

The manifest contains identifiers and destinations only. Never add plaintext,
a ciphertext copied from another system, or a secret in a variable `default`.

## Add or rotate a value

Open the Application's **Secrets** settings. Select the declared secret ID,
enter the value, and review the target Application before saving. Authorized
read surfaces show requirement and version metadata, never a plaintext
read-back. The public CLI can inspect requirements:

```bash
proof liskov application secrets APPLICATION_ID
```

It does not write or reveal values.

Saving a new version does not mutate an already running process. Use the
Application's supported update flow to create a successor when the rotation
must take effect. Keep the old external credential valid until the successor
reports runtime readiness, then revoke it at the provider.

## Required and optional behavior

A required secret blocks readiness if no usable version or grant exists. The
runtime SDK's `secrets: { mode: "required" }` makes the process fail closed.
Background mode is only for software designed to remain safe in a locked or
degraded state.

## Verify without exposing the value

Verify:

- the requirement shows **configured** for the intended Application;
- the new deployment references the expected secret version/digest;
- runtime capability state reports secrets ready; and
- the application performs a harmless authenticated operation.

Do not paste a token into logs, activity, diagnostics, screenshots, support
bundles, or chat. If delivery fails, use
[Variables, secrets, and runtime bootstrap](../troubleshooting/config-bootstrap.md)
and share stable IDs and redacted error codes only.
