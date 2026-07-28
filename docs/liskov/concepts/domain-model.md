---
title: Applications, policies, artifacts, deployments, and jobs
description: Learn the stable Liskov resources, identifiers, and lifetimes used throughout Console, CLI, evidence, and support.
---

# Applications, policies, artifacts, deployments, and jobs

These words are not interchangeable. Using the exact resource makes operations
and support safer.

| Resource | Lifetime | Identity and purpose |
| --- | --- | --- |
| **Organization** | Long-lived | Isolation, team, plan, Service Credit, and ownership boundary. |
| **Application** | Long-lived | Owns desired configuration, artifacts, deployments, evidence, and lifecycle. |
| **Manifest** | Mutable source document | Strict V4 customer-authored intent. |
| **Effective policy** | Immutable version | Server-normalized V4 execution contract. |
| **Artifact version** | Immutable | Exact bundle plus CID/digest and accepted provenance. |
| **Deployment** | One attempt/generation | Liskov record of realizing an effective policy. |
| **Job** | Time-boxed | Acurast network registration with schedule and processor. |
| **Runtime instance** | One process boot | Signed identity for a boot within one job. |

## Application ID and UID

`applicationId` is a readable slug in the manifest. An **Application UID** is
the server-issued immutable identity. The UID survives display-name changes
and protects canonical records from slug reuse or ambiguity. Use it in support
and evidence whenever available.

`applicationUid` may pin an existing Application during authoring; if present,
it must match the target. It is not a value to invent.

## Three digests

- `authoredDigest` identifies the exact canonical manifest content.
- `releaseIntentDigest` identifies normalized release and builder authority.
- `policyDigest` identifies the immutable effective policy after server-owned
  facts are resolved.

Each answers a different question. A matching artifact digest does not imply a
matching policy digest.

## Successor relationships

A policy update creates a new immutable policy. Renewal or update creates a new
deployment/job generation. A process restart creates a new runtime instance.
The Application joins their history without pretending they are one mutable
object.

When reading status or logs, keep at least Application UID, policy digest,
deployment ID, job ID, and runtime-instance ID available. See
[Deployments, jobs, and timelines](../operate/deployments-jobs.md) for the
operational view.
