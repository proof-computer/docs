---
title: Artifacts, encryption, and provenance
description: Understand the immutable bytes and evidence that connect a Marketplace version or GitHub commit to a Liskov deployment.
---

# Artifacts, encryption, and provenance

Liskov deploys an immutable artifact version, not a mutable branch or URL. For
the v1 repository path, that version is an IPFS bundle identified by both a
content identifier (CID) and a SHA-256 digest.

## Evidence chain

```mermaid
flowchart LR
  C[GitHub commit] --> W[Allowed workflow]
  W --> A[Artifact version<br/>CID + SHA-256]
  A --> P[Effective policy<br/>version + digest]
  P --> J[Acurast job<br/>processor + schedule]
  J --> R[Signed runtime<br/>instance contact]
```

| Evidence | What it supports | What it does not prove |
| --- | --- | --- |
| GitHub OIDC | The repository, ref, commit, and workflow identity seen by GitHub. | That the source is safe or correctly reviewed. |
| CID and digest | The exact uploaded bundle bytes. | Who authored those bytes. |
| Artifact version | Liskov's stable record joining bytes and accepted provenance. | That a policy selected it. |
| Policy digest/version | The immutable execution contract for one Application. | That the network accepted or started a job. |
| Job and processor evidence | Registration, schedule, assignment, and network identities. | That application code became ready. |
| Signed runtime contact | A bound runtime instance contacted Liskov and reported capability state. | That every application-level request is correct. |

Together these facts make claims reviewable without pretending that one
attestation proves the whole system.

## Encryption modes

The V4 schema can declare `none` or `aes256_gcm`, but schema vocabulary is not
evidence that an end-to-end execution path exists. At the reviewed release,
the reusable GitHub pin action requires `none` and rejects an
`aes256_gcm` build requirement. Current IPFS Application bytes are therefore
not a private-code mechanism, even when their source repository is private.

An encrypted path is complete only when the build produces ciphertext, the
artifact record binds plaintext and ciphertext evidence, and a job-bound
runtime loader obtains the key, verifies the expected bytes, decrypts, and
loads the Application. That complete path is not supported today.

Encryption does not make untrusted source safe, and an unencrypted artifact
does not weaken processor TEE isolation by itself. Confidential artifact
delivery and TEE execution are different guarantees.

Do not put secrets in the bundle in either mode. Managed secrets are separate,
versioned configuration delivered for a particular job.

## Marketplace provenance

A Marketplace launch selects an exact offering version and its pinned artifact
evidence. Review the source repository, version, CID, and digest displayed by
the listing. Marketplace curation is a product decision; it is not a general
third-party publishing or payout system in v1.

## Repository provenance

The manifest authorizes a narrow builder identity. A build from another repo,
ref, workflow, or manifest path must fail even if its bundle has the same
filename. When publishing, select the exact artifact-version ID produced by
the run you reviewed.

Continue with [Inspect the proof chain](../operate/proof-chain.md) to verify a
running deployment.
