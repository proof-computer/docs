---
title: Concepts
description: Switchboard conceptual model.
---

# Concepts

Concept pages explain why Switchboard behaves the way it does.

## Start Here

- [Trust Model](./trust-model.md): which keys and authorities stay with the
  job, developer, relay, gateway, and PROOF.
- [Deployment Lifecycle](./deployment-lifecycle.md): the stages from local
  intent to a validated public route.

## Core Model

```text
Public client
  -> HTTPS
  -> PROOF/operator gateway
  -> L4/SNI passthrough
  -> Acurast processor job
  -> job-owned TLS termination
  -> developer app
```

Switchboard coordinates three separate systems:

- Acurast runs the job.
- Polkadot Hub holds the paid ingress session and settlement state.
- PROOF relays, gateways, validators, DNS, and ACME automation provide the v1
  ingress service.

The CLI is the local signer and progress shell. Long-lived coordination moves
through the relay/control plane and gateway read models.

## Stable Invariants

- The gateway should not terminate application TLS in the default trust model.
- The Acurast job should generate and keep the application TLS private key.
- The relay can submit signed material but cannot forge job authorization.
- Paid activation requires payment, registration, DNS/certificate readiness,
  gateway route readiness, and validator evidence.
- Customer hostname changes require developer authority for the funded session.

## Beta Details

Some operational details are private-beta implementation choices rather than
permanent product requirements. For example, the current private-beta DNS path
may require a Cloudflare token in local developer context, while the target
public trust model keeps DNS authority PROOF-operated or explicitly delegated.
