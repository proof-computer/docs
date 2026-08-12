---
unlisted: true
title: Application Manifest V5 reference
description: Every field of the V5 manifest — types, defaults, constraints, and what Liskov derives instead of asking you.
---

# Application Manifest V5 reference

:::danger[Not released]

V5 is **not v1** and is not available. This page is written as though the
contract were final so it can be reviewed before implementation begins.
[Capabilities and limits](./capabilities.md) remains the availability owner. The
shipping contract is [Application Manifest V4](./manifest-v4.md).

:::

For a guided introduction see
[Author an Application Manifest V5](../build/manifest-v5.md). This page is the
complete field list.

## Conventions

- **Required** fields are marked ✱. Everything else is optional.
- **Unknown fields are rejected.** There is no permissive mode.
- **Durations** are `<integer><unit>` with unit one of `ms`, `s`, `m`, `h`, `d`
  — `30s`, `6h`, `1d`. There is no unitless form and no `1mo`: a calendar month
  is 28–31 days, so an authored rate would mean different money in February than
  in July.
- **Byte sizes** follow the same one-unit-bearing-term rule: `B`, `KiB`, `MiB`,
  `GiB`, `TiB`, `KB`, `MB`, `GB`, `TB`. Binary and decimal suffixes both mean
  what they say. Unitless numbers are rejected.
- **Amounts** are exact integers as decimal **strings**, never numbers. Money
  does not go through a float.
- **Timestamps** are RFC 3339 with an explicit offset.
- Unions are tagged by a discriminator (`mode`, `kind`, `source`) and are
  **closed**.

## Document

| Field | Type | Notes |
| --- | --- | --- |
| `schema` ✱ | const | `proof.liskov.application-manifest` |
| `schemaVersion` ✱ | const | `5` |
| `applicationId` ✱ | string | Slug, **unique within your organization only**. Never a global identifier, and never safe to use alone as a join or attribution key |

## `metadata`

Authored-only, and absent from effective policy — nothing here affects
execution.

| Field | Type |
| --- | --- |
| `description` | string |
| `labels` | string[] |

## `release` ✱

Where the **application artifact** comes from. Tagged on `mode`.

| `mode` | Fields | Meaning |
| --- | --- | --- |
| `source` | — | Liskov builds it from the repository your source integration binds |
| `pinned` | `artifact.digest` ✱ | This exact artifact, by digest |

**Builder authority is not in the manifest.** Repository, refs, workflow and
manifest path live in the server-side source integration. A manifest fetched
*from* a repository cannot authorize its own builder — otherwise the document
being built would decide what may build it.

`release` governs your code. The **image** your code runs in is
`runtime.image`, and the two are separate: `mode: pinned` pins the artifact, not
the environment.

:::note[Why `source` and not `build`]

Renamed from `build` on 2026-08-12. Building is what the platform does; the
author is choosing *where the artifact comes from*. `pinned` is the other
answer, and neither is a verb the customer performs.

:::

## `runtime` ✱

Tagged on `kind`.

### `kind: javascript`

| Field | Type | Notes |
| --- | --- | --- |
| `engine` | enum | `nodejs` |
| `entrypoint.file` ✱ | path | Relative to the **immutable artifact root**, not to your repository |

### `kind: native_image`

| Field | Type | Notes |
| --- | --- | --- |
| `image.catalog` | string | Default `liskov-runtime-images`. Validated server-side against catalogue membership rather than against a closed list in the schema |
| `image.name` ✱ | string | |
| `image.version` ✱ | string | A version **floor**, resolved to an exact digest at publication and recorded in effective policy |
| `entrypoint.executable` ✱ | absolute path | |
| `entrypoint.args` | string[] | |

**No shell string is reparsed anywhere**, and there is no inline program body.
Shell logic is a file in your repository, built into the artifact, and invoked
as `/bin/sh /app/start.sh`.

## `execution` ✱

Tagged on `mode`. Three arms.

| `mode` | Fields | Meaning |
| --- | --- | --- |
| `once` | — | One occurrence |
| `continuous` | `until` | Runs indefinitely, renewed automatically |
| `interval` | `every` ✱, `until` | A fresh occurrence on a cadence |

`until` is an RFC 3339 termination **bound**, not a fourth arm — as its own mode,
"every six hours until Friday" would be inexpressible.

## `deployment` ✱

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `jobs` | integer | `1` | Simultaneous jobs |
| `schedule` ✱ | object | | Below |
| `placement` | object | | Below |
| `lifecycle` | object | | Below |
| `spend` ✱ | object | | Below |

`jobs` is named for what Liskov knows. Sixty-four `puppeteer` workers and three
Typesense members are the same number and nothing alike; `replicas` would assert
a relationship the platform cannot see.

### `deployment.schedule` ✱

| Field | Type | Notes |
| --- | --- | --- |
| `duration` ✱ | duration | One paid job window |
| `phasing` | union | `simultaneous` (default) or `evenly_spaced` |

`phasing: evenly_spaced` takes `jobsPerPhase` (default `1`), which must be in
`1..=jobs` **and divide `jobs` exactly** — Liskov never rounds and never leaves a
short final phase.

Launch timing — schedule lead and the processor start-within allowance — is a
platform-owned profile, not authored.

### `deployment.placement`

Omit it entirely for the common case: the open market plus the mandatory
current-evidence profile.

| Field | Type | Notes |
| --- | --- | --- |
| `minimums` | object | Minimum processor capability. At least one key |
| `evidence.profile` ✱ | string | One versioned profile replaces V4's per-metric array. Units, thresholds, age, sample counts, confidence and unknown-handling evolve together |
| `processorSelection` | union | `manager` (`managerId` ✱) or `exact` (`processorIds` ✱). Omitted means open market |
| `allow` | rule[] | Hard eligibility filters |
| `exclude` | rule[] | Any match removes the candidate |
| `spread` | item[] | Inter-job diversity |
| `distribution` | item[] | Exact allocation across dimension values |

**`minimums`** — a floor the processor must clear, enforced **on-chain** through
`RequiredMinMetrics` rather than by Liskov. At least one key; an empty block is
rejected because it reads like a constraint and is not one.

| Key | Type | Matched against |
| --- | --- | --- |
| `memory` | byte size | **Total** device RAM — not a budget reserved for your process |
| `storage` | byte size | **Available** free space |
| `cpuSingleCoreScore` | integer | Single-core benchmark score |
| `cpuMultiCoreScore` | integer | Multi-core benchmark score |

Byte sizes are one unit-bearing term — `4GiB`, `512MiB`, `100GB`. Binary and
decimal suffixes are both accepted and mean what they say. `4096` is rejected:
it is not a size, and reading it as MiB rather than bytes would be a guess.

**Selection headroom is derived, not authored.** Liskov requires more than you
ask for, because a benchmark score is not a guarantee — 1.1× on memory and
storage, 1.5× on the CPU scores. The effective floor is in effective policy.

Fails **closed**: a processor with no recent measurement for a constrained pool
is excluded, not assumed adequate.

**`allow` / `exclude`** — values within one rule are OR; rules over different
dimensions are AND. **At most one `allow` rule per dimension**, so there is no
hidden merge precedence to learn.

**`spread`** — `by` is `country`, `region`, `operator`, `manager` or `wan_ip`;
plus `minimumDistinct` and `strength` (`required` | `preferred`, default
`required`).

**`distribution`** — `by`, `values` ✱, `jobs` ✱. The `jobs` values must sum to
`deployment.jobs`.

:::warning[Both fail closed on unknown facts]

A processor whose country is unknown does **not** satisfy a country requirement,
and is **not** removed by a country exclusion. Treating unknown as "probably
fine" is how a three-node cluster silently becomes one node with two expensive
copies.

:::

`wan_ip` is **spread-only and never filterable**. Liskov compares a normalized
value internally; you never receive or enumerate it.

### `deployment.lifecycle`

Optional, and **every field has a default — author it only to deviate.** Across
the 47-application catalogue, 26 drafts restated the default renewal mode and
none deviated from it.

| Field | Values | Default |
| --- | --- | --- |
| `renewal.leadTime` | `{mode: automatic}` or `{mode: fixed, duration}` | `automatic` |
| `update.timing` | `immediate` \| `next_renewal` | `immediate` |
| `update.existingJobs.mode` | `run_until_scheduled_end` \| `stop_when_successor_ready` | `stop_when_successor_ready` |

`renewal` is valid **only** for `execution.mode: continuous`. Renewal must not
define `once` or `interval` cadence — that is what `execution` is for.

`leadTime: fixed` exists for transfer-bound applications whose runway must be
sized by what has to move rather than by launch latency.

`existingJobs` is expressed as supported **outcomes**. V4's `rollout_started`
and `processor_claimed` triggers exposed internal milestones and could sacrifice
availability; they remain read-only evidence.

:::warning[`stop_when_successor_ready` is not always right]

It is the default and correct for nearly everything. It is **wrong** where two
instances must never hold the same resource concurrently — a ClickHouse server
with an S3-backed MergeTree, for instance, where an overlapping successor is
two writers. Those applications must set `run_until_scheduled_end` and
accept a gap.

Nothing in the manifest can detect this. It depends on application internals the
contract cannot see.

:::

### `deployment.spend` ✱

Always explicit. Omission does not authorize unbounded cost; it fails the
document.

| Field | Type | Notes |
| --- | --- | --- |
| `unit` ✱ | enum | `service_credit_micros` \| `acu_planck` |
| `perJob` ✱ | amount | Everything spent getting **one** job running, including every failed attempt before the successful one |
| `rate.amount` ✱ | amount | |
| `rate.window` | duration | Default `30d` |

**`unit` drives control-plane behaviour rather than describing it.**
`service_credit_micros` routes payment through your USD Service Credit balance;
`acu_planck` routes it through your own self-custody signer. Where your tier
allows both, this field is the choice.

**`rate` is required for `continuous` and `interval`.** A per-job cap on an
application that runs forever bounds nothing, and the organization guard is not
a fallback — it defaults to unset.

## `ingress`

Public and provider-owned workload traffic. Separate from operator `access`.

| Field | Type |
| --- | --- |
| `http` | service[] |
| `tcp` | service[] |

Absence means no ingress.

### Service

| Field | Type | Notes |
| --- | --- | --- |
| `name` ✱ | string | **Unique across `http` and `tcp` together** |
| `localPort` ✱ | integer | |
| `endpoints` ✱ | endpoint[] | Names unique within the service |
| `health` | object | **Cargo only** |

Several endpoints on one service mean **simultaneous desired attachments** — not
an undocumented fallback order.

### Endpoint

| Field | Type | Notes |
| --- | --- | --- |
| `name` ✱ | string | |
| `provider` ✱ | union | Below |
| `protection` | enum | Required on public, forbidden on private |

**Providers**, tagged on `kind`:

| `kind` | Fields | Reachability |
| --- | --- | --- |
| `acurast_tunnel` | — | Public, one issued hostname **per job** |
| `cloudflare_tunnel` | `hostname` ✱, `integrationId` | Public, your zone |
| `tailscale` | `integrationId` | **Private** — your tailnet only |

`integrationId` is an optional **override**. Omit it and the `integrations`
entry for that provider kind is used.

**`protection`** — what stands between whoever reaches the endpoint and the data:

| Value | Meaning |
| --- | --- |
| `application_managed` | The application authenticates its own clients |
| `provider_gated` | An access layer in front — Cloudflare Access — verified against the integration |
| `sidecar_gated` | An authenticating proxy inside the job |
| `public_unauthenticated` | Deliberately open |

It is **required** on a public provider and **forbidden** on `tailscale`, where
it derives to `network_gated`.

:::note[How a client connects is derived, not authored]

Each provider has exactly one client-access model, so authoring it would only
create a way to author a contradiction: `acurast_tunnel` with a raw socket is not
a configuration, it is a mistake.

| Provider | How the client reaches it |
| --- | --- |
| `tailscale` | Connect directly; the tailnet is the transport |
| `cloudflare_tunnel` | `cloudflared access tcp` |
| `acurast_tunnel` | TLS-wrapped — the client needs `stunnel`, `openssl` or `socat` |

The resolved value is customer-visible in effective policy, preflight, the
console and the CLI, because *"how do I connect to this"* is the first question
an author asks. Derived does not mean hidden.

**Anonymous public TCP is not offered**, and on both public providers it is not
merely absent but unreachable. Run a tunnel agent as your own child process.

:::

### `health`

**`native_image` only.** Probing needs an out-of-process supervisor; the Cargo
helper is one, and the JavaScript runtime — which evaluates your bundle directly
— has none. `health` on a JavaScript manifest is **rejected**, not ignored.

`live` (drives recovery) and `ready` (drives traffic and cooperative cease), each
one of:

| Probe | Fields | Passes when |
| --- | --- | --- |
| `http` ✱ | `contains` | 2xx, and the body contains `contains` if given |
| `tcp` ✱ | | The local port accepts a connection |
| `exec` ✱ | | The command exits 0 |

`contains` is a plain **substring**, deliberately not JSONPath: a mini-language
in a published contract makes every bug in it a V6.

`exec` is usually the honest check, because the application already ships one —
`pg_isready -q`, `garage status`, `influx ping`.

`tcp` is the weakest and weak exactly where it is most tempting: an open 5432 is
not an accepting database.

Timeouts, intervals and thresholds are **platform-owned**, not authored.

## `access`

Authenticated operator access to an exact job. **Not** public ingress; V5 has no
`ingress.ssh`. Absence means disabled.

`access.ssh.provider`, tagged on `kind`:

| `kind` | Fields | Notes |
| --- | --- | --- |
| `tailscale` | `integrationId` | Your own tailnet. Port is derived |
| `liskov_managed` | — | Managed blind access. No `authorizedKeys` — identity, RBAC and session state are server-side, never durable keys in workload policy |
| `acurast_tunnel` | — | Consumes a tunnel connection; see the budget below |

## `configuration`

### `configuration.variables`

Tagged on `source`.

| `source` | Fields | Meaning |
| --- | --- | --- |
| `literal` | `name` ✱, `value` ✱ | Part of the document; changing it changes the digest |
| `managed` | `name` ✱, `required` (default `true`), `default` | Set outside the manifest, changeable without republishing |

`default` is valid only on `managed` — it is the fallback for a mutable value,
not a digested constant.

**Delivery is not authored.** The platform picks the mechanism.

### `configuration.secrets`

| Field | Type | Notes |
| --- | --- | --- |
| `secretId` ✱ | string | |
| `required` | boolean | Default `true` |
| `destination` ✱ | union | `{kind: environment, name}` or `{kind: file, path}` |

A secret never appears in the manifest, effective policy, logs, or an error
message. Anything carrying a credential is a secret — including a database URI
with a password in it.

Environment destinations must not collide with each other or with a variable
name. Collisions are rejected at authoring time.

## `integrations`

Declare an organization-owned integration **once**, keyed by provider kind.
Every site naming that kind then uses it without restating the id.

| Field |
| --- |
| `tailscale` |
| `cloudflare_tunnel` |

Naming a provider with no matching entry — and no `integrationId` override — is
rejected.

## `cohort`

See [Run a cluster](../configure/clustering.md).

| Field | Type | Notes |
| --- | --- | --- |
| `peers.access` | enum | `metadata_service` |
| `transport.provider` ✱ | enum | `tailscale` |
| `transport.integrationId` | string | Optional override |
| `transport.ports` | integer[] | Declared once here, injected as `LISKOV_COHORT_PORTS` |

Peer membership is **served, not injected**, because it changes under rolling
replacement — a value read once at bootstrap is stale within a window.

Do not also author a peer port as a `configuration.variables` entry. Two copies
of a port number drift, and a cluster that fails to peer explains nothing.

## `hooks`

See [Run a cluster](../configure/clustering.md). **Liskov sequences; the
application acts.**

| Hook | Fires | `timeout` |
| --- | --- | --- |
| `join` | Entering the cohort | Yes |
| `drain` | The window is ending, at the planned renewal lead | **No** |

Each is `{exec: [...]}` on `native_image` or `{sdk: true}` on `javascript` —
mixing them with the wrong runtime is rejected. On Cargo the helper runs the
command with the application's own privilege.

`drain` has no timeout because its bound is the renewal lead. The chain ends the
job at its window regardless, so a longer timeout would be a promise nobody can
keep; lengthen `renewal.leadTime` instead.

Delivery is **at-least-once**: hooks must be idempotent.

Completing `join` is the **cluster-ready** signal, and it is a different layer
from `health.ready`, which is **service-ready**. Where both are declared, `join`
takes precedence for `stop_when_successor_ready`.

## `state`

See [Run a cluster](../configure/clustering.md).

| Field | Type | Notes |
| --- | --- | --- |
| `volumes` ✱ | `{name, path}`[] | |
| `snapshot.every` ✱ | duration | |
| `snapshot.retain` | integer | Default `8` |
| `restore.onLaunch` ✱ | enum | `none` \| `latest_verified` |

`snapshot` drives the application's **own** backup mechanism on a cadence with
retention. A cluster forms **empty** and one nominated member imports a
cluster-consistent backup; Liskov chooses the member.

## `observability`

| Field | Type |
| --- | --- |
| `logs.enabled` ✱ | boolean |

The sole authored switch. Signed runtime diagnostics are derived — unsigned is
not an option, so there is nothing to author.

## `debug`

| Field | Type | Notes |
| --- | --- | --- |
| `holdOnFailure` | boolean | Diagnostic fixtures only |

The honest spelling of what a zero retry budget was being used for.

## Cross-field rules

These are not expressible in JSON Schema and are enforced by the validator.
They are the hand-authoring traps:

1. `phasing.jobsPerPhase` must be ≤ `jobs` and divide it exactly.
2. `placement.distribution` job counts must sum to `deployment.jobs`.
3. At most one `placement.allow` rule per dimension.
4. `spend.rate` is required for `continuous` and `interval`.
5. `lifecycle.renewal` is valid only for `continuous`.
6. Ingress service names are unique across `http` and `tcp` together; endpoint
   names are unique within a service.
7. A public endpoint must declare `protection`; a `tailscale` endpoint must not.
8. A port carried by `cohort.transport` **must not** be publicly reachable.
9. Every provider named must have an `integrations` entry or an
   `integrationId` override.
10. `health` requires `native_image`.
11. `hooks` must use `exec` on `native_image` and `sdk` on `javascript`.
12. Environment destinations must not collide.
13. **One Acurast Tunnel per deployment exposes exactly two connections.**
    HTTPS, SSH and a second service cannot all claim them. HTTP can be
    multiplexed behind one, so the budget usually binds only when `access.ssh`
    also uses `acurast_tunnel`.

## Removed from V4

Absent by design. Each is rejected as an unknown field rather than ignored.

| Removed | Because |
| --- | --- |
| `maxGenerations`, `maxRetries`, `maxRuntimeReplaces` | Authors express intent and money; how hard the platform retries is the platform's decision, bounded by spend |
| `runtime.resources` | Authored, materialised into policy, and then mapped to nothing. Replaced by `deployment.placement.minimums`, which reaches the on-chain filter that was always there — and moved, because a floor is a property of *placement*, not a limit on the job |
| `networkRequestLimit` | A match-time processor-capability filter that was never a job limit and never priced. Non-zero only narrowed placement |
| `ingress.ssh` | Operator access is `access.ssh`; it was never public ingress |
| `healthPath`, `localService.readyPath` | Replaced by `health`. On JavaScript nothing could ever have read them |
| `cohort.connectivity` | Unevaluable — it needed a fleet reachability inventory that does not exist — and duplicated `spread`'s `strength` vocabulary |
| `deployment.parallelism` | Renamed `deployment.jobs` |
| `release.mode: build` | Renamed `source` |
| `state.snapshot.scope`, `latest_verified_for_index` | Encoded a per-member restore model that the boot-then-import path retired |
| `clientAccess` | Fully determined by the provider |
| `metadata.appType`, `observability.profileId`, `sinkName`, `context`, `secrets[].bundleId` | Exposed internal mechanics with no customer semantics |

If you are looking for a field and it is not here, check this table before
assuming it is missing: the usual reason a knob is absent is that the platform
already knows the answer.
