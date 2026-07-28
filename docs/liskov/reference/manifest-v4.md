---
title: Application Manifest V4
description: Exact authored manifest and effective-policy V4 fields, defaults, bounds, cross-field rules, and capability availability.
---

# Application Manifest V4

Repositories author `proof.liskov.application-manifest` version `4`. Liskov
resolves release and server-owned facts into
`proof.liskov.application-policy` version `4`. Objects are strict: unknown
fields are errors.

All durations are milliseconds unless the field says otherwise. Optional means
the field may be omitted; it does not mean every typed value is enabled. Check
[Capabilities and limits](./capabilities.md).

## Authored top level

```json
{
  "schema": "proof.liskov.application-manifest",
  "schemaVersion": 4,
  "applicationId": "status-worker",
  "applicationUid": "optional-server-issued-pin",
  "metadata": {},
  "release": {},
  "runtime": {},
  "deployment": {},
  "ingress": {},
  "observability": {},
  "configuration": {}
}
```

| Field | Presence | Contract |
| --- | --- | --- |
| `schema` | Required | Exactly `proof.liskov.application-manifest`. |
| `schemaVersion` | Required | Unsigned integer `4`. |
| `applicationId` | Required | 1–64 lowercase letters, numbers, `.`, `_`, or `-`; begins with a letter or number. |
| `applicationUid` | Optional | Non-empty server-issued immutable identity; if present, must match target. |
| `metadata` | Optional | Defaults to `{}`; author-facing description/classification. |
| `release` | Required | Exactly one `build` or `pinned` arm. |
| `runtime` | Optional | Runtime requirements plus secure bootstrap defaults. |
| `deployment` | Required | Schedule and lifecycle are required. |
| `ingress` | Optional | Defaults to `{}`; public v1 has no general ingress. |
| `observability` | Optional | Logs off; signed diagnostics on. |
| `configuration` | Optional | Variables and secret declarations; defaults to empty. |

Display name, organization/owner, mutable status, publication timestamps,
signatures, provenance results, quotes, processor identities, and other launch
facts are server-owned and invalid in a manifest.

## `metadata`

| Field | Type | Default / rule |
| --- | --- | --- |
| `appType` | string | Optional workload classification, such as `background-worker`. |
| `labels` | string[] | `[]`; order is digest-significant. |
| `description` | string | Optional human description. |

Metadata affects `authoredDigest` but is absent from the effective policy and
its `policyDigest`.

## `release`

`release` is a strict tagged union selected by `mode`. Do not mix arms or put a
CID in a build release.

### Build release — release-gated v1

```json
{
  "mode": "build",
  "artifact": {
    "kind": "ipfs_bundle",
    "encryption": { "mode": "aes256_gcm" }
  },
  "builder": {
    "kind": "github",
    "repository": "owner/repository",
    "allowedRefs": ["refs/heads/main"],
    "workflowRef": "owner/repository/.github/workflows/liskov.yml@refs/heads/main",
    "manifestPath": ".liskov/application-manifest.json"
  }
}
```

All GitHub builder fields are required. `repository` is `owner/repository`;
`allowedRefs` is non-empty with no duplicates; `workflowRef` is exact; and
`manifestPath` is a safe repository-relative path.

| Artifact kind | Contract | Availability |
| --- | --- | --- |
| `ipfs_bundle` | Explicit `encryption.mode`: `none` or `aes256_gcm`. CID/digest are resolved from an accepted artifact version. | Release-gated v1 |
| `runtime_image` | Typed immutable image/bootstrap release authority. | Internal; no public authoring recipe |

### Pinned release — v1 for curated first-party versions

```json
{
  "mode": "pinned",
  "artifact": {
    "kind": "ipfs_bundle",
    "cid": "ipfs://Qm...",
    "digest": "sha256:...",
    "encryption": { "mode": "none" }
  }
}
```

| Artifact kind | Required fields | Availability |
| --- | --- | --- |
| `ipfs_bundle` | Canonical `ipfs://` CID, `sha256:` digest, encryption `none` or `aes256_gcm`. | v1 for curated versions |
| `runtime_image` | Immutable `imageDigest`, canonical `bootstrapCid`, `bootstrapDigest`. | Internal |

Pinned releases contain no builder authority or source provenance. Catalog
ingestion owns the provenance of a curated version.

## `runtime`

| Field | Type | Default / notes |
| --- | --- | --- |
| `engine` | enum | Optional: `nodejs`, `deno`, or `bun`; public workload guide uses Node.js. |
| `command` | string | Optional command run by the selected runtime. |
| `role` | string | Optional author-defined role label. |
| `resources` | object | `{}`. |
| `requiredModules` | string[] | `[]`; names such as `network`, subject to capability checks. |
| `bootstrap` | object | Secure non-weakenable defaults. |

### `runtime.resources`

| Field | Type/unit | Rule |
| --- | --- | --- |
| `memoryMiB` | unsigned integer MiB | Optional; explicit zero is preserved. |
| `storageMiB` | unsigned integer MiB | Optional; explicit zero is preserved. |
| `networkRequestQuota` | unsigned integer requests | Optional; explicit zero is preserved. |

Platform and plan bounds apply during publication/launch.

### `runtime.bootstrap`

| Field | Default | Rule |
| --- | --- | --- |
| `trustProfile` | `proof.liskov.attested-runtime.v1` | No other value. |
| `signedDiagnosticsRequired` | `true` | `false` is invalid. |
| `identityBoundSecretsRequired` | `true` | `false` is invalid. |

## `deployment`

| Field | Presence | Default / rule |
| --- | --- | --- |
| `parallelism` | Optional | Default `1`; schema range 1–64; public v1 enables only `1`. |
| `schedule` | Required | Paid schedule boundary. |
| `placement` | Optional | Attested requirements plus open-market default. |
| `lifecycle` | Required | Renewal, update, and recovery authority. |
| `spend` | Optional | `{}`; explicit caps. |

Parallelism is Liskov logical job slots with monotonic generations, not
provider-native replicas.

### `deployment.schedule`

| Field | Presence | Rule |
| --- | --- | --- |
| `durationMs` | Required | Unsigned integer greater than zero. |
| `startDelayMs` | Optional | If `maxStartDelayMs` exists, cannot exceed it. |
| `maxStartDelayMs` | Optional | Unsigned maximum accepted start delay. |

### `deployment.spend`

| Field | Type/unit | Rule |
| --- | --- | --- |
| `maxRewardPlanckPerJob` | decimal string, planck | Unsigned base-10 integer string. |
| `maxNativeFeePlanckPerJob` | decimal string, planck | Unsigned base-10 integer string. |
| `maxServiceCreditMicrosPerGeneration` | unsigned integer, USD micros | 1,000,000 is USD 1.00 in Service Credits. |

These are maximum authority, not quote or final price.

## `deployment.placement`

| Field | Default | Availability |
| --- | --- | --- |
| `requirements` | Mandatory attested trust profile | v1 |
| `groups` | `[]` | Internal |
| `topologyConstraints` | `[]` | Internal |
| `processorSelection` | Open market, fail-closed unknown manager | Open market v1; other arms internal |

### Requirements

| Field | Contract |
| --- | --- |
| `trustProfile` | Defaults to and can only be `proof.liskov.attested-runtime.v1`. |
| `machine` | Optional immutable class/profile/minimums request. Capability-gated. |
| `evidence` | Array of versioned evidence thresholds. Capability-gated. |

`machine` can contain `class`, `profileVersion`, and
`minimums: {metric: unsignedInteger}`. Do not author current processor
availability, performance observations, or resolved catalog data.

Every `evidence[]` item requires `profile`, `metric`, unsigned `minimum`,
unsigned `maxAgeMs`, unsigned `minimumSamples`,
`minimumConfidenceBps` from 0–10,000, and `strength` of `required` or
`preferred`.

### Processor selection

Supported v1:

```json
{ "mode": "open_market" }
```

Shared optional filters are `excludeManagers: string[]`,
`allowUnknownManager: boolean` (default false),
`requireScheduleClear: boolean` (default false),
`requireConsumerAccess: boolean` (default false),
`maxHeartbeatAgeSeconds`, `candidateLimit`, and `scanLimit`. Capability and
account checks still apply.

Typed internal arms:

```json
{ "mode": "manager", "managerId": "partner-manager" }
```

```json
{
  "mode": "static",
  "processorIds": ["5ProcessorAddressA"],
  "managerId": "optional-manager-binding"
}
```

Do not use these internal arms in public recipes.

### Groups and topology — internal

Each group requires unique non-empty `name`, positive `count`, and a geography
union. Group counts must sum exactly to `parallelism`.

Country selector:

```json
{
  "kind": "country",
  "standard": "ISO-3166-1-alpha-2",
  "values": ["GB", "US"]
}
```

Values are non-empty uppercase two-character codes. Region selector uses
`kind: "region"`, non-empty versioned `catalog`, and non-empty `values`.

Every topology constraint requires:

- `kind`: `affinity` or `anti_affinity`;
- `scope`: `this_deployment`;
- `topologyKey`: `processor`, `operator`, `manager`, `country`, or `region`;
  and
- `strength`: `required` or `preferred`.

## `deployment.lifecycle`

`renewal`, `update`, and `recovery` are all required.

### Renewal

Supported after end:

```json
{ "mode": "after_scheduled_end" }
```

Supported fixed lead:

```json
{
  "mode": "before_scheduled_end",
  "leadTime": {
    "mode": "fixed",
    "durationMs": 600000
  }
}
```

Fixed lead is 60,000 through the lesser of 1,800,000 and half of
`schedule.durationMs`.

Typed internal automatic lead:

```json
{
  "mode": "before_scheduled_end",
  "leadTime": {
    "mode": "automatic",
    "profile": "proof.liskov.renewal-lead.v1"
  }
}
```

Only that profile value is structurally valid; the capability is not enabled.

### Update

| Field | Values / availability |
| --- | --- |
| `timing` | `next_scheduled_renewal` or `immediate` — v1 |
| `existingJobs` | `run_until_scheduled_end` — v1; `cooperative_cease` — release-gated v1 |

```json
{ "mode": "run_until_scheduled_end" }
```

Cooperative cease is typed as:

```json
{
  "mode": "cooperative_cease",
  "trigger": "successor_runtime_ready"
}
```

Trigger values are `rollout_started`, `successor_processor_claimed`, and
`successor_runtime_ready`. Do not use until the capability gate is removed.

### Recovery

| Field | Presence | Default / availability |
| --- | --- | --- |
| `launch` | Optional | `{ "maxRetries": 5 }`; 0–10, v1. |
| `runtimeFailure` | Required | `wait_until_scheduled_end` is v1. |

```json
{ "mode": "wait_until_scheduled_end" }
```

`replace_after_failure` is typed but internal:

| Field | Default | Bounds |
| --- | ---: | ---: |
| `contactLossAfterMs` | 300,000 | 120,000–1,800,000 |
| `restartGraceMs` | 600,000 | 0–86,400,000 |
| `maxSameJobRestarts` | 3 | 0–50 |
| `maxFreshRegistrationReplacements` | 2 | 0–10 |

## `ingress` — internal for general v1 workloads

`http` and `ssh` are typed requests. Mode values are `disabled`, `optional`,
and `required`; optional and dual ingress are also capability-gated.

HTTP requires `mode` and unsigned 16-bit `port`; `healthPath` is optional. SSH
requires `mode`; port defaults to 22. A usable port is 1–65,535.

Do not interpret this schema as Liskov-hosted ingress. A curated offering can
document its own Acurast boundary.

## `observability`

| Field | Default / rule |
| --- | --- |
| `logs` | `{ "enabled": false }` |
| `runtimeDiagnostics` | `{ "signed": true }`; false is invalid |

`logs` supports:

| Field | Default / notes |
| --- | --- |
| `enabled` | false |
| `profileId` | Optional versioned logging profile. |
| `sinkName` | Optional configured sink name. |
| `context` | `{}` map of non-secret strings. |

## `configuration`

| Field | Default |
| --- | --- |
| `variables` | `[]` |
| `secrets` | `[]` |

### Variables

| Field | Presence | Default / notes |
| --- | --- | --- |
| `name` | Required | Runtime variable name. |
| `required` | Optional | false |
| `default` | Optional | Non-secret string. |
| `managed` | Optional | false; true selects Application-managed value. |

Never put secret plaintext in `default`.

### Secrets

| Field | Presence | Default / notes |
| --- | --- | --- |
| `secretId` | Required | Stable ID, not secret material. |
| `required` | Optional | true |
| `destination` | Required | `env` or `file` tagged union. |
| `bundleId` | Optional | Groups related secret material. |

```json
{ "kind": "env", "name": "DATABASE_URL" }
```

```json
{ "kind": "file", "path": "/run/secrets/config.json" }
```

## Effective policy

The materialized policy has schema `proof.liskov.application-policy` V4. It
contains required `applicationId`, server-resolved `applicationUid`, resolved
immutable artifact, and normalized runtime, deployment, ingress,
observability, and configuration.

It contains no metadata, builder authority, mutable source provenance, upload
session, or publication-envelope fields. Runtime-image policies bind both
immutable image and bootstrap identity.

## Contract constants

| Constant | Value |
| --- | --- |
| Authored schema | `proof.liskov.application-manifest` |
| Effective schema | `proof.liskov.application-policy` |
| Schema version | `4` |
| Read-contract version | `3` |
| Mandatory trust profile | `proof.liskov.attested-runtime.v1` |
| Automatic lead profile | `proof.liskov.renewal-lead.v1` |
| Schema maximum parallelism | 64; public v1 enables 1 |

## Validation layers

1. JSON parse and strict schema.
2. Semantic/cross-field Manifest V4 validation.
3. Import identity and source binding.
4. Artifact/builder provenance resolution.
5. Capability and organization entitlement.
6. Publication race fence and immutable effective-policy creation.
7. Deployment-time funding, market, configuration, and external facts.

Use `proof liskov application manifest validate --file PATH` for layers 1–2
and publication `--dry-run` for contextual publication checks.
