---
title: Trust and data boundaries
description: See where source, artifact bytes, secret plaintext, encryption keys, identity, logs, and payment authority exist in v1.
---

# Trust and data boundaries

Liskov reduces and records trust; it does not remove every trusted party.
Review each data type at the boundary where it is visible.

| Data or authority | Where it exists | Important boundary |
| --- | --- | --- |
| GitHub source | Your repository and GitHub runner | OIDC proves runner identity facts, not source safety. |
| Artifact bytes | GitHub runner/IPFS and processor | CID/digest identify bytes; encryption mode is explicit. |
| Authored manifest | Repository, CLI, and Liskov draft | Contains authority and names, never secret plaintext. |
| Effective policy | Liskov immutable record and proof surfaces | Server-resolved, digest-bound execution contract. |
| Secret plaintext at entry | Your browser and briefly PROOF over TLS | v1 uses server-wrap ingestion; PROOF can observe plaintext during wrapping. |
| Stored managed secret | Liskov encrypted envelope | Plaintext is not persisted; metadata and ciphertext remain. |
| Job secret delivery | Liskov secrets service and processor TEE | Re-encrypted into a job/identity/policy/expiry-bound grant. |
| Application logs | Job before encryption; authorized Liskov read path after decryption | Customer code chooses content; never log secrets. |
| Runtime diagnostics | Processor identity signs bounded events | Supports identity/health claims, not business correctness. |
| Customer funds | Stripe USD and Liskov Service Credit ledger | Customer has no Acurast crypto wallet. |
| Network spend authority | Effective policy plus Liskov managed custody | Bounded by caps, quote/reserve, and server controls. |

## Trusted execution environment

A trusted execution environment (TEE) is hardware-isolated execution on the
processor. It protects job execution from ordinary phone software and provides
identity/signing capabilities used by Liskov. It does not make arbitrary code
safe, validate an external API, or prevent your own process from leaking a
secret.

## Managed secret detail

The browser sends a value to PROOF over TLS. The server wraps it, stores only
the encrypted envelope, and later selects a version for a job-bound grant. The
runtime verifies the grant and installs the declared environment or file
destination inside the TEE.

This is intentionally different from a client-sealed zero-knowledge design.
Do not claim that plaintext never reaches PROOF.

## External boundaries

GitHub, Stripe, IPFS/Acurast, Telegram, and any API your workload calls have
their own identities, availability, terms, logs, and costs. Liskov evidence
should identify the crossing; it cannot absorb those parties into its trust
boundary.

See [Attestation and the proof chain](./attestation.md) for what each evidence
link supports.
