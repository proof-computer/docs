---
title: Deployment Lifecycle
description: Switchboard deployment lifecycle content target.
---

# Deployment Lifecycle

Switchboard deploys cross local signing, Acurast compute, Hub funding, relay
coordination, DNS, certificate issuance, gateway routing, and validator
evidence. Diagnose failures by stage.

## 1. Local Project And Context

`switchboard init` writes directory-local project config:

```text
switchboard.json
.switchboard/
```

Named contexts live under `~/.switchboard/` and point at environment variable
names for secrets.

## 2. Preflight

`switchboard preflight --quote` checks the local and network prerequisites
before spend:

- signed network manifest
- control-plane health
- Hub RPCs
- Acurast deploy identity
- Polkadot payment identity
- accepted quote asset
- DNS authority
- deploy runner availability

## 3. Dry Run

Dry runs inspect the plan without deploying, funding, creating DNS, or
mutating routes:

```fish
switchboard launch-demo --dry-run
switchboard deploy --yes --dry-run --json
```

`deploy --yes --dry-run` accepts `--yes` because it exercises the deployer
confirmation path, but dry-run still avoids side effects.

## 4. Acurast Deployment

The CLI prepares the runtime bundle and submits the job to Acurast. Node
webserver deploys use the Node runtime path. Script/Cargo SSH deploys use the
Shell runtime and require processors advertising Shell support.

For live bundle upload, the Acurast SDK path may require:

```fish
set -gx ACURAST_IPFS_URL '<ipfs upload endpoint>'
set -gx ACURAST_IPFS_API_KEY '<ipfs upload api key>'
```

## 5. Hub Quote Funding

The control plane returns a signed quote. The CLI checks the quote and funds
the Hub registry through the accepted payment asset. This is separate from
Acurast compute spend.

## 6. Job-Signed Registration

After the Acurast job starts, it signs the Switchboard registration material.
The relay can submit that material and pay Hub gas, but it should not be able
to forge job authority.

## 7. DNS And Job-Owned TLS

Switchboard provisions DNS for the canonical endpoint. The job requests its
own certificate through CSR plus DNS-01 authorization and keeps the TLS private
key inside the Acurast runtime.

Customer hostnames add another DNS and certificate authorization layer.

## 8. Gateway Route Activation

The gateway does L4/SNI passthrough. Deployment-intent route targets are based
on fresh signed gateway upstream admission, not arbitrary job health metadata.

## 9. Validation And Settlement

Validators probe the public endpoint and challenge path. Settlement is batched
into scheduler windows; validators may report more frequently than Hub
fulfillment is written.

## 10. Readback And Recovery

Start with read-only commands:

```fish
switchboard status
switchboard deploy status
switchboard deploy doctor --report <report.json>
```

Use `deploy resume --yes` only when local workflow state says a single-replica
resume is safe. The CLI refuses late funding by default unless
`--allow-late-funding` is explicit.
