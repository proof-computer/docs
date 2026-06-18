---
title: Ingress Session Flow
description: Visual reference for Baran deploy, coordination, and HTTPS traffic paths.
---

# Ingress Session Flow

An ingress session joins local signing, Acurast compute, Hub payment,
Baran relays, gateway route state, job-owned TLS, and validator
evidence. These diagrams show the same session from three angles.

## User And CLI Flow

This is the path a developer sees through the CLI. Liskov or another trusted
caller can replace the interactive user shell when it preserves the same
signing, funding, and confirmation boundaries.

```mermaid
sequenceDiagram
  participant Caller as User / CLI / Liskov
  participant Relay as PROOF Relay
  participant Hub as Polkadot Hub
  participant Acurast
  participant Job as Acurast Job
  participant Gateway

  Caller->>Relay: preflight, manifest, capacity, quote request
  Relay-->>Caller: signed manifest, signed quote, gateway and processor candidate
  Caller->>Acurast: submit job bundle and encrypted runtime config
  Caller->>Hub: approve and fund the USDC ingress quote
  Acurast->>Job: start the selected workload
  Job->>Relay: job-signed registration and certificate requests
  Relay->>Gateway: desired route state after valid admission
  Caller->>Relay: poll status and observability
  Relay-->>Caller: public URL, DNS, TLS, route, and validation state
```

What this shows: the caller funds the session and submits compute, but the job
still signs its own registration and certificate requests.

## Baran Coordination Flow

This is the control-plane path after a job starts. The relay coordinates state,
the gateway proves the upstream it observed, and validators gate activation and
settlement with public route evidence.

```mermaid
sequenceDiagram
  participant Job as Acurast Job
  participant Relay as PROOF Relay
  participant Gateway
  participant Validator
  participant Hub as Polkadot Hub

  Job->>Relay: job-signed registration
  Relay-->>Job: upstream admission challenge
  Job->>Gateway: signed upstream admission request
  Gateway-->>Job: signed upstream observation
  Job->>Relay: gateway observation and admission id
  Relay->>Gateway: route state for admitted hostname
  Gateway-->>Relay: signed capability and route-state reports
  Validator->>Gateway: probe public hostname over HTTPS
  Gateway->>Job: L4/SNI passthrough to admitted upstream
  Job-->>Validator: challenge response over job-owned TLS
  Validator-->>Relay: signed route-open evidence
  Relay->>Hub: activate or settle eligible fulfillment
  Hub-->>Relay: claimable accounting state
```

What this shows: route targets come from signed gateway upstream admission, not
from arbitrary job health metadata. Validation proves the public route before
settlement.

## HTTPS Traffic Path

This is the data path for a normal user request. The gateway routes by SNI and
passes bytes through; the Acurast job owns the certificate and terminates TLS.

```mermaid
sequenceDiagram
  participant Client as HTTPS Client
  participant DNS
  participant Gateway
  participant Phone as Acurast Phone / Processor
  participant App as Job App

  Client->>DNS: resolve app.example.com
  DNS-->>Client: Baran gateway address
  Client->>Gateway: TLS ClientHello with SNI app.example.com
  Gateway->>Phone: TCP passthrough to admitted job upstream
  Phone-->>Client: TLS handshake with job-owned certificate
  Client->>Phone: HTTPS request through gateway
  Phone->>App: local HTTP request handling
  App-->>Phone: response body
  Phone-->>Client: HTTPS response through gateway
```

What this shows: the gateway does not hold the application private key and
does not terminate application TLS in the default Baran path.
