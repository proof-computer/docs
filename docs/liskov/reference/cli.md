---
title: CLI
description: Public proof liskov v1 command tree, confirmations, machine-readable output, and safe automation rules.
---

# CLI

The active Liskov plugin is `@proof-computer/proof-cli-liskov` `0.3.3` and
requires Node.js 22 or later. All commands begin with `proof liskov`.

```bash
npm install --global @proof-computer/proof-cli
proof plugins install @proof-computer/proof-cli-liskov
proof liskov --help
```

## Session

| Command | Effect |
| --- | --- |
| `login` | Start browser-confirmed GitHub login. Use `--no-browser` to print the verification URL. |
| `whoami` | Read current identity and selected organization. |
| `logout` | Remove the local session. |

Login stores a bearer token in an XDG-style local file with restricted
permissions and never prints token material. `--config PATH` selects another
session file.

## Organizations and billing

| Command | Effect |
| --- | --- |
| `organization list` | List readable organizations. |
| `organization use ORG_ID` | Select the organization for this session. |
| `organization billing ORG_ID` | Read plan and billing projection. |
| `organization service-credits ORG_ID` | Read available, reserved, and used Service Credits. |
| `organization billing transactions ORG_ID` | Page through ledger transactions with `--limit` and `--before`. |

These commands are read-only. Organization creation, invitations, plan change,
and Stripe funding are Console tasks.

## Application reads

| Command | Effect |
| --- | --- |
| `application list` | List readable Applications. |
| `application status APPLICATION_ID` | Read customer-facing Application state. |
| `application activity APP_REF` | Read activity; accepts `--limit` and `--before`. |
| `application action-plan APP_REF` | Read current blockers and supported actions. |
| `application secrets APPLICATION_ID` | Read declared secret requirements, never values. |
| `application plans APPLICATION_ID` | Advanced effective-policy/plan inspection. |
| `application deployment status APP_REF` | Advanced deployment evidence. |
| `application artifact-pin list APP_REF` | Advanced artifact-version evidence. |

An `APP_REF` can be the accepted Application UID, name, or ID. Prefer the UID
for automation and support.

## Authoring and publication

| Command | Important flags and behavior |
| --- | --- |
| `application manifest validate --file PATH` | Strict local V4 validation; read-only. |
| `application import --file PATH` | Import/update a local draft; never publishes. |
| `application import --github OWNER/REPO:PATH@REF --server-fetch` | Ask Liskov to fetch and import the GitHub draft. |
| `application publish APP_REF --artifact-version ID --dry-run` | Read-only publication preflight for a build release. |
| `application publish APP_REF --artifact-version ID --yes` | Publish after fresh preflight and authored-digest race check. |
| `application set-repository APP_REF OWNER/REPO` | Preview by default; `--yes` confirms. |
| `application rename APP_REF DISPLAY_NAME` | Preview by default; `--yes` confirms. |

Pinned releases do not require `--artifact-version`. `--paused --reason TEXT`
can atomically leave a newly published policy paused when that deliberate
workflow is needed.

## Operations

| Command | Behavior |
| --- | --- |
| `application action-plan retry APP_REF --decision-id ID --reason TEXT --yes` | Perform the supported bounded retry for one current decision. |
| `application pause APP_REF --reason TEXT` | Read preview; add `--yes` to stop future planning. |
| `application resume APP_REF --reason TEXT` | Read preview; add `--yes` to resume future planning. |
| `application retire APP_REF` | Read retirement preview/state; add `--reason` and `--yes` to start when available. |
| `application retire cancel APP_REF` | Read cancellation preview; add `--yes` to cancel while allowed. |

Pause and retirement do not force-stop existing Acurast jobs.

## Common flags and automation

- `--json` emits machine-readable output and never token material.
- `--help` shows generated help for the installed version.
- `--config PATH` selects a session file.
- Mutations either preview/read by default or require an explicit `--yes`.

In automation, parse stable IDs, codes, booleans, and timestamps from `--json`;
do not scrape human labels. Stop on a nonzero exit. Never repeat a mutation
until you have read the resulting state.

The installed plugin also contains platform, compatibility, and recovery
commands. Their presence is not a supported customer contract; they are
intentionally omitted here.
