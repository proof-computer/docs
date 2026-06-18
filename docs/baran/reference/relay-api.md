---
title: Relay API
description: Manifests, observability, registration, and hostname APIs.
---

# Relay API

The relay/control plane is the network-facing source for manifests, quotes,
deployment intents, registration, certificate coordination, hostname status,
observability, and catalogs.

Use the CLI unless you are building tooling that needs typed readback or a job
runtime helper.

## Network Manifest

Default discovery:

```text
GET https://control.baran.proof.computer/v1/network-manifest
```

The CLI verifies the manifest signer before using Hub chain ID, registry
address, accepted assets, RPC URLs, or service-catalog references. Expired
manifests are rejected unless `--allow-expired-manifest` is passed for
diagnostics.

## Service Catalogs

Service catalogs are referenced by the signed manifest and verified under the
`baran.service-catalog.v1` signature domain.

Read-only diagnostics:

```fish
proof baran catalog inspect --url '<catalog url>' --json
proof baran catalog verify --manifest-url '<manifest url>' --manifest-signer '<signer>'
```

Catalog references must name a trusted signer or pin the exact response body
with a SHA-256 digest. If both are present, both are enforced.

## Deployment Observability

Demo and runtime observability reads:

```text
GET /v1/deployment-intents/:intentId/observability
```

The Baran Express demo polls this endpoint when these env vars are
present:

```text
BARAN_RELAY_URL
BARAN_INTENT_ID
BARAN_INTENT_TOKEN
```

The response is bounded materialized state for route, DNS, certificate,
gateway, job-local observations, assigned validators, and recent report state.

## Registration And Certificate Calls

Relay requests use action-specific authority:

- job registration is signed by the expected job signer
- certificate requests are signed by the expected job signer
- customer-hostname changes are signed by the funded session developer
- gateway or admin routes require scoped bearer tokens

The relay can submit signed material, but it should not be able to forge the
job or developer authority.

## Customer Hostname Status

Use the CLI for readback:

```fish
proof baran hostname status app.example.com --json
```

Status can report DNS validation, `_acme-challenge` delegation, manual TXT
requirements, certificate authorization, and route readiness.

## Transport Security

Secret-bearing relay, SDK, control-plane, and log transport URLs must use
HTTPS by default. Plain HTTP is only for explicit local labs or loopback tests
where the caller opts in.
