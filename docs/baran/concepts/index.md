---
title: Concepts
description: Baran conceptual model.
---

# Concepts

Concept pages explain why Baran behaves the way it does.

## Start Here

- [Trust Model](./trust-model.md): which keys and authorities stay with the
  job, developer, relay, gateway, and PROOF.
- [Deployment Lifecycle](./deployment-lifecycle.md): the stages from local
  intent to a validated public route.
- [Ingress Session Flow](../reference/ingress-session-flow.md): sequence
  diagrams for user deploys, Baran coordination, and HTTPS traffic.

## Core Model

```text
Public client
  -> HTTPS
  -> Baran gateway
  -> L4/SNI passthrough
  -> Acurast processor job
  -> job-owned TLS termination
  -> developer app
```

Baran coordinates three separate systems:

- Acurast runs the job.
- Polkadot Hub holds the paid ingress session and settlement state.
- PROOF relays, gateways, validators, DNS, and ACME automation provide the
  ingress service.

The CLI is the local signer and progress shell. Long-lived coordination moves
through the relay/control plane and gateway state.

## Stable Invariants

- The gateway should not terminate application TLS in the default trust model.
- The Acurast job should generate and keep the application TLS private key.
- The relay can submit signed material but cannot forge job authorization.
- Paid activation requires payment, registration, DNS/certificate readiness,
  gateway route readiness, and validator evidence.
- Customer hostname changes require developer authority for the funded session.

## Operational Details

Customer hostnames may require you to create CNAME or TXT records in your own
DNS zone. PROOF-managed DNS and ACME provider credentials stay in
PROOF-operated infrastructure, not in normal builder contexts.
