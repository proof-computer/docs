---
title: Deployment Lifecycle
description: The stages a Liskov launch crosses, from policy to settled traffic.
---

# Deployment Lifecycle

A Liskov launch crosses local signing, Acurast compute, quote funding,
registration, certificate issuance, ingress routing, and validator evidence.
When something fails, diagnose it by stage.

## 1. Local Project And Context

Your app is declared in `liskov.json` plus a `.liskov/` working directory.
Named contexts and session state live under your home directory and point at
environment-variable names for secrets, never the secret values.

## 2. Preflight

`proof liskov custody preflight my-app` checks prerequisites before any spend:

- the published policy version and its digest
- declared secrets are granted
- budget caps and the accepted quote asset
- ingress requirements

Preflight returns a signed quote. It does not spend.

## 3. Submit To Acurast

The CLI prepares the runtime bundle, uploads the encrypted artifact, and submits
the job to the Acurast chain. Node web apps use the `NodeJSWithBundle` runtime.

## 4. Fund The Quote

The control plane returns a signed quote; the CLI funds the registry through the
accepted payment asset (USDC). This is separate from Acurast compute reward.
Spend only happens here, and only behind `--yes-spend`.

## 5. Job-Signed Registration

Once the job starts inside the TEE, it signs its own Liskov registration
material. The control plane can submit that material, but it cannot forge job
authority.

## 6. Job-Owned TLS

The job generates its TLS private key inside the enclave, creates a CSR, and
obtains its certificate. The private key never leaves the Acurast runtime.

## 7. Baran Ingress

If the policy requests ingress (`ingress.implementor: "baran"`), the Baran
gateway opens a route to the job and the service becomes reachable over public
HTTPS. The gateway does L4/SNI passthrough — it routes, it does not terminate
your TLS. See [Baran ingress](../guides/baran-ingress.md).

## 8. Validation And Settlement

Validators probe the public endpoint and challenge path and submit signed
evidence that the route is open. Settlement is batched into scheduler windows, so
validators may report more frequently than fulfillment is written.

## 9. Readback And Recovery

Start with read-only commands; they never spend:

```fish
proof liskov application status my-app
proof liskov application plans my-app
```

When a launch is stuck, read the [reconcile states](../reference/reconcile-states.md)
and the [recovery guide](../troubleshooting/recovery.md) before re-running with
`--yes-spend`.

## 10. Replacement

As the active job approaches expiry, replacement custody launches its successor.
The same lifecycle runs again for the replacement, overlapping the outgoing job
by `replacementRunwayMs`. See [Replacement custody](./replacement-custody.md).
