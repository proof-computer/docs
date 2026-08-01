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
| JavaScript artifact bytes | GitHub runner, IPFS providers/gateways, and processor | The current reusable action publishes unencrypted bundles. CID/digest identify bytes but do not make them private. |
| Cargo rootfs bytes | Liskov object storage and Android-private processor/executor storage | The current image URL is public-by-capability. Bytes are app-private and extracted into distinct execution directories, but a future signed fetch must also authorize cache-backed image release to the requesting job. |
| Authored manifest | Repository, CLI, and Liskov draft | Contains authority and names, never secret plaintext. |
| Effective policy | Liskov immutable record and proof surfaces | Server-resolved, digest-bound execution contract. |
| Secret plaintext at entry | Your browser and briefly PROOF over TLS | v1 uses server-wrap ingestion; PROOF can observe plaintext during wrapping. |
| Stored managed secret | Liskov encrypted envelope | Plaintext is not persisted; metadata and ciphertext remain. |
| Job secret delivery | Liskov secrets service and processor TEE | Re-encrypted into a job/identity/policy/expiry-bound grant. |
| Application logs | Job before encryption; authorized Liskov read path after decryption | Customer code chooses content; never log secrets. |
| Runtime diagnostics | Processor identity signs bounded events | Supports identity/health claims, not business correctness. |
| Customer balance | Liskov Service Credit ledger | Reads are supported; Stripe checkout and issuance remain release-gated. The customer has no Acurast crypto wallet. |
| Network spend authority | Effective policy plus Liskov managed custody | Bounded by caps, quote/reserve, and server controls. |

## Trusted execution environment

A trusted execution environment (TEE) is hardware-isolated execution on the
processor. It protects job execution from ordinary phone software and provides
identity/signing capabilities used by Liskov. It does not make arbitrary code
safe, validate an external API, or prevent your own process from leaking a
secret.

## Private source is not private deployed code

A private GitHub repository controls who can read the source repository. It
does not make an unencrypted IPFS deployment bundle private. The reviewed
reusable pin action requires `encryption.mode: none`, and the current runtime
does not fetch, verify, decrypt, and load a separate private code payload.

A future JavaScript path needs a small public loader followed by job-authorized
delivery or decryption of exact digest-bound Application bytes. A future Cargo
path can keep the public IPFS bootstrap free of customer code and authorize the
later rootfs fetch. Because processors may satisfy that fetch from a local
digest cache, private code inside the image also requires Acurast to authorize
cache reuse and release of that cached digest to the exact job or tenant. The
concern is not that one job can directly read another job's private directory:
Android keeps processor storage app-private, and the rootfs is extracted per
execution. The unresolved boundary is whether the trusted processor may
re-materialize the
same cached digest into a different requesting job's sandbox without repeating
the artifact-entitlement decision. Neither path is a supported v1 private-code
capability today.

## Managed secret detail

The browser sends a value to PROOF over TLS. The server wraps it, stores only
the encrypted envelope, and later selects a version for a job-bound grant. The
runtime verifies the grant and installs the declared environment or file
destination inside the TEE.

This is intentionally different from a client-sealed zero-knowledge design.
Do not claim that plaintext never reaches PROOF.

## External boundaries

GitHub, IPFS/Acurast, Telegram, and any API your workload calls have
their own identities, availability, terms, logs, and costs. Liskov evidence
should identify the crossing; it cannot absorb those parties into its trust
boundary. Stripe will be an external boundary when customer checkout is
released; its presence in the Console or implementation is not availability.

See [Attestation and the proof chain](./attestation.md) for what each evidence
link supports.
