---
title: Customer Domains
description: Customer hostname and DNS delegation content target.
---

# Customer Domains

After a Switchboard endpoint is live, you can attach a hostname you control.

Switchboard keeps the canonical endpoint under a PROOF-managed beta domain and
adds your customer hostname as an additional route and certificate name.

## Modes

Default mode is PROOF-managed ACME with stable `_acme-challenge` CNAME
delegation:

```fish
set -gx DEVELOPER_PRIVATE_KEY '<evm key matching the funded session developer>'

switchboard hostname add app.example.com --wait
switchboard hostname status app.example.com
```

Manual DNS-01 keeps PROOF ACME issuance but asks you to manage the transient
TXT challenge value:

```fish
switchboard hostname add app.example.com --manual-dns01
switchboard hostname status app.example.com
```

BYO TLS configures routing only. Your Acurast job must serve a valid
certificate and private key for the customer hostname:

```fish
switchboard hostname add app.example.com --byo-tls
```

## What DNS Records Do

The CLI prints two kinds of records:

- Traffic CNAME: points `app.example.com` at the canonical Switchboard
  endpoint.
- ACME delegation: points `_acme-challenge.app.example.com` at the stable
  validation name Switchboard provides.

The CLI may also print DNS control-panel hints from public NS records. Treat
these as convenience hints. Relay validation is authoritative.

## Signer Boundary

Customer hostname changes require a developer signature matching the funded
session developer.

For EVM-funded sessions, provide:

```fish
set -gx DEVELOPER_PRIVATE_KEY '<developer evm private key>'
```

For native Polkadot-funded sessions, the CLI can use the mapped Polkadot
signer from the selected context or explicit `--polkadot-seed` and
`--polkadot-address` flags.

## Status And Removal

```fish
switchboard hostname status app.example.com
switchboard hostname remove app.example.com
```

`hostname status` is read-only. It reports DNS, certificate authorization, and
readiness state without changing the relay or gateway.

## Trust Boundary

Operators do not receive Cloudflare tokens, customer DNS tokens, ACME account
private keys, PROOF canonical-zone write authority, recorder keys, or relayer
keys. In the default mode, application TLS still terminates inside the Acurast
job.

Only attach hostnames you control. Do not use Switchboard for illegal content,
attacks, abuse, phishing, spam, malware, or platform evasion.
