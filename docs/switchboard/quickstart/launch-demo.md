---
title: Launch The Demo
description: Run the bundled Switchboard proof page.
---

# Launch The Demo

`proof switchboard launch-demo` deploys the supported Switchboard Express demo and
prints a public HTTPS URL.

Use it before deploying your own app. It proves the whole path with a known
runtime: Acurast deployment, Hub quote funding, job-signed registration,
job-owned TLS, gateway route activation, and validation.

## What It Deploys

The demo project depends on `@proofcomputer/switchboard-express-demo`. The
running app exposes:

- a proof page at `/`
- `GET /health`
- `GET /status`
- `GET /.well-known/proofcomputer/challenge?nonce=<value>`

The proof page shows route state, Acurast job identity, Hub registration,
job-owned certificate details, challenge traffic, runtime details, deployment
observability, and redacted environment-presence diagnostics.

When the relay URL, deployment intent id, and intent token are present, the app
polls:

```text
GET /v1/deployment-intents/:intentId/observability
```

## Dry Run

Dry-run mode does not deploy, fund, mutate DNS, or create routes:

```fish
proof switchboard launch-demo --dry-run
```

Use it to check selected capacity, planned config, and quote preview behavior
before spend.

## Live Launch

```fish
proof switchboard launch-demo --yes-spend
```

`--yes-spend` is required because the command spends ACU for the Acurast job
and the configured Hub payment asset for the Switchboard ingress quote.

The command uses a fixed 3 minute Acurast start delay and auto-selects live
gateway capacity.

Useful options:

```fish
proof switchboard launch-demo --yes-spend --duration-minutes 60
proof switchboard launch-demo --yes-spend --ha
proof switchboard launch-demo --dry-run --json
```

## Required Upload Configuration

Live demo launches upload a bundle through the Acurast SDK submit path. Before
spend, make sure the required upload configuration is available:

```fish
set -gx ACURAST_IPFS_URL '<ipfs upload endpoint>'
set -gx ACURAST_IPFS_API_KEY '<ipfs upload api key>'
```

If these are missing, the CLI fails closed before creating the deployment
intent.

## Output

A successful run prints the public URL and writes a deployment report. The
relay readback is the authoritative hostname source.

Typical output includes:

```text
Demo ready
URL: https://<relay-allocated-hostname>/
Deployment: <acurast deployment id>
Session: 0x...
Processor: <acurast processor id>
Report: <path>
```

If the local command times out after remote progress, do not immediately rerun
with spend. Check state first:

```fish
proof switchboard deploy status
proof switchboard deploy doctor --report <report.json>
proof switchboard status --json
```

Use `deploy resume` only when `deploy status` or `deploy doctor` reports a
safe single-replica recovery action.
