---
title: Trust Model
description: Who holds keys and authority in a Liskov deployment.
---

# Trust Model

Liskov's trust model keeps your code and secrets sealed to the enclave and your
runtime identity inside the Acurast job, while using PROOF infrastructure only to
coordinate deployment, funding, and ingress.

## Who Holds What

| Actor | Holds | Does not hold |
| --- | --- | --- |
| Developer machine | local context, payment signer, deploy inputs | PROOF control-plane / recorder keys |
| Acurast job (TEE) | runtime config, job signer, TLS private key, decrypted secrets | developer payment seed |
| PROOF control plane | signed policy + manifest, quote service, registration submission path | job TLS private key, secret plaintext |
| Baran gateway | route state, Envoy config, capability reporting | DNS zone authority, app secrets |
| Validators | route-open evidence signing material | developer app secrets |

## Code Boundary

Your application code is plaintext only in two places: your repository and inside
the TEE. In transit it is ciphertext. Liskov ships the encrypted artifact to the
phone; the loader decrypts it inside the enclave.

## Secret Boundary

Secrets are sealed to the enclave before they leave your machine and are
delivered through [Lockbox](../guides/sealed-secrets.md). The control
plane stores sealed-secret records and digests — never plaintext. The job
decrypts secrets inside the TEE and injects them as the environment variables
your policy declares.

## TLS Boundary

The Acurast job generates and holds its TLS private key and terminates HTTPS
itself. The Baran gateway performs L4/SNI passthrough and never sees the
application TLS session key.

## Funding Boundary

The CLI verifies the signed manifest and requests a signed quote, then funds the
registry through the accepted asset. Spend is always behind an explicit
`--yes-spend` gate, after a quote you have seen.

## What Must Not Be In Your Repo

Keep these out of source control — Liskov delivers them through context files,
environment variables, or sealed secrets:

- Acurast seed / mnemonic
- Polkadot payment seed
- EVM developer private key
- DNS / Cloudflare API tokens
- PROOF control-plane bearer tokens
- Validator signing seeds and gateway admission tokens
- ACME account private keys
