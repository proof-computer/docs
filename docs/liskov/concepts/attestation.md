---
title: Attestation and the proof chain
description: Understand the evidence that binds build origin, artifact identity, policy identity, network assignment, and runtime contact.
---

# Attestation and the proof chain

Attestation is a signed statement about specific facts. A strong review keeps
those facts narrow and composes several statements instead of treating one
badge as universal proof.

## Build provenance

The reusable GitHub workflow requests a short-lived OIDC token. Liskov verifies
its audience and GitHub claims against builder authority in the manifest:
repository, allowed ref, workflow reference, and commit context. It joins those
claims to the built bundle's CID/digest and the manifest digests in an artifact
version.

This supports “an allowed GitHub workflow produced and reported these bytes.”
It does not support “the code is secure” without source and dependency review.

## Policy identity

Publication resolves an exact artifact version and server-owned facts into an
immutable effective policy V4. Its digest and version bind the execution
contract. The authored and release-intent digests preserve the connection to
customer input.

## Network evidence

Acurast registration and assignment identify the time-boxed job, schedule,
processor, and relevant chain events. Assignment supports that a processor
accepted the job. It is not runtime readiness.

## Runtime evidence

The job signs bootstrap requests using processor runtime identity. Liskov
returns identity-bound configuration and secrets. Signed diagnostic events bind
Application UID, policy, deployment, job, processor, and runtime instance where
the active protocol supports them. A UID-bearing request fails closed rather
than silently downgrading identity.

## Evidence age and absence

Every claim has time. A last-contact event can become stale; a process restart
creates a new runtime-instance ID. Missing evidence means “not observed through
this channel,” not necessarily “did not happen.” Use typed conditions and
support boundaries rather than filling gaps with assumptions.

For the concrete audit task, use [Inspect the proof chain](../operate/proof-chain.md).
