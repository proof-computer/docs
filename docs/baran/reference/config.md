---
title: Config Reference
description: Project config, contexts, secrets, and overrides.
---

# Config Reference

Baran deliberately separates project config, local identity context,
secret values, and gateway/admin config.

## Project Files

Created by `proof baran init`:

```text
baran.json
.baran/
```

`baran.json` stores directory-local project defaults such as project
name, context, and Acurast runtime settings. The public PROOF endpoint is
allocated during deployment; app builders do not choose hostnames under
PROOF-owned domains.

`.baran/` stores local deployment state, latest report pointers,
workflow snapshots, and local caches. Treat it as local state, not source code.

## User Contexts

Contexts live under the Baran home directory:

```text
~/.baran/contexts.json
~/.baran/secrets/<context>.env
```

Contexts store non-secret metadata and environment variable names, for example
`ACURAST_MAINNET_SEED` or `POLKADOT_SEED`, not the values.

The CLI auto-loads `~/.baran/secrets/<context>.env` when the selected
context exists. Override locations with:

```text
BARAN_HOME
BARAN_CONTEXT_SECRET_FILE
```

## Ops Profiles

PROOF/admin operations use a separate profile area:

```text
~/.baran/ops/<profile>/config.json
~/.baran/ops/<profile>/secrets.env
```

Inspect paths with:

```fish
proof baran ops paths mainnet
```

Normal app deploys should not require ops profiles.

## Common Environment Variables

Developer and payment context:

```text
ACURAST_NETWORK
ACURAST_MAINNET_SEED
ACURAST_MAINNET_ADDRESS
POLKADOT_ADDRESS
POLKADOT_SEED
DEVELOPER_PRIVATE_KEY
```

Gateway/admin context:

```text
OPERATOR_ID
```

`OPERATOR_ID` is for gateway operation and explicit capacity pinning. Normal
app deploys select available gateway capacity without requiring a gateway ID
in the builder context.

## DNS And ACME Authority

DNS-provider tokens for PROOF-managed zones, including Cloudflare tokens, are
PROOF infrastructure credentials. Normal app deploys and customer-domain
setup should not require `CLOUDFLARE_API_TOKEN` in a builder context or app
repository.

Network and manifest overrides:

```text
PROOF_NETWORK_MANIFEST_URL
PROOF_NETWORK_MANIFEST_SIGNER
PROOF_SERVICE_CATALOG_MAX_STALE_SECONDS
```

Live Acurast bundle upload:

```text
ACURAST_IPFS_URL
ACURAST_IPFS_API_KEY
```

Use overrides only when PROOF gives you alternate environment values or when
you are running a controlled local lab.

## Precedence

Command flags are the most explicit. Then selected context metadata and secret
files. Then process environment variables. Project config fills in defaults
for commands run inside a project directory.

If two sources disagree about signer identity, the CLI should fail before
spend rather than silently choosing the wrong account.

## Runtime Environment

Runtime environment delivered to Acurast jobs should be limited to values the
job needs for registration, certificate requests, health/status, challenge
responses, and observability. Developer payment seeds, DNS tokens, PROOF
control-plane tokens, recorder keys, and gateway secrets do not belong in app
runtime env.
