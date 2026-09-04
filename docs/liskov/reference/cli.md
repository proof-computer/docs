---
title: CLI
description: Public proof liskov v1 command tree, confirmations, machine-readable output, and safe automation rules.
---

# CLI

The active Liskov plugin is `@proof-computer/proof-cli-liskov` `0.9.0` and
requires Node.js 22 or later. All commands begin with `proof liskov`.

```bash
npm install --global @proof-computer/proof-cli
proof plugins install @proof-computer/proof-cli-liskov@0.9.0
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
| `application logs APP_REF` | Read managed Application logs: recent by default, streamed live with `--follow`, or the full retained history with `--from-start`. |
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

```bash
proof liskov application logs APP_REF --follow --event 'runtime.access.*'
proof liskov application logs APP_REF --from-start --ndjson
```

`--limit` accepts 1–500 and bounds one page. `--deployment` and `--job` can be
combined. Origin is `all`, `customer`, or `runtime-ssh` (also accepted as
`runtime_ssh`); Runtime SSH records are shown as **Runtime SSH** in human
output.

`--follow` streams new records until interrupted: it attaches at the newest
record, then polls forward every two seconds without losing records.
`--from-start` pages through the full retained history oldest-first with
cursor pagination. `--event GLOB` filters on the record `event` field; `*`
matches any run of characters. `--ndjson` emits one raw record JSON object per
line and works one-shot or with either streaming flag. A streaming read can
return slightly more than `--limit` records per page because whole batches are
kept together; no record is lost between pages.

`--json` emits the core Liskov `/logs` response verbatim and is mutually
exclusive with `--follow`, `--from-start`, `--ndjson`, and `--event`. Human
output prints the count, then `TIMESTAMP LEVEL ORIGIN JOB_ID INSTANCE MESSAGE`
columns — INSTANCE is the record's `runtimeInstanceId` (`-` when absent),
identifying which runtime instance wrote the record — and ends with an
`Origins: customer N, runtime_ssh M.` footer from the response summary.
Control and terminal escape characters in messages are escaped. An
authenticated degraded response exits zero and reports its stable availability
reason; authentication, transport, and malformed-response failures exit
nonzero.

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

## Runtime SSH

| Command | Behavior |
| --- | --- |
| `ssh APP` | Open a shell in one of your running jobs. |
| `ssh APP --print-command --json` | Resolve and verify the connection without opening a session or consuming an access ticket. |
| `runtime-ssh operator-key add --name NAME --identity FILE` | Register the public half of an `ssh-ed25519` key in your organization's operator-key registry under a name. Only the public key is sent. `--public-key-file FILE` (or `-` for stdin) registers a public-key file instead. |
| `runtime-ssh operator-key list --json` | List the organization's registered operator keys with their fingerprints. |
| `runtime-ssh operator-key remove KEY_ID` | Remove a key from the registry **and withdraw its access** in one step. New connection requests and tickets for the key are refused at once and its unused tickets are revoked; a session already open drains. The response carries the `withdrawal`, the `revokedTicketCount`, and a `note` saying so. |
| `runtime-ssh withdrawn-key add --fingerprint SHA256:... --reason TEXT` | Withdraw one key's access by fingerprint, with nothing republished. Use it for a key that has no registry row, such as a key listed only in a Manifest V4 policy. `--identity FILE` names the key by its private-key path instead; only the derived public half is used. `--reason` is recorded on the withdrawal and in the activity feed. Repeating a withdrawal is safe: it reports `newlyWithdrawn: false` and changes nothing. |
| `runtime-ssh withdrawn-key list --json` | List the fingerprints whose access is withdrawn, each with its withdrawal ID, source key, reason, and time. |
| `runtime-ssh withdrawn-key remove WITHDRAWAL_ID` | Lift a withdrawal so the key can be authorized again. It does not re-register the key or add it to any manifest. |

`--identity` names the private key file; it is read locally and never sent.
`--deployment` and `--job` select an exact target when an Application has more
than one running job. `--accept-host-key` trusts a job's key on first use
without prompting, for automation; a **mismatch** on a job you already trusted
is always refused rather than re-prompted.

The first connection to a job prints its host key for confirmation and pins it.
Each connection consumes a one-time ticket, so a replayed ticket is rejected;
reconnecting issues a new one.

Every grant, session open, and session close is recorded in the Application
activity feed with the duration and bytes transferred. See
[Open a shell in a running job](../operate/runtime-ssh.md).

Registering a key **does not grant access** on its own. On a Manifest V4
Application, who may connect is exactly the
`ingress.ssh.provider.authorizedKeys` list in the published manifest, and the
registry is a named inventory beside it. On a retained V5 Application the
registry is snapshotted into each attachment when the attachment is created,
so a registered key reaches the next job, never a job already running.

Removing a key **withdraws its access**. The moment `operator-key remove` or
`withdrawn-key add` returns, no new connection request or ticket is granted
for that fingerprint and its unused tickets are revoked, on every Application
in the organization, with nothing republished. A session that is already open
is not cut: it **drains**, ending when the operator disconnects, when the job
ends, or at the relay's two-hour maximum session duration, whichever comes
first, and a connection that stops answering the relay's heartbeat is closed
after 60 seconds. Every withdrawal and reinstatement is recorded in the
activity feed with the number of tickets it revoked. Use `withdrawn-key add`
for a key that has no registry row; for a registered key, `operator-key remove`
withdraws it as part of removing it. `withdrawn-key remove` lifts a withdrawal
but does not re-register the key. Keys are `ssh-ed25519` only, names are
unique within an organization, and the registry holds at most 50 keys. All six
commands take an optional `ORGANIZATION_ID` argument and honour
`--organization` and `LISKOV_ORGANIZATION` like every organization-scoped
command.

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
