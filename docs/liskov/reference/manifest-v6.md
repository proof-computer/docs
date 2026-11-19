---
unlisted: true
title: Application Manifest V6 reference
description: The exact V6 delta over retained V5 — integrations, private HTTP ingress and health, SSH providers, country, manager, and inbound IPv6 filters and spread, processor type and Android placement criteria, and self-custody spend.
---

# Application Manifest V6 reference

:::danger[Not released]

V6 is not released. No Application can publish a V6 manifest: no production
handler generation lists the V6 schema pair, so a document declaring
`schemaVersion: 6` is refused at publication.
[Capabilities and limits](./capabilities.md) owns what is available, and
[Retained Application Manifest V5](./manifest-v5.md) is the current version of
the Application manifest.

This page is written as though final so that the contract can be reviewed
before the release. Read it as a design, not as a surface you can reach.

`proof liskov application placement-refusals` and
`proof liskov application placement-plan` are in the CLI but are not yet
listed in `--help`.

:::

V6 is V5 with these authored arms added and nothing removed:

- `integrations.tailscale`, an organization's own Tailscale integration,
  declared once;
- `ingress.http`, named local services published privately to that tailnet,
  with liveness and readiness probes;
- `access.ssh.provider.kind: tailscale`, beside V5's managed provider;
- `deployment.placement.allow` and `exclude`, over the processor's on-chain
  manager id, country, inbound IPv6 reachability, processor type, and exact
  Android Processor builds to avoid;
- `deployment.placement.spread`, by manager and country;
- `deployment.placement.minimums.acurastProcessorBuild` and `androidMajor`,
  Android floors beside V5's four capability floors; and
- `deployment.spend.unit: acu_planck`, beside V5's Service Credits.

Every other field, default, bound, and convention is V5's, unchanged. This
page states only the delta; [Retained Application Manifest V5](./manifest-v5.md)
documents the rest, and its *Conventions* section — unknown fields fail closed,
closed tagged unions, exact duration and byte-size spellings, money as decimal
strings — applies here in full.

## Contract identity

V6 is installed but authorized by no production handler generation, and nothing
is released or immutable until a generation lists the schema pair. The release
digests below stay unpinned until then. The merged clients, helper, provider
and signer are a different list: each row is a source that exists now, and
none of those commits is in a release tag.

| Artifact | Status |
| --- | --- |
| RC digest | Pinned when V6 is released |
| Manifest schema digest | Pinned when V6 is released |
| Effective-policy schema digest | Pinned when V6 is released |
| Corpus pin | Pinned when V6 is released |
| Production registration | Pinned when V6 is released |

| Piece | Merged source | Released artifact |
| --- | --- | --- |
| CLI `@proof-computer/proof-cli-liskov` | `fd84019c6a819ca804750434f5c81d28c792f390`. `package.json` says `0.18.1`; tag `v0.18.1` does not contain this commit | Pinned when V6 is released |
| Console `slipway-ui` | `e3688387e42322bcc2fab358079fb1046624144c`. The package version is `0.0.0`, and the repository has no release tag | Pinned when V6 is released |
| Cargo runtime helper `liskov-runtime-cargo` | `634ffcfab2b6d5dcc751dcbb3edec92cbf682ce5`. `Cargo.toml` says `0.12.2`; tag `v0.12.2` does not contain this commit. `src/discovery.rs` requests Tailscale discovery with `discoveryVersion` 1 | Pinned when V6 is released |
| Tailscale provider client | Pinned by liskov-rs `4526233012b28c33a849e8f1cb1ddac220ccf179` at `crates/liskov-runtime-ssh/src/provider_clients.rs`: repository `proof-computer/tailscale`, tag `v1.98.10-liskov.1`, descriptor `tailscale-aarch64-1.98.10-liskov.1` | Pinned when V6 is released |
| Self-custody signer `liskov-self-custody-signer` | `cfdf7fbf9b168c6ba71dc0ba742f0b6835beae4b`. The crate version is `0.3.0`; tag `v0.2.0` does not contain this commit | Pinned when V6 is released |

`proof liskov application manifest validate` evaluates a local file with the
CLI's vendored owner bundle. That bundle's source digest is
`sha256:199861f912ffab4e6e12a250248117c11074f42328dd571acccb5c0ac1608c29`,
from liskov-rs `4473cf26b26f4ed6d2960b086506254fe4d7dea3`. Its manifest digest
is `sha256:54bd5f14b62fa425915045cb414326bb9cc1b6ea0dbed60d0e6fac30ebd67dc0`.
Manifest and policy schema version 6 are supported pairs. The only publication
pair is still Manifest V5 `source`, which is why
`proof liskov application policy publish` refuses a V6 document. A schema-valid
V6 file still prints `firstPublicReady: true`. That line is not a publication
pair.

`liskov-examples` at `f41afc58f87c457b902f92c70f97349525a42ddf` vendors an
older bundle, source digest
`sha256:eb606519f755169179b09b7cdf287799e6b0450d99b412ca0f852600d4b94847`,
from liskov-rs `13f039d41b8febf36db37844a7a61cc405fcec79`. It also supports
schema version 6 and publishes only V5 `source`. The two bundles can disagree
on one fragment. Validate the fragments on this page with the CLI bundle.

## Root document

The root is V5's, with two optional keys added:

| Field | Required | Type and rule |
| --- | --- | --- |
| `schema` | yes | `proof.liskov.application-manifest` |
| `schemaVersion` | yes | integer `6` |
| `integrations` | no | organization-owned integrations, keyed by provider kind |
| `ingress` | no | private workload traffic |

`applicationId`, `metadata`, `release`, `runtime`, `execution`, `deployment`,
`access`, `configuration`, `observability`, `state`, and `debug` keep their V5
meanings and bounds.

## `integrations`

Optional. It has one key, `tailscale`, whose value is the organization's own
Tailscale integration id: `int_` followed by exactly 32 lowercase hexadecimal
characters.

```yaml
integrations:
  tailscale: int_00000000000000000000000000000000
```

The integration is declared once and referenced below by provider kind. Stating
it at every use site produces copies that can disagree, and the failure mode is
peers and operators landing on different tailnets. Any other key — a second
provider, for example — is an unknown field and fails closed.

## `ingress`

Optional. It has one key, `http`, holding 1–8 services. A `tcp` key is an
unknown field.

### Services

| Field | Required | Rule |
| --- | --- | --- |
| `name` | yes | matches `[a-z0-9][a-z0-9-]{0,30}`; unique across `ingress` |
| `localPort` | yes | the port the application listens on inside the job, 1–65535 |
| `endpoints` | yes | 1–4 endpoints |
| `health` | no | liveness and readiness for this service |

Names are bounded and unique so that every attachment has one stable pointer
for digests and diagnostics.

### Endpoints

| Field | Required | Rule |
| --- | --- | --- |
| `name` | yes | same pattern as a service name; unique within its service |
| `provider` | yes | exactly one arm |

The provider has one arm, and it is private:

```yaml
provider:
  kind: tailscale
  # integrationId: int_… — optional override, see Provider resolution
```

Several endpoints on one service mean several attachments wanted at the same
time, never an undocumented fallback chain.

There is no `protection` field and no authored hostname. Protection is
**derived**: a V6 endpoint is `network_gated`, reachable only on the
organization's own tailnet and governed by that tailnet's own access rules.
Authoring `protection` is an unknown field.

### `health`

Optional per service. It carries `live`, `ready`, or both; a `health` block
with neither probe is refused at its own pointer.

`live` answers whether the process is up. `ready` answers whether it is serving
correctly, which is a different question.

Each probe is exactly one of three shapes, and the shape is the discriminator —
no `kind` field states the same fact twice:

| Shape | Rule |
| --- | --- |
| `{http: PATH, contains: TEXT}` | `PATH` starts with `/` and is at most 256 characters drawn from ``A-Za-z0-9._~!$&'()*+,;=:@%/?-``. Success is a 2xx response; when `contains` is given, its body must also contain that substring. `contains` is optional. |
| `{tcp: PORT}` | A TCP connect to a local port, 1–65535. |
| `{exec: [ARG, …]}` | Run a command in the job, 1–32 arguments, none of them empty. Healthy on exit status zero. |

Probe timeouts and intervals are platform-owned and are not authored.

## Provider resolution

Every site that names a provider must resolve to an integration. A site
resolves when `integrations.tailscale` is declared, or when the site carries
its own `integrationId`, which overrides the declaration for that site alone —
for the uncommon case of two integrations of one kind.

A site that resolves to neither makes the document invalid, reported at that
site's own pointer: `/ingress/SERVICE/ENDPOINT/provider` for an endpoint, or
`/access/ssh/provider` for SSH.

## `access.ssh`

`provider` has two arms at V6:

| `kind` | Meaning |
| --- | --- |
| `liskov_managed` | Exactly as V5: Liskov brokers the session without being able to read it |
| `tailscale` | The job joins the organization's own tailnet, and Liskov never holds the session. Takes an optional `integrationId` override |

`acurast_tunnel` remains refused.

## Runtime requirement

Any SSH provider, any ingress endpoint, and any `health` block are valid only
with `runtime.kind: native_image`. They need an out-of-process supervisor
inside the job, and the JavaScript runtime has none, so on `javascript` each is
refused at its own pointer rather than accepted and left inert.

## `deployment.placement`

`processorSelection` is the retained V5 allowed pool. An exact `processorIds`
list is the set of processors a job may use. The list length is independent
of `deployment.jobs`, the order of the ids is not placement priority, and an
exact list does not fall back to the open market. A job that has been
admitted keeps its selected processor until a new occurrence is admitted.
V6 inherits that pool. It does not assign one list position to each job.

:::caution Release-gated

Choosing a later eligible processor from that pool when an earlier one is
unavailable is release-gated, as on V5. Do not rely on it until the serving
behavior is released. See
[Manifest V5 placement](./manifest-v5.md#placement).

:::

V6 adds two Android floors to `minimums` and two optional eligibility lists,
`allow` and `exclude`, over the processor's manager, country, processor type,
exact Android Processor builds to avoid, and inbound IPv6 reachability. It also adds
`spread` by manager and country across jobs. The lists narrow who may be
chosen; spread constrains or prefers diversity across those choices. Neither
turns `processorIds` into ordered slots.

### `minimums`

`minimums` still contains at least one key; an empty block reads like a
constraint and is not one, so `minimums: {}` is refused at
`/deployment/placement/minimums`. It holds V5's four floors, unchanged, and two
V6 fields:

| Field | Type and bound | When omitted | Compared against |
| --- | --- | --- | --- |
| `memory`, `storage`, `cpuSingleCoreScore`, `cpuMultiCoreScore` | as V5 | as V5 | as V5 |
| `acurastProcessorBuild` | integer, 1–4,294,967,295 | no authored build floor | the Android Acurast Processor **build number** recorded on chain |
| `androidMajor` | integer, 1–4,294,967,295 | no Android version floor | the Android **operating system major version** in the processor's attestation, such as `14` |

Both are minimums: a candidate at the floor or above it passes.

`acurastProcessorBuild` compares build numbers, never release names. The chain
records each processor's version as a platform and a build number, and only a
build number on the Android platform is compared. The name a Processor release
shows people is a display label and is never read. An authored floor narrows
the build floor the platform already sets for a runtime and can never lower
it: a candidate must clear both, so the effective floor is the higher of the
two.

`androidMajor` is the Android version, not the Processor build. The two are
independent: a recent Processor build can run on an older Android release.

```yaml
placement:
  minimums:
    acurastProcessorBuild: 131
    androidMajor: 14
```

Zero, a number above 4,294,967,295, a fraction, and a quoted number are each
refused at the field's own pointer. For example, `acurastProcessorBuild: 0` is
refused at `/deployment/placement/minimums/acurastProcessorBuild`, because a
zero floor reads like a constraint and admits every build, and
`androidMajor: 4294967296` is refused at
`/deployment/placement/minimums/androidMajor`.

### `allow` and `exclude`

| Field | Rule |
| --- | --- |
| `allow` | 1–8 rules. A candidate must match every `allow` rule to remain eligible |
| `exclude` | 1–8 rules. Any matching rule removes the candidate |

A rule is `{by: DIMENSION, values: [...]}` with 1–64 values, each 1–128
characters. The dimensions are a closed list:

| `by` | Values | In `allow` | In `exclude` |
| --- | --- | --- | --- |
| `manager` | the processor's on-chain manager id | yes | yes |
| `country` | exactly two uppercase ASCII letters, in ISO 3166-1 alpha-2 form | yes | yes |
| `processor_type` | `core` or `lite` | yes | yes |
| `acurast_processor_build` | one exact Android build number each | refused | yes |
| `inbound_reachability` | exactly `v6` | yes | refused |

At most one `allow` rule per dimension, so there is no hidden merge precedence.
One value may not appear in both lists for the same dimension: that is refused
at `/deployment/placement/exclude`.

`operator` remains withdrawn and `region` is refused. Filtering by WAN address
is never authorable — it would require an author to enumerate processor
addresses, which they must not.

#### `manager`

The processor's on-chain manager id, so an author can target their own fleet:

```yaml
placement:
  allow:
    - by: manager
      values: ["42"]
```

The filters fail closed. Only a **current** manager id satisfies a filter;
a processor whose manager cannot be established is refused under an `allow`
and under an `exclude` alike, because an unread, unpaired, or invalidated
manager is not evidence that a processor sits outside an excluded fleet.

#### `country`

An `allow` rule keeps only processors located in one of its countries; an
`exclude` rule removes processors located in one of its countries. Each rule
requires `by: country` and a `values` array of 1–64 strings. Each string is
exactly two uppercase ASCII letters. There is no case folding or assigned-code
lookup: `ZZ` is syntactically valid, but does not prove any processor matches.
Omitting the country rules adds no country restriction.

This valid fragment comes from the owner's country-filter tests:

```yaml
placement:
  allow:
    - by: country
      values: [DE, CH]
```

`values: [de]` is refused at `/deployment/placement/allow/0/values/0` with
`country "de" must be two uppercase letters, ISO 3166-1 alpha-2`. `DEU`, `D1`,
and an empty string are also refused. A country appearing in both `allow` and
`exclude` is refused at `/deployment/placement/exclude`.

A processor Liskov has not located has **no country**. It never matches a
country `allow` rule. A country `exclude` rule alone does not remove it:
missing location is not evidence of an excluded country. This differs from
`manager`, whose filters fail closed in both directions. A failed country
read is an unavailable fact, not an unlocated processor that can pass an
exclusion.

There is no fleet-coverage threshold that switches these rules on. Read located
and unlocated counts in the **Location** panel described by the **Read Compute
and check placement** guide, which is also **Not released**. Counts are exact,
including small counts; they never identify processors.

A processor's country is where Liskov last observed it from its network
address. A country rule is not a residency commitment; see the
[Master Terms](../legal/master-terms.md#44-no-location-or-identity-assurance) and
[Acceptable Use Policy](../legal/acceptable-use-policy.md#8-sanctions-export-controls-and-restricted-territories).

#### `processor_type`

Acurast distinguishes two kinds of processor, **Core** and **Lite**. What a
type may run follows the runtime: `native_image` needs the Cargo helper, which
only a Core processor runs, while a `javascript` job can run on either. Naming
a type is a constraint on where the job may run. It is not an uptime guarantee
or a reliability tier: Core is not "always on".

| Authored | `javascript` runs on | `native_image` runs on |
| --- | --- | --- |
| no `processor_type` rule | Core or Lite | Core |
| `allow` `[core]` | Core | Core |
| `allow` `[lite]` | Lite | refused |
| `allow` `[core, lite]` | Core or Lite | refused |
| `exclude` `[lite]` | Core | Core |
| `exclude` `[core]` | Lite | refused |
| `exclude` `[core, lite]` | refused | refused |

The values are exactly `core` and `lite`. To accept either type, omit the rule;
`either`, `Core`, and `ios` are refused at the value's own pointer.

```yaml
runtime:
  kind: javascript
  entrypoint: {file: index.js}
deployment:
  placement:
    allow:
      - by: processor_type
        values: [lite]
```

A `native_image` document that allows Lite is refused where Lite is written.
`allow: [{by: processor_type, values: [core, lite]}]` is refused at
`/deployment/placement/allow/0/values/1` with
`processor_type lite cannot run native_image`. Rules that leave no type the
runtime can run on — `exclude: [{by: processor_type, values: [core, lite]}]`,
for example — are refused at that `exclude` rule, such as
`/deployment/placement/exclude/0`.

Lite placement for JavaScript belongs to this unreleased contract.
[Capabilities and limits](./capabilities.md) owns which processors a JavaScript
job can run on today.

#### `acurast_processor_build`

Exclude-only. Each value is one exact Android Acurast Processor build number,
written as a canonical decimal string: digits only, from `"1"` to
`"4294967295"`, with no sign, leading zero, range, or comparison. A value
removes exactly that build — it is not a maximum and not a range, so excluding
`"133"` and `"140"` leaves every build between them eligible. An exclusion
applies even to a build above `minimums.acurastProcessorBuild`.

```yaml
placement:
  exclude:
    - by: acurast_processor_build
      values: ["133", "140"]
```

`values: ["130-140"]` is refused at `/deployment/placement/exclude/0/values/0`
because it is not an exact Android Processor build; `">=131"`, `"0131"`, and
`"v131"` are refused the same way. There is no allow list of builds: a rule
with `by: acurast_processor_build` under `allow` is refused at
`/deployment/placement/allow/0/by`. State a minimum as
`minimums.acurastProcessorBuild` instead.

#### `inbound_reachability`

Allow-only. The author states that the job listens and must be dialable over
IPv6. It is a workload requirement, not a quality or reliability tier.

The only value is the exact string `v6`. `v4` is refused because no processor
on the measured network accepts an inbound IPv4 connection. A later version
may admit it. There is no case folding and no trimming: `V6`, an empty
string, ` v6`, and `v6 ` are refused the same way as `v4`.

```yaml
deployment:
  placement:
    allow:
      - by: inbound_reachability
        values: [v6]
```

`allow: [{by: inbound_reachability, values: ["v4"]}]` is refused at
`/deployment/placement/allow/0/values/0` with
`inbound_reachability requires the exact value v6`.
`exclude: [{by: inbound_reachability, values: ["v6"]}]` is refused at
`/deployment/placement/exclude/0/by` with
`inbound_reachability is allow-only`. A second `allow` rule for this
dimension is refused at `/deployment/placement/allow`. The rule composes with
the other allow and exclude criteria and with an exact `processorSelection`.

At the final placement check Liskov reads its newest measurement of whether
the processor accepts an inbound connection. The processor matches only when
that measurement found IPv6 reachable and was taken no more than 90 days
before the check. Those 90 days are a fixed part of the contract. They do not
depend on how long Liskov keeps measurements.

A processor does not match when Liskov has not measured it, when its newest
measurement is expired or older than 90 days, when it advertised no IPv6
address, when the result was anything other than reachable, or when the
measurement itself could not be made. An unmeasured processor never matches
this `allow` rule, the same way an unlocated processor never matches a country
`allow` rule. A processor Liskov has not measured, and a processor with no
IPv6 address, is never a candidate.

When no candidate qualifies, launch refuses before any reserve, signer
request, or registration. On the placement-refusals read, the observation's
`launchReason` is `inbound_fleet_empty` and its `placementCode` is
`placement_no_eligible_candidate`. The read does not say how many processors
would qualify.

A matching processor accepted a connection over IPv6 from one measurement
point within 90 days. Two matching processors can each be dialed. Liskov
does not prove that a given pair connected, and it relays nothing. The
application authenticates its peers with the job keys published on chain.
Direct transfer is an optimization over a durable copy, never a replacement
for one.

`by: inbound_reachability` is not a spread key. A `spread` row with
`by: inbound_reachability` is refused at that row's `/by` pointer, the same
way as any key other than `manager` or `country`.

The names of the per-candidate refusal reasons are pinned when V6 is
released.

#### All criteria together

The criteria compose with V5's floors, with exact `processorSelection`, and with
manager filters. This fragment of the owner's corpus states every one:

```yaml
placement:
  minimums:
    memory: 4GiB
    cpuMultiCoreScore: 2000
    acurastProcessorBuild: 131
    androidMajor: 14
  allow:
    - by: manager
      values: ["42"]
  exclude:
    - by: acurast_processor_build
      values: ["133"]
    - by: processor_type
      values: [lite]
    - by: manager
      values: ["99"]
```

### `spread`

Optional `deployment.placement.spread` is an array of 1–2 rules, with at most
one rule per dimension. Omitting it requests no spread. An empty array is
refused at `/deployment/placement/spread`, and any spread rule requires at
least two `deployment.jobs`, otherwise the refusal points to `/deployment/jobs`.

| Field | Required | Type and bound | When omitted |
| --- | --- | --- | --- |
| `by` | yes | string: `manager` or `country` only | refused |
| `strength` | yes | string: `required` or `preferred` only | refused |
| `minimumDistinct` | no | integer, at least 2 and at most `deployment.jobs` | the authored job count |

`minimumDistinct` counts distinct manager ids or countries across the jobs,
not processors in each country. An unlocated processor never counts as a
distinct country. With both dimensions authored, the same assignment must
satisfy both required rules; enough values counted separately do not prove
that such an assignment exists.

`required` is a hard constraint. `preferred` requests diversity that may fall
short; required rules take precedence. Preferred diversity may choose a more
expensive eligible processor within the authored per-job spend cap, but never
raises that cap.

This valid fragment from the owner's spread tests requires distinct managers
and prefers at least two countries:

```yaml
deployment:
  jobs: 2
  placement:
    spread:
      - by: manager
        strength: required
      - by: country
        strength: preferred
        minimumDistinct: 2
```

This fragment from the owner's refused fixture asks for more distinct managers
than jobs:

```yaml
deployment:
  jobs: 2
  placement:
    spread: [{by: manager, strength: required, minimumDistinct: 3}]
```

It is refused at `/deployment/placement/spread/0/minimumDistinct` with
`minimumDistinct must be at least 2 and at most deployment.jobs`. A value of
`1` is refused at the same pointer. A second row for the same `by` is refused
at `/deployment/placement/spread`. `by: region` and `strength: optional` are
refused at their respective `/by` and `/strength` pointers; neither has an
implicit fallback.

### In the Console

The Compute placement form is where country and spread are decided. The fields
stay disabled until V6 is enabled. A disabled field says "Available when V6
ships." **Jobs** is `deployment.jobs`, from 1 to 256, the same authored bound
as V5. V5's first-public admission maximum of 2 is unchanged.

| Console label | What it writes |
| --- | --- |
| Allowed countries | `deployment.placement.allow` with `by: country`. Two-letter codes, separated by commas. |
| Excluded countries | `deployment.placement.exclude` with `by: country`. |
| Manager spread | A `spread` row with `by: manager`. **None** writes no row. **Required** and **Preferred** are `strength: required` and `strength: preferred`. |
| Country spread | The same three choices with `by: country`. |
| Minimum managers | That row's `minimumDistinct`: at least 2 and at most the job count. Blank means every job. |
| Minimum countries | The country row's `minimumDistinct`, with the same bound. |
| Processor type | **Either** writes no `processor_type` rule. **Core** and **Lite** write `allow` values `core` and `lite`. A native image locks the choice to Core. `either` is not a manifest value. |
| Minimum Processor build | `deployment.placement.minimums.acurastProcessorBuild`. |
| Excluded Processor builds | `exclude` with `by: acurast_processor_build`. |
| Minimum Android version | `deployment.placement.minimums.androidMajor`. |

The form states that an unknown country never matches an allow list, and that
an exclude list alone does not remove unlocated processors. An unknown country
never counts as a distinct country. **Required** means every job needs a
feasible placement before the first spend. **Preferred** asks for diversity
within the per-job cap and may cost more than the cheapest placement.

The manager allow/exclude box on that form stays disabled. Author a manager
rule in the manifest, and read the fleet with
`proof liskov placement manager-fleet`.

### Country and spread refusals before spend

Before the first job spends, required spread needs a feasible assignment for
the whole Application. If that plan cannot be established, no member is
reserved, sent to a signer, or registered. Launching a paid first member and
then discovering that the remaining members cannot satisfy the initial rule
is not partial success. Discovery and search are bounded: exhausting them is
a refusal, not proof that the entire fleet is infeasible.

Once a feasible plan exists, each member still passes its final placement
check. Later fact changes or chain failures can stop a member through the
normal refusal and recovery lifecycle; a plan is not atomic execution of all
jobs on chain. Country filters also apply at the final check, before that
job's spend and registration.

The Application's authorized placement-refusal read is
`GET /api/applications/:applicationId/placement/refusals`. Its required query
parameters are `fromMs` (inclusive) and `toMs` (exclusive), in Unix milliseconds
for the observation's hourly window start, and `limit` (integer, 1–100).
`cursor` continues a page within the same Application and time bounds.

The same read from the CLI, hidden until V6 is released:

```bash
proof liskov application placement-refusals APPLICATION_ID \
  --from-ms FROM_MS \
  --to-ms TO_MS \
  --limit LIMIT
```

`--from-ms`, `--to-ms` and `--limit` are required. There is no default window
and no automatic paging. `--cursor` repeats the previous page's `nextCursor`
and works only with the same `--from-ms` and `--to-ms`. `--json` prints the
server's body unchanged. `--config` selects the session file and
`--liskov-url` selects the service.
The read reports these country reasons and safe next actions:

| Country `reason` | Meaning | What you can change |
| --- | --- | --- |
| `country_not_allowed` | the located country is outside `allow` | widen or remove the country allow list |
| `country_unlocated_not_allowed` | no country is known for a candidate under `allow` | widen or remove the country allow list; only removing the rule admits an unlocated candidate |
| `country_excluded` | the located country matches `exclude` | remove that country from the exclusion |
| `country_unavailable` | the country fact could not be read | retry later |

When country filtering leaves no eligible candidate, the observation's
`launchReason` is `country_fleet_empty` and its `placementCode` is
`placement_no_eligible_candidate`.

When an `inbound_reachability` allow rule leaves no eligible candidate, the
observation's `launchReason` is `inbound_fleet_empty` and its `placementCode`
is `placement_no_eligible_candidate`. That observation does not say how many
processors would qualify.

Spread observations distinguish:

| `launchReason` | `placementCode` | Meaning and next step |
| --- | --- | --- |
| `required_manager_spread_unsatisfied` | `placement_required_spread_unsatisfied` | the required manager diversity could not be met; review that rule |
| `required_country_spread_unsatisfied` | `placement_required_spread_unsatisfied` | the required country diversity could not be met; review that rule |
| `spread_search_budget_exhausted` | `placement_search_budget_exhausted` | bounded discovery or search ran out; retry later |
| `spread_plan_revalidation_required` | `placement_selection_unreadable` | the plan needs a fresh check; retry later |

The read returns counts and reasons, never candidate ids or their countries.
It retains the first observation per Application, placement code, and hour,
so counts describe recorded evidence, not every failed attempt. Follow
`nextCursor`; `incomplete: true` means more observations exist or some candidate
or reason evidence was omitted. Empty history does not prove successful
placement, and `incomplete: false` does not turn this history into a complete
count of attempts.

### The initial placement plan

Required spread is judged against one immutable snapshot of the original
whole-application plan. The snapshot is not current fulfillment: later fact
changes still go through the refusal read above.

```text
GET /api/applications/:applicationId/placement/plans/:occurrenceAuthorityDigest
```

The digest is `sha256:` and 64 lowercase hexadecimal digits, with no
normalization. Any other spelling is `invalid_occurrence_authority_digest`
and is refused before the session is read. The response schema is
`application_placement_plan_v1`. `semantics` is `initial_feasibility_snapshot`.
`plan` is null when no plan was kept. A plan names
`seedOccurrenceAuthorityDigest`, `planDigest`, `policyDigest`, `memberCount`
and `rules`. Each rule has `by` (`manager` or `country`), `strength`,
`minimumDistinct`, `targetDistinct`, `plannedDistinct` and `preferredDegraded`.

The CLI read is hidden until V6 is released:

```bash
proof liskov application placement-plan APPLICATION_ID OCCURRENCE_AUTHORITY_DIGEST
```

`--json` prints the server's body unchanged. `--config` selects the session
file and `--liskov-url` selects the service. Counts in this body describe the
original plan.

### Android criteria and iOS processors

`acurastProcessorBuild`, `androidMajor`, and `acurast_processor_build` all speak
about Android. An iOS processor has no Android build and no Android version, so
it cannot satisfy any of them: once a document authors one, iOS processors are
not eligible. Without them, an iOS processor, which counts as Lite, may take a
`javascript` job that admits Lite when every other check passes.

### How the criteria are enforced

The processor type, build and Android-version criteria are hard rules, judged
at the final placement check immediately before a job is registered. A
candidate that fails is refused before the job is authorized to run and
before any spend.

- **One pinned view.** The check reads each candidate's facts at one finalized
  chain view: the on-chain version for build rules, and the processor's
  attestation for its Android version and its type. Liskov's processor registry
  and network probes may suggest candidates, but a hint is never the final
  rule: it cannot satisfy, waive, or soften an authored criterion.
- **Every selection mode.** The same rule judges open-market candidates,
  manager-filtered candidates, and processors listed in `processorSelection`.
  A listed processor that fails is refused before spend, never reserved.
  Other ids in an exact allowed pool remain candidates. List position does
  not choose the processor.
- **Unknown fails closed.** A version the check cannot read never satisfies a
  build floor. An attestation without a readable Android version fails an
  authored `androidMajor`; a missing or malformed Android version matters only
  when that floor is authored. An attestation that proves neither Core nor Lite
  is refused for every launch, including one whose policy accepts either type.

A refused candidate is recorded with the reason, the rule it failed, and the
fact that was judged. What an Application's owner can read is the reason and
a count of refused candidates — never which processors, whose, or their raw
attestation. The six criteria reasons are:

| Reason | Rule | What you can change |
| --- | --- | --- |
| `processor_build_below_floor` | `minimums.acurastProcessorBuild` | lower the minimum build |
| `processor_build_excluded` | an `acurast_processor_build` exclusion | remove that excluded build |
| `processor_build_not_android` | any build rule, on a processor that is not Android | remove the build rules |
| `android_major_below_floor` | `minimums.androidMajor` | lower the minimum Android version |
| `android_major_unavailable` | `minimums.androidMajor`, with no readable Android version | remove the minimum Android version |
| `android_major_not_android` | `minimums.androidMajor`, on a processor that is not Android | remove the minimum Android version |

A candidate whose proven type is not one the rule or the runtime admits is
refused the same way, before spend. Country and spread reasons are the
placement-refusals read above. Where these six processor-criteria reasons
appear in the CLI and the Console is pinned when V6 is released.

## `deployment.spend.unit`

| `unit` | Who pays |
| --- | --- |
| `service_credit_micros` | Managed custody, as V5: Liskov's Service Credits pay |
| `acu_planck` | Self-custody: the organization's own ACU pays the chain, through its own paired signer |

`perJob` and `rate.amount` are V5's exact decimal strings and are denominated
in the unit named. `rate` is still required when execution is recurring, and
`rate.window` still defaults to `30d`.

## A worked fragment

From the reference application the V6 delta was designed against — a private
analytical database reached over the customer's own tailnet, with no public
surface. The integration id below is a placeholder, never a live id:

```yaml
integrations:
  tailscale: int_00000000000000000000000000000000

runtime:
  kind: native_image

ingress:
  http:
    - name: http
      localPort: 8123
      health:
        live:
          http: /ping
        ready:
          http: /replicas_status
      endpoints:
        - name: private
          provider:
            kind: tailscale

access:
  ssh:
    provider:
      kind: tailscale
```

This is a fragment. `runtime.kind: native_image` still needs the V5 `image`
and `entrypoint`. Pasting the fragment alone into
`proof liskov application manifest validate` is refused at `/runtime` with
`missing field image`.

## Deferred to a future policy version

The following remain absent from the exact V6 schema and are rejected as
unknown fields or closed-union arms:

- public or provider-owned ingress, including Cloudflare and the Acurast
  tunnel;
- TCP ingress;
- authored endpoint protection;
- integrations other than Tailscale;
- cohort membership and discovery;
- join and drain hooks;
- durable state — `state.mode` still has only `off`;
- `region` filtering or spread, spread by network or WAN address, co-location,
  and counted `distribution`;
- iOS version criteria — the Android criteria never apply to iOS; and
- Acurast-tunnel SSH.
