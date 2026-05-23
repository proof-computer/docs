---
title: Config Reference
description: Switchboard configuration content target.
---

# Config Reference

Switchboard deliberately separates project config, local identity context,
secret values, and operator/admin config.

## Project Files

Created by `switchboard init`:

```text
switchboard.json
.switchboard/
```

`switchboard.json` stores directory-local project defaults such as project
name, endpoint, context, and Acurast runtime settings.

`.switchboard/` stores local deployment state, latest report pointers,
workflow snapshots, and local caches. Treat it as local state, not source code.

## User Contexts

Contexts live under the Switchboard home directory:

```text
~/.switchboard/contexts.json
~/.switchboard/secrets/<context>.env
```

Contexts store non-secret metadata and environment variable names, for example
`ACURAST_MAINNET_SEED` or `POLKADOT_SEED`, not the values.

The CLI auto-loads `~/.switchboard/secrets/<context>.env` when the selected
context exists. Override locations with:

```text
SWITCHBOARD_HOME
SWITCHBOARD_CONTEXT_SECRET_FILE
```

## Ops Profiles

PROOF/admin operations use a separate profile area:

```text
~/.switchboard/ops/<profile>/config.json
~/.switchboard/ops/<profile>/secrets.env
```

Inspect paths with:

```fish
switchboard ops paths mainnet
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
OPERATOR_ID
CLOUDFLARE_API_TOKEN
DEVELOPER_PRIVATE_KEY
```

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

Use overrides only when PROOF gives you alternate beta values or when you are
running a controlled local lab.

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
