---
title: Deployment Failures
description: Diagnose failed preflight, deploy, funding, and route stages.
---

# Deployment Failures

Deployment failures are easier to handle when you name the failing stage first.

## Start Read-Only

```fish
proof switchboard deploy status
proof switchboard deploy doctor --report <report.json>
proof switchboard status --json
```

If you do not have a report path, check `.switchboard/` in the project
directory.

## Preflight Fails

Run:

```fish
proof switchboard preflight --quote --json
```

Common causes:

- selected context is missing
- Acurast seed is invalid
- expected Acurast address does not match the seed
- Polkadot payment address or seed is missing
- Hub RPC is unreachable
- accepted payment asset balance is low
- deploy runner or local package artifacts are missing

Fix preflight before running a spend command.

## Missing Acurast Upload Config

Live `launch-demo` and some deploy paths use the Acurast SDK submit adapter
and need upload config before spend:

```fish
set -gx ACURAST_IPFS_URL '<ipfs upload endpoint>'
set -gx ACURAST_IPFS_API_KEY '<ipfs upload api key>'
```

When these are missing, the CLI should fail closed before deployment-intent
creation.

## Quote Or Funding Fails

A signed quote must match the chain ID, registry, developer, accepted asset,
and session terms. If funding fails:

```fish
proof switchboard preflight --quote --json
proof switchboard refundable --session-id <bytes32> --json
```

Do not assume refundability until the read-only command says the session is
eligible.

## Acurast Deploy Fails

Check whether a deployment id was produced. If not, the failure may be
pre-chain and no ACU was spent. If a deployment id exists, diagnose from the
report and Acurast observation state.

For Script/Cargo SSH jobs, ensure the selected processor advertises the Shell
module and use:

```fish
proof switchboard deploy doctor --report <report.json> --probe
```

## Session Funded But Not Registered

The Acurast job has not completed job-signed registration. Check:

```fish
proof switchboard status --json
proof switchboard deploy doctor --report <report.json>
```

Likely causes include job startup failure, missing runtime env, relay
reachability from the job, or job signer mismatch.

## Local Timeout After Remote Progress

Local timeouts can happen after remote actions succeeded. Do not run another
spend command first.

```fish
proof switchboard deploy status
proof switchboard deploy doctor --report <report.json>
```

If the local private workflow state supports one safe recovery step:

```fish
proof switchboard deploy resume --yes
```

The CLI refuses late funding by default. Only use `--allow-late-funding` when
you understand the Acurast start/end window and the doctor output says that is
the intended recovery.

## Demo Did Not Complete

For demo runs, a failed command should print `Demo did not complete`, preserve
the report path, and exit nonzero. Use that report with `deploy doctor` or
`status` before retrying.
