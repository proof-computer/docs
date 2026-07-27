---
title: CLI
description: The proof liskov command tree.
---

# CLI

All Liskov commands are subcommands of `proof liskov`. Read-only commands never
spend; only `custody execution run-one --yes-spend` moves money.

```text
proof liskov
├── login                                  open a browser-confirmed CLI session
├── whoami                                 print the current session identity
├── logout                                 clear local session state
├── application
│   ├── list                               list your applications
│   ├── status <APP>                       show one application's state
│   ├── plans <APP>                        list policy versions and plan items
│   ├── manifest validate --file <PATH>     validate an authored V4 manifest
│   ├── import --github <repo:path@ref>     import a manifest draft
│   └── publish <APP> [flags]               preflight or publish an effective policy
└── custody
    ├── preflight <APP>                     validate budget/secrets/ingress → quote
    └── execution
        └── run-one <APP> [flags]           launch exactly one execution
```

## Session

| Command | Description |
| --- | --- |
| `proof liskov login` | Open a browser-confirmed session and save a local bearer token. |
| `proof liskov whoami` | Read the session file, call the control plane, print identity. |
| `proof liskov logout` | Remove local session state. |

## Applications

| Command | Description |
| --- | --- |
| `proof liskov application list` | List applications for your session. |
| `proof liskov application status <APP>` | Show an application's current state. |
| `proof liskov application plans <APP>` | List published policy versions and derived plan items. |
| `proof liskov application manifest validate --file <path>` | Validate a strict V4 manifest and print authored/release-intent digests. |
| `proof liskov application import --github <owner/repo:path@ref> --server-fetch` | Import/update a manifest draft. Import never publishes. |
| `proof liskov application import --file <path>` | Import a local manifest draft. |
| `proof liskov application publish <APP> --artifact-version <id> --dry-run` | Run read-only publication preflight for a build release. |
| `proof liskov application publish <APP> --artifact-version <id> --yes` | Publish after repeating preflight with an authored-digest race fence. |

Pinned releases do not require `--artifact-version`. Actual publication always
requires `--yes`; `--dry-run` never writes.

## Custody

| Command | Description |
| --- | --- |
| `proof liskov custody preflight <APP>` | Validate budget, secrets, and ingress; return a signed quote. No spend. |
| `proof liskov custody execution run-one <APP>` | Launch exactly one custody execution. |

### `run-one` flags

| Flag | Description |
| --- | --- |
| `--yes-spend` | Required to actually fund and launch. Stricter than `--yes`. |
| `--plan-item-id <id>` | Target a specific plan item. |
| `--idempotency-key <key>` | Make a retried launch safe to repeat. |
| `--override-replacement-hold --reason <text>` | Clear a [replacement hold](../troubleshooting/replacement-holds.md) deliberately, with a reason. |

## Global Flags

| Flag / variable | Description |
| --- | --- |
| `--json` | Machine-readable output. Never prints token material. |
| `--config <path>` | Override the session file location. |
| `PROOF_LISKOV_SESSION_FILE` | Environment override for the session file (XDG-style, written `0600`). |
