---
title: CLI Reference
description: Command names, flags, and mutation boundaries.
---

# CLI Reference

Switchboard commands are available through the PROOF CLI plugin.

```fish
proof switchboard --help
```

## Primary Commands

| Command | Purpose | Mutates or spends |
| --- | --- | --- |
| `init` / `project init` | create `switchboard.json` and `.switchboard/` | local files only |
| `project show` | inspect project config and latest state | no |
| `context add` | interactive context setup | local context file |
| `context set/use/list/current` | manage named contexts | local context file except list/current |
| `preflight` | check readiness | no |
| `launch-demo` | deploy bundled demo | yes with `--yes-spend` |
| `deploy` | deploy project workload | yes with `--yes` |
| `deploy status` | read workflow/report state | no |
| `deploy doctor` | diagnose deployment state | no |
| `deploy resume` | resume one local workflow | yes with `--yes` |
| `status` | diagnose deployment report | no |
| `claimable` | inspect released rewards | no |
| `claim` | withdraw released rewards | yes with signer and `--yes` |
| `refundable` | inspect developer refund state | no |
| `refund` | submit eligible developer refund | yes with signer and `--yes` |
| `hostname add/remove` | mutate customer hostname route/cert state | yes with developer signature |
| `hostname status` | inspect customer hostname state | no |
| `gateway setup` | prepare or launch gateway host config | local host and optional admission |
| `gateway discover` | inspect manager-scoped capacity | no unless writing env |
| `gateway status` | inspect gateway host state | no |
| `gateway upgrade` | pull and recreate gateway stack | yes with `--yes` |

## Advanced Commands

Run:

```fish
proof switchboard --help --advanced
```

Advanced surfaces include:

- `session register/status/refund/refundable`
- `validator launch/script`
- `catalog build/inspect/verify/set-state`
- PROOF support DNS context commands, such as `context dns set/clear`
- relay and bootstrap admin commands
- ops profile commands under `ops`

Use advanced mutating commands only from runbooks or PROOF support. For normal
deploys, stay on `launch-demo`, `deploy`, `status`, `hostname`, and
read-only diagnostics.

## Common Flags

```text
--project-dir <path>
--context <name>
--json
--manifest-url <url>
--manifest-signer <signer>
--allow-expired-manifest
--relay-url <url>
```

Payment and signing flags include:

```text
--polkadot-signer <seed|ledger>
--hub-signer <evm|polkadot>
--polkadot-address <address>
--polkadot-seed <uri>
--ledger
--ledger-mode <generic|legacy>
--ledger-account <n>
--ledger-address-index <n>
--ledger-metadata-chain-id <id>
```

## JSON Output

Many read-only commands support `--json`:

```fish
proof switchboard preflight --quote --json
proof switchboard status --json
proof switchboard deploy status --json
proof switchboard deploy doctor --report report.json --json
proof switchboard hostname status app.example.com --json
proof switchboard validator script --json
proof switchboard catalog inspect --url '<catalog url>' --json
```

JSON output should be redacted by default. Do not paste raw deployment reports
or logs into public issues without checking for hostnames, addresses, runtime
details, or operational context.

## Spend Confirmations

- `launch-demo` spends only with `--yes-spend`.
- `deploy` spends only with `--yes`.
- `claim` and `refund` submit transactions only with signer material and
  confirmation.
- `claimable`, `refundable`, `status`, `deploy status`, `deploy doctor`,
  `hostname status`, `validator script`, `catalog inspect`, and
  `catalog verify` are read-only.
