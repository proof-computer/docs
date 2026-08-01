---
title: CLI
description: Public proof liskov v1 command tree, confirmations, machine-readable output, and safe automation rules.
---

# CLI

The active Liskov plugin is `@proof-computer/proof-cli-liskov` `0.6.0` and
requires Node.js 22 or later. All commands begin with `proof liskov`.

```bash
npm install --global @proof-computer/proof-cli
proof plugins install @proof-computer/proof-cli-liskov@0.6.0
proof liskov --help
```

## Session

| Command | Effect |
| --- | --- |
| `login` | Start browser-confirmed GitHub login. Use `--no-browser` to print the verification URL. |
| `whoami` | Read current identity, effective organization, and persistent session organization. |
| `logout` | Remove the local session. |

Login stores a bearer token in an XDG-style local file with restricted
permissions and never prints token material. `--config PATH` selects another
session file.

## Organizations and billing

| Command | Effect |
| --- | --- |
| `organization list` | List readable organizations. |
| `organization use [SELECTOR]` | Persistently select the organization for this session. |
| `organization billing [SELECTOR]` | Read plan and billing projection. |
| `organization service-credits [SELECTOR]` | Read available, reserved, and used Service Credits. |
| `organization billing transactions [SELECTOR]` | Page through ledger transactions with `--limit` and `--before`. |

These commands are read-only. Customer plan changes, terms acceptance, Stripe
checkout, and new Service Credit issuance are release-gated; a Console control
does not make them supported. `organization use` changes the persistent
organization for the session.

## Choose an organization for one command

Network-backed organization-scoped commands accept an exact organization ID
or slug without changing the session default:

```bash
proof liskov application list --organization proof
LISKOV_ORGANIZATION=proof proof liskov application status APPLICATION_UID
proof liskov whoami --organization proof
```

The precedence is an existing positional selector, then `--organization`, then
`LISKOV_ORGANIZATION`, then the persistent session organization. A selector is
required from one of those first three sources for billing and Runtime SSH
integration routes. `organization use [SELECTOR]` accepts the
same inputs but is persistently mutating by definition. `organization list`
is always unscoped.

Selectors are trimmed and matched exactly, with an ID match before a slug
match. Slugs are case-sensitive. Empty values and values longer than 255 UTF-8
bytes fail locally. The flag has no short alias. Login/logout, admin/access
commands, local manifest validation, and local workflow generation do not
accept it.

Under an override, human `whoami` labels both the effective organization and
the persistent organization. JSON includes `organizationContext.source`,
`organizationContext.effective`, and `organizationContext.sessionDefault`.
The override is never written to the local session or an Application runtime
environment.

## Application reads

| Command | Effect |
| --- | --- |
| `application list` | List readable Applications. |
| `application status APPLICATION_ID` | Read customer-facing Application state. |
| `application activity APP_REF` | Read activity; accepts `--limit` and `--before`. |
| `application logs APP_REF` | Read recent managed Application logs. |
| `application action-plan APP_REF` | Read current blockers and supported actions. |
| `application secrets APPLICATION_ID` | Read declared secret requirements, never values. |
| `application plans APPLICATION_ID` | Advanced effective-policy/plan inspection. |
| `application deployment status APP_REF` | Advanced deployment evidence. |
| `application artifact-pin list APP_REF` | Advanced artifact-version evidence. |

An `APP_REF` can be the accepted Application UID, name, or ID. Prefer the UID
for automation and support.

### Application log flags

```bash
proof liskov application logs APP_REF \
  --limit 100 \
  --deployment DEPLOYMENT_ID \
  --job JOB_ID \
  --origin runtime-ssh
```

`--limit` accepts 1–500. `--deployment` and `--job` can be combined. Origin is
`all`, `customer`, or `runtime-ssh`; the last value is shown as **Runtime SSH**
in human output. There is no follow/tail or time-pagination flag.

`--json` emits the core Liskov `/logs` response. Human output prints the count,
timestamp, normalized level, product origin, job ID, and message. Control and
terminal escape characters in messages are escaped. An authenticated degraded
response exits zero and reports its stable availability reason; authentication,
transport, and malformed-response failures exit nonzero.

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
| `application retire APP_REF` | Read retirement preview/state; add `--reason` and `--yes` to start. |
| `application retire cancel APP_REF` | Read cancellation preview; add `--yes` to cancel while allowed. |

Pause and retirement do not force-stop existing Acurast jobs.

## Common flags and automation

- `--json` emits machine-readable output and never token material.
- `--help` shows generated help for the installed version.
- `--config PATH` selects a session file.
- `--organization SELECTOR` selects an exact ID or slug for one scoped command;
  `LISKOV_ORGANIZATION` is its lower-precedence environment input.
- Mutations either preview/read by default or require an explicit `--yes`.

In automation, parse stable IDs, codes, booleans, and timestamps from `--json`;
do not scrape human labels. Stop on a nonzero exit. Never repeat a mutation
until you have read the resulting state.

The installed plugin also contains platform, compatibility, and recovery
commands. Their presence is not a supported customer contract; they are
intentionally omitted here.
