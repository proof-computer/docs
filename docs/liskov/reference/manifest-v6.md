---
unlisted: true
title: Application Manifest V6 reference
description: The exact V6 delta over retained V5 — integrations, private HTTP ingress and health, SSH providers, manager, processor type and Android placement criteria, and self-custody spend.
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

:::

V6 is V5 with these authored arms added and nothing removed:

- `integrations.tailscale`, an organization's own Tailscale integration,
  declared once;
- `ingress.http`, named local services published privately to that tailnet,
  with liveness and readiness probes;
- `access.ssh.provider.kind: tailscale`, beside V5's managed provider;
- `deployment.placement.allow` and `exclude`, over the processor's on-chain
  manager id, its processor type, and exact Android Processor builds to avoid;
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
is released or immutable until a generation lists the schema pair. Its
artifacts are regenerated from the current handler and corpus, so this page
names no digest.

| Artifact | Status |
| --- | --- |
| RC digest | Pinned when V6 is released |
| Manifest schema digest | Pinned when V6 is released |
| Effective-policy schema digest | Pinned when V6 is released |
| Corpus pin | Pinned when V6 is released |
| Production registration | Pinned when V6 is released |

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

`processorSelection` is V5's, unchanged. V6 adds two Android floors to
`minimums` and two optional eligibility lists, `allow` and `exclude`, over three
dimensions: the processor's manager, its processor type, and exact Android
Processor builds to avoid.

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
| `processor_type` | `core` or `lite` | yes | yes |
| `acurast_processor_build` | one exact Android build number each | refused | yes |

At most one `allow` rule per dimension, so there is no hidden merge precedence.
One value may not appear in both lists for the same dimension: that is refused
at `/deployment/placement/exclude`.

`operator`, `country`, and `region` are refused, and filtering by WAN address
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

### Android criteria and iOS processors

`acurastProcessorBuild`, `androidMajor`, and `acurast_processor_build` all speak
about Android. An iOS processor has no Android build and no Android version, so
it cannot satisfy any of them: once a document authors one, iOS processors are
not eligible. Without them, an iOS processor, which counts as Lite, may take a
`javascript` job that admits Lite when every other check passes.

### How the criteria are enforced

Every authored criterion is a hard rule, judged at the final placement check
immediately before a job is registered, and a candidate that fails is refused
before the job is authorized to run and before any spend.

- **One pinned view.** The check reads each candidate's facts at one finalized
  chain view: the on-chain version for build rules, and the processor's
  attestation for its Android version and its type. Liskov's processor registry
  and network probes may suggest candidates, but a hint is never the final
  rule: it cannot satisfy, waive, or soften an authored criterion.
- **Every selection mode.** The same rule judges open-market candidates,
  manager-filtered candidates, and processors listed in `processorSelection`.
  A listed processor that fails is refused before spend, never reserved.
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
refused the same way, before spend. Where these reasons appear in the CLI and
the Console is pinned when V6 is released.

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
- placement spread, distribution, and geography;
- iOS version criteria — the Android criteria never apply to iOS; and
- Acurast-tunnel SSH.
