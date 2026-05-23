---
title: Trust Model
description: Switchboard trust boundary content target.
---

# Trust Model

Switchboard's trust model is built around keeping application TLS and runtime
identity inside the Acurast job while using PROOF infrastructure for ingress
coordination.

## Who Holds What

| Actor | Holds | Does not hold |
| --- | --- | --- |
| Developer machine | local context, payment signer, deploy inputs | PROOF relay/recorder keys |
| Acurast job | runtime config, job signer, TLS private key | developer payment seed |
| PROOF relay | signed manifest, quote service, registration submission path | job TLS private key |
| Gateway host | route state, Envoy config, capability reporting | DNS zone authority, recorder keys |
| Validators | route-open evidence signing material | developer app secrets |

## TLS Boundary

In the default path, the gateway performs L4/SNI passthrough. It routes based
on the SNI name but does not terminate the application TLS session.

The Acurast job:

- generates its TLS private key
- creates a CSR
- signs the certificate request through job authority
- receives the certificate material
- terminates HTTPS locally

For BYO TLS customer hostnames, the job still serves the certificate and key.
Switchboard only routes traffic.

## Registration Boundary

The relay may submit registration material to Hub, but the registration is
authorized by the job. The relay should not be able to invent a job
registration without the expected job signature.

The gateway route target for deployment-intent routes comes from fresh signed
gateway upstream admission. Job health and runtime HTTPS metadata are
readiness and observability signals, not route authority.

## Funding Boundary

The CLI verifies the signed network manifest and requests a signed quote. It
then funds the Hub registry through the accepted asset path for the configured
developer account.

The quote is checked against:

- chain ID
- registry address
- developer
- accepted asset
- session/deployment terms

## Validation Boundary

Route-only fulfillment is not enough for a paid launch. Validators probe the
public endpoint and challenge path, then submit signed evidence. Activation
and settlement are gated on the configured validation and scheduler policy.

Validators may report frequently, but production settlement is batched into
windows rather than written for every probe.

## Secrets That Do Not Belong In App Repos

Do not commit or bundle:

- Acurast mnemonic or seed
- Polkadot payment seed
- EVM developer private key
- Cloudflare or DNS tokens
- PROOF control-plane bearer tokens
- PROOF relayer or recorder keys
- validator signing seeds
- operator gateway admission or route-state tokens
- ACME account private keys

Switchboard contexts store environment variable names and non-secret metadata,
not the secret values themselves.
