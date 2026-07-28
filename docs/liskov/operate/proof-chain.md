---
title: Inspect the proof chain
description: Trace source or Marketplace selection through immutable artifact and policy evidence to an Acurast job and runtime instance.
---

# Inspect the proof chain

Use the proof chain when you need to answer: “What bytes and policy did this
processor run, and where did they come from?”

## 1. Start with release provenance

For a GitHub release, record repository, ref, commit SHA, workflow reference,
authored manifest digest, and release-intent digest. For Marketplace, record
the offering ID and exact listed version plus its source and pinned artifact
evidence.

## 2. Match the artifact

Confirm the artifact-version ID, IPFS CID, SHA-256 digest, encryption mode, and
accepted attestation. For advanced CLI inspection:

```bash
proof liskov application artifact-pin list APPLICATION_ID --json
```

The CID and digest identify bytes. GitHub OIDC or Marketplace provenance
explains the accepted source. Neither alone proves the code is safe.

## 3. Match the effective policy

Confirm schema `proof.liskov.application-policy`, version `4`, policy version,
policy digest, Application UID, and resolved artifact version. The effective
policy is server-materialized and immutable; it is not the source manifest.

```bash
proof liskov application plans APPLICATION_ID --json
```

## 4. Match deployment and network evidence

Open the deployment that cites that policy digest. Confirm its Acurast job ID,
scheduled bounds, processor ID, submission/assignment evidence, and any
successor relationship.

## 5. Match runtime contact

Confirm signed bootstrap/readiness evidence binds the Application UID, policy
digest, deployment, job, processor, and runtime-instance ID. Runtime contact
narrows the claim from “the network assigned a phone” to “a bound process
reported its capability state.”

## Interpret the result

The complete chain supports an identity and provenance claim. It does not prove
that source review found every bug, an external API returned truthful data, or
every application-level operation succeeded. Verify the workload's own output
separately.

For the security properties and non-properties of each link, see
[Attestation and the proof chain](../concepts/attestation.md).
