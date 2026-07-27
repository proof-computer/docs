---
title: Policy Schema
description: Complete field, enum, default, bound, and cross-field reference for the strict Liskov application-policy V4 contract.
---

# Policy Schema

This is the complete authored contract for
`proof.liskov.application-policy` version `4`. Every object rejects unknown
fields. “Optional” means the field may be omitted from authored JSON; it does
not imply that every resulting policy is executable.

The generated JSON Schema is available from:

```text
GET /api/application-policy/schema
```

For a guided introduction, start with the
[Policy handbook](../policy/index.md).

## Reading The Tables

| Marker | Meaning |
| --- | --- |
| Required | The field must appear in authored JSON. |
| Optional | The field may be omitted. |
| Default | Value inserted into the normalized effective policy when omitted. |
| Gated | Valid in the contract but may require an enabled platform capability or account entitlement. |

All duration fields use milliseconds unless their name says otherwise.

## Top Level

```json
{
  "schema": "proof.liskov.application-policy",
  "schemaVersion": 4,
  "applicationId": "customer-api",
  "applicationUid": "optional-server-issued-pin",
  "metadata": {},
  "artifact": {},
  "build": {},
  "runtime": {},
  "deployment": {},
  "ingress": {},
  "observability": {},
  "configuration": {}
}
```

| Field | Type | Presence | Default / rules |
| --- | --- | --- | --- |
| `schema` | string | Required | Must equal `proof.liskov.application-policy`. |
| `schemaVersion` | unsigned integer | Required | Must equal `4`. |
| `applicationId` | string | Required | 1–64 lowercase letters, numbers, `.`, `_`, or `-`; starts with a letter or number. |
| `applicationUid` | string | Optional | Immutable server-issued identity pin; if present, non-empty and must match the target application. |
| `metadata` | object | Optional | `{}`. Author-facing classification only. |
| `artifact` | object | Optional | Empty artifact policy with empty encryption settings. |
| `build` | object | Optional | `{}`. |
| `runtime` | object | Optional | Empty runtime settings plus mandatory bootstrap defaults. |
| `deployment` | object | Required | Contains required `schedule` and `lifecycle`. |
| `ingress` | object | Optional | `{}`; no ingress. |
| `observability` | object | Optional | Logs disabled; signed runtime diagnostics enabled. |
| `configuration` | object | Optional | `{}`; no variables or secrets. |

Display name, organization, owner, status, publication metadata, timestamps,
signatures, and import provenance are server-owned and are not valid authored
fields.

## `metadata`

| Field | Type | Presence | Notes |
| --- | --- | --- | --- |
| `appType` | string | Optional | Workload classification such as `background-worker` or `managed-web-app`. |
| `labels` | string[] | Optional | Defaults to `[]`; array order is digest-significant. |
| `description` | string | Optional | Human explanation of workload intent. |

Metadata is immutable within a published policy version and affects its
digests, but it does not replace server-owned application settings.

## `artifact`

| Field | Type | Presence | Notes |
| --- | --- | --- | --- |
| `kind` | enum | Optional | `ipfs` or `runtime_image`. |
| `cid` | string | Optional | Content identifier for an IPFS artifact. |
| `digest` | string | Optional | Content digest using the selected artifact convention. |
| `encryption` | object | Optional | Defaults to `{}`. |
| `runtimeImage` | string | Optional | Immutable runtime-image identifier. |

### `artifact.encryption`

| Field | Type | Presence | Values |
| --- | --- | --- | --- |
| `mode` | enum | Optional | `none`, `aes256_gcm` |

Artifact identity is immutable policy intent. Availability, pin state, and
server-resolved runtime-image metadata are not authored fields.

## `build`

| Field | Type | Presence | Notes |
| --- | --- | --- | --- |
| `github` | object | Optional | GitHub build and publication authority. |

### `build.github`

| Field | Type | Presence | Notes |
| --- | --- | --- | --- |
| `repository` | string | Required | `owner/repository`. |
| `allowedRefs` | string[] | Optional | Defaults to `[]`; allowed Git refs or patterns interpreted by the build authority. |
| `workflowRef` | string | Optional | Exact OIDC-pinned workflow reference. |
| `path` | string | Optional | Repository path to the authored policy. |

Build provenance belongs here. There is no policy boolean that grants automatic
publication; publication remains a separate server-authorized action.

## `runtime`

| Field | Type | Presence | Notes |
| --- | --- | --- | --- |
| `engine` | enum | Optional | `nodejs`, `deno`, or `bun`. |
| `command` | string | Optional | Command run by the selected runtime. |
| `role` | string | Optional | Author-defined role label. |
| `resources` | object | Optional | Defaults to `{}`. |
| `requiredModules` | string[] | Optional | Defaults to `[]`; runtime capability names such as `network`. |
| `bootstrap` | object | Optional | Secure mandatory defaults below. |

### `runtime.resources`

| Field | Type | Unit | Presence |
| --- | --- | --- | --- |
| `memoryMiB` | unsigned integer | MiB | Optional |
| `storageMiB` | unsigned integer | MiB | Optional |
| `networkRequestQuota` | unsigned integer | requests | Optional |

Explicit zero is preserved.

### `runtime.bootstrap`

| Field | Type | Default | Rule |
| --- | --- | --- | --- |
| `trustProfile` | string | `proof.liskov.attested-runtime.v1` | Cannot use another value. |
| `signedDiagnosticsRequired` | boolean | `true` | `false` is invalid. |
| `identityBoundSecretsRequired` | boolean | `true` | `false` is invalid. |

These requirements are non-weakenable trust invariants.

## `deployment`

| Field | Type | Presence | Default / rules |
| --- | --- | --- | --- |
| `parallelism` | unsigned integer | Optional | Default `1`; contract range 1–64; platform capability and account entitlement may be lower. |
| `schedule` | object | Required | Paid schedule boundary. |
| `placement` | object | Optional | Attested runtime plus open-market selection defaults. |
| `lifecycle` | object | Required | Renewal, update, and recovery authority. |
| `spend` | object | Optional | `{}`; explicit per-job and per-generation caps. |

`parallelism` creates stable Liskov job slots with monotonic generations. It
does not request provider-native replicas.

### `deployment.schedule`

| Field | Type | Presence | Rule |
| --- | --- | --- | --- |
| `durationMs` | unsigned integer | Required | Greater than zero. |
| `startDelayMs` | unsigned integer | Optional | If `maxStartDelayMs` is present, cannot exceed it. |
| `maxStartDelayMs` | unsigned integer | Optional | Maximum accepted start delay. |

### `deployment.spend`

| Field | Type | Presence | Unit / notes |
| --- | --- | --- | --- |
| `maxRewardPlanckPerJob` | decimal string | Optional | Maximum Acurast reward for one job. Use a string to preserve precision. |
| `maxNativeFeePlanckPerJob` | decimal string | Optional | Maximum native fee for one job. Use a string to preserve precision. |
| `maxServiceCreditMicrosPerGeneration` | unsigned integer | Optional | Maximum Service Credit charge for one slot generation. |

The schema types planck caps as strings. Authors should use unsigned base-10
integer strings.

## `deployment.placement`

| Field | Type | Presence | Default |
| --- | --- | --- | --- |
| `requirements` | object | Optional | Mandatory attested-runtime trust profile. |
| `groups` | object[] | Optional | `[]`; counted geography groups. Gated. |
| `topologyConstraints` | object[] | Optional | `[]`; deployment-local affinity rules. Gated. |
| `processorSelection` | tagged union | Optional | Open market with fail-closed manager default. |

### `placement.requirements`

| Field | Type | Presence | Default / notes |
| --- | --- | --- | --- |
| `trustProfile` | string | Optional | `proof.liskov.attested-runtime.v1`; cannot be changed. |
| `machine` | object | Optional | Immutable machine requirement. |
| `evidence` | object[] | Optional | Defaults to `[]`. |

### `requirements.machine`

| Field | Type | Presence | Notes |
| --- | --- | --- | --- |
| `class` | string | Optional | Versioned machine-class name. |
| `profileVersion` | string | Optional | Immutable profile version. |
| `minimums` | map&lt;string, unsigned integer&gt; | Optional | Defaults to `{}`; metric meanings come from the profile. |

Do not add resolved catalog fields, current availability, or performance
observations. They are launch facts.

### `requirements.evidence[]`

Every field is required:

| Field | Type | Notes |
| --- | --- | --- |
| `profile` | string | Versioned evidence profile. |
| `metric` | string | Metric within that profile. |
| `minimum` | unsigned integer | Required threshold. |
| `maxAgeMs` | unsigned integer | Maximum age of accepted evidence. |
| `minimumSamples` | unsigned integer | Minimum observation count. |
| `minimumConfidenceBps` | unsigned 16-bit integer | Minimum confidence in basis points; use 0–10,000. |
| `strength` | enum | `required` or `preferred`. |

### `placement.groups[]` (Gated)

| Field | Type | Presence | Rules |
| --- | --- | --- | --- |
| `name` | string | Required | Non-empty and unique. |
| `count` | unsigned integer | Required | Greater than zero. |
| `geography` | tagged union | Required | Country or versioned region selector. |

All group counts must sum exactly to `deployment.parallelism`.

Country selector:

```json
{
  "kind": "country",
  "standard": "ISO-3166-1-alpha-2",
  "values": [
    "GB",
    "US"
  ]
}
```

`values` must be non-empty two-character uppercase codes.

Region selector:

```json
{
  "kind": "region",
  "catalog": "proof.liskov.geo.v1",
  "values": [
    "eu-west"
  ]
}
```

`catalog` and `values` must be non-empty.

### `placement.topologyConstraints[]` (Gated)

Every field is required:

| Field | Values |
| --- | --- |
| `kind` | `affinity`, `anti_affinity` |
| `scope` | `this_deployment` |
| `topologyKey` | `processor`, `operator`, `manager`, `country`, `region` |
| `strength` | `required`, `preferred` |

### `placement.processorSelection`

The tagged union discriminator is `mode`.

Shared optional fields:

| Field | Type | Default / notes |
| --- | --- | --- |
| `excludeManagers` | string[] | `[]`. |
| `allowUnknownManager` | boolean | `false`. |
| `requireScheduleClear` | boolean | `false`. |
| `requireConsumerAccess` | boolean | `false`. |
| `maxHeartbeatAgeSeconds` | unsigned integer | Optional. |
| `candidateLimit` | unsigned integer | Optional. |
| `scanLimit` | unsigned integer | Optional. |

Open market:

```json
{
  "mode": "open_market"
}
```

No additional required fields.

Manager:

```json
{
  "mode": "manager",
  "managerId": "partner-manager"
}
```

`managerId` is required.

Static:

```json
{
  "mode": "static",
  "processorIds": [
    "5ProcessorAddressA"
  ],
  "managerId": "optional-manager-binding"
}
```

`processorIds` is required. `managerId` is optional.

## `deployment.lifecycle`

All three fields are required:

| Field | Type | Meaning |
| --- | --- | --- |
| `renewal` | tagged union | Successor timing when policy digest is unchanged. |
| `update` | object | Successor timing and predecessor behavior when policy changes. |
| `recovery` | object | Launch and runtime failure budgets. |

### `lifecycle.renewal`

After scheduled end:

```json
{
  "mode": "after_scheduled_end"
}
```

Fixed before scheduled end:

```json
{
  "mode": "before_scheduled_end",
  "leadTime": {
    "mode": "fixed",
    "durationMs": 600000
  }
}
```

Fixed `durationMs` must be 60,000 through the lesser of 1,800,000 and half of
`deployment.schedule.durationMs`.

Automatic before scheduled end (gated):

```json
{
  "mode": "before_scheduled_end",
  "leadTime": {
    "mode": "automatic",
    "profile": "proof.liskov.renewal-lead.v1"
  }
}
```

The automatic profile must be exactly `proof.liskov.renewal-lead.v1`.

### `lifecycle.update`

| Field | Type | Values |
| --- | --- | --- |
| `timing` | enum | `next_scheduled_renewal`, `immediate` |
| `existingJobs` | tagged union | Run to scheduled end or cooperative cease. |

Run until end:

```json
{
  "mode": "run_until_scheduled_end"
}
```

Cooperative cease:

```json
{
  "mode": "cooperative_cease",
  "trigger": "successor_runtime_ready"
}
```

Trigger values:

- `rollout_started`;
- `successor_processor_claimed`;
- `successor_runtime_ready`.

### `lifecycle.recovery`

| Field | Type | Presence | Default |
| --- | --- | --- | --- |
| `launch` | object | Optional | `{ "maxRetries": 5 }`. |
| `runtimeFailure` | tagged union | Required | — |

`launch.maxRetries` accepts 0–10. Explicit zero disables launch retries.

Wait until end:

```json
{
  "mode": "wait_until_scheduled_end"
}
```

Replace after failure (gated):

| Field | Type | Default | Bounds |
| --- | --- | ---: | ---: |
| `mode` | string | Required | `replace_after_failure` |
| `contactLossAfterMs` | unsigned integer | 300,000 | 120,000–1,800,000 |
| `restartGraceMs` | unsigned integer | 600,000 | 0–86,400,000 |
| `maxSameJobRestarts` | unsigned integer | 3 | 0–50 |
| `maxFreshRegistrationReplacements` | unsigned integer | 2 | 0–10 |

## `ingress`

| Field | Type | Presence | Notes |
| --- | --- | --- | --- |
| `http` | object | Optional | HTTP ingress request. |
| `ssh` | object | Optional | SSH ingress request. |

Mode values are `disabled`, `optional`, and `required`. Optional ingress is
typed but capability-gated. Simultaneous HTTP and SSH ingress is also
capability-gated.

### `ingress.http`

| Field | Type | Presence | Notes |
| --- | --- | --- | --- |
| `mode` | enum | Required | `disabled`, `optional`, `required`. |
| `port` | unsigned 16-bit integer | Required | Use 1–65,535 for a usable endpoint. |
| `healthPath` | string | Optional | HTTP readiness path, such as `/health`. |

### `ingress.ssh`

| Field | Type | Presence | Default |
| --- | --- | --- | --- |
| `mode` | enum | Required | — |
| `port` | unsigned 16-bit integer | Optional | `22`. |

## `observability`

| Field | Type | Presence | Default |
| --- | --- | --- | --- |
| `logs` | object | Optional | `{ "enabled": false }`. |
| `runtimeDiagnostics` | object | Optional | `{ "signed": true }`. |

### `observability.logs`

| Field | Type | Presence | Default / notes |
| --- | --- | --- | --- |
| `enabled` | boolean | Optional | `false`. |
| `profileId` | string | Optional | Versioned logging profile. |
| `sinkName` | string | Optional | Named configured sink. |
| `context` | map&lt;string, string&gt; | Optional | `{}`; non-secret structured context. |

### `observability.runtimeDiagnostics`

| Field | Type | Default | Rule |
| --- | --- | --- | --- |
| `signed` | boolean | `true` | `false` is invalid. |

## `configuration`

| Field | Type | Presence | Default |
| --- | --- | --- | --- |
| `variables` | object[] | Optional | `[]`. |
| `secrets` | object[] | Optional | `[]`. |

### `configuration.variables[]`

| Field | Type | Presence | Default / notes |
| --- | --- | --- | --- |
| `name` | string | Required | Runtime variable name. |
| `required` | boolean | Optional | `false`. |
| `default` | string | Optional | Non-secret default. |
| `managed` | boolean | Optional | `false`; `true` means Liskov supplies the value. |

Never put secret plaintext in `default`.

### `configuration.secrets[]`

| Field | Type | Presence | Default / notes |
| --- | --- | --- | --- |
| `secretId` | string | Required | Stable secret identifier; not secret material. |
| `required` | boolean | Optional | `true`. |
| `destination` | tagged union | Required | Environment variable or file. |
| `bundleId` | string | Optional | Groups related secret material. |

Environment destination:

```json
{
  "kind": "env",
  "name": "DATABASE_URL"
}
```

File destination:

```json
{
  "kind": "file",
  "path": "/run/secrets/config.json"
}
```

## Contract Constants

| Constant | Value |
| --- | --- |
| Schema | `proof.liskov.application-policy` |
| Schema version | `4` |
| Read-contract version | `2` |
| Mandatory trust profile | `proof.liskov.attested-runtime.v1` |
| Automatic renewal profile | `proof.liskov.renewal-lead.v1` |
| Contract maximum parallelism | 64 |
| Application-wide submitted-successor surge | 1 |
| Application reconciliation lease | 30 seconds |

## Validation Codes

| Code | Meaning |
| --- | --- |
| `invalid_policy` | Wrong required value, type, enum, bound, or cross-field invariant. |
| `unknown_field` | A strict object contains an unrecognized property. |
| `unsupported_policy_feature` | Valid contract value is not enabled by the current control plane. |
| `entitlement_exceeded` | Account entitlement is below the requested policy authority. |
| `application_identity_mismatch` | Authored application identity does not match the publication target. |

See [Validation and versioning](../policy/validation-and-versioning.md) for
digests, immutable policy records, and safe change review.
