---
title: Customer Domains
description: Attach a hostname you control.
---

# Customer Domains

After a Baran endpoint is live, you can attach a hostname you control.

Baran keeps the canonical endpoint under a PROOF-managed domain and
adds your customer hostname as an additional route and certificate name.

## Use Your Baran Context

Run customer-domain commands from your Baran project directory. The
project supplies the endpoint and session state, and the selected Baran
context supplies relay, network, and signer defaults.

The CLI selects context in this order: `--context`, `BARAN_CONTEXT`,
the project `baran.json`, then the current context selected with
`proof baran context use`.

```fish
proof baran context current
```

If your builder context already points at the right signing environment, you
do not need to pass a signer on every hostname command. To make a one-command
override explicit, add `--context mainnet`.

## Modes

Default mode is PROOF-managed ACME with stable `_acme-challenge` CNAME
delegation. This uses the selected context:

```fish
proof baran hostname add app.example.com --wait
proof baran hostname status app.example.com
```

For a one-command context override:

```fish
proof baran hostname add app.example.com --context mainnet --wait
proof baran hostname status app.example.com --context mainnet
```

Manual DNS-01 keeps PROOF ACME issuance but asks you to manage the transient
TXT challenge value:

```fish
proof baran hostname add app.example.com --manual-dns01
proof baran hostname status app.example.com
```

BYO TLS configures routing only. Your Acurast job must serve a valid
certificate and private key for the customer hostname:

```fish
proof baran hostname add app.example.com --byo-tls
```

## What DNS Records Do

The CLI prints two kinds of records:

- Traffic CNAME: points `app.example.com` at the canonical Baran
  endpoint.
- ACME delegation: points `_acme-challenge.app.example.com` at the stable
  validation name Baran provides.

The CLI may also print DNS control-panel hints from public NS records. Treat
these as convenience hints. Relay validation is authoritative.

## Signer Boundary

Customer hostname changes require a developer signature matching the funded
session developer.

For EVM-funded sessions, prefer storing the environment variable name in your
Baran context, not putting the key in project files or command history:

```fish
proof baran context set mainnet --use --developer-private-key-env DEVELOPER_PRIVATE_KEY
```

The secret value can live in your shell or in
`~/.baran/secrets/mainnet.env`.

For native Polkadot-funded sessions, use the mapped Polkadot signer from the
selected context:

```fish
proof baran context set mainnet --use --polkadot-seed-env POLKADOT_SEED --polkadot-address-env POLKADOT_ADDRESS
```

Use explicit `--developer-private-key`, `--polkadot-seed`, or
`--polkadot-address` flags only for one-off overrides.

## Status And Removal

```fish
proof baran hostname status app.example.com
proof baran hostname remove app.example.com
```

`hostname status` is read-only. It reports DNS, certificate authorization, and
readiness state without changing the relay or gateway.

## Trust Boundary

Gateway operators do not receive Cloudflare tokens, customer DNS tokens, ACME
account private keys, PROOF canonical-zone write authority, recorder keys, or
relayer keys. In the default mode, application TLS still terminates inside the
Acurast job.

Only attach hostnames you control. Do not use Baran for illegal content,
attacks, abuse, phishing, spam, malware, or platform evasion.
