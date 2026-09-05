---
title: Retained Application Manifest V5 reference
description: Exact retained V5 fields, defaults, bounds, cross-field rules, release identity, and deferred roots.
---

# Retained Application Manifest V5 reference

:::note[Exact retained release]

This reference covers RC
`sha256:549272988045e9357c4945850706569ed8dc7f0c6f419b7cf5c57d54b294bb10`.
[Capabilities and limits](./capabilities.md) owns current availability, and
[Application Manifest V4](./manifest-v4.md) remains supported.

:::

For a guided path, see
[Author a retained Application Manifest V5](../build/manifest-v5.md).

## Contract identity

| Artifact | Exact identity |
| --- | --- |
| RC domain | `proof.liskov.policy-v5-rc.v1` |
| RC digest | `sha256:549272988045e9357c4945850706569ed8dc7f0c6f419b7cf5c57d54b294bb10` |
| Manifest schema | `sha256:38ca88eefe599d9a13b0906fb7ae86be002fb7aa15767925a2fe11908fec95da` |
| Effective-policy schema | `sha256:5907054022521f9926164d1e899fa89ecf931ea916da5d7989a6c58015053c30` |
| Retained corpus | 25 manifests from `liskov-examples@880ea6d8b6fb3bb9d0ff7b70cb6cd2c0cc6a0451` |
| Implementation closeout | 31 retained rows, implemented dark |
| Production registration | `v4_and_v5` (handler generation 96, verified 2026-09-04) |
| Activation authorized | `true` |

The generated authored schema is served read-only at:

```text
GET /api/application-manifest/v5/schema
```

The route is available to authoring tools. A schema response describes the
exact document shape; publication and execution still apply capability,
entitlement, evidence, and spend gates.

## Conventions

- Fields marked **required** must be present. Unknown fields fail closed.
- JSON and YAML are accepted. Duplicate keys fail in either form. YAML anchors,
  aliases, merge keys, explicit tags, and multiple documents fail.
- Durations are one integer plus `ms`, `s`, `m`, `h`, or `d`.
- Byte sizes are one integer plus `B`, `KiB`, `MiB`, `GiB`, `TiB`, `KB`, `MB`,
  `GB`, or `TB`.
- Money values are decimal strings matching `0|[1-9][0-9]{0,24}`.
- UTC bounds use exactly `YYYY-MM-DDTHH:MM:SSZ` and must be real dates.
- Tagged unions are closed; a discriminator never permits fields from another
  arm.

## Root document

| Field | Required | Type and rule |
| --- | --- | --- |
| `schema` | yes | `proof.liskov.application-manifest` |
| `schemaVersion` | yes | integer `5` |
| `applicationId` | yes | organization-local slug, 1–63 lowercase letters/digits/hyphens |
| `metadata` | no | authored-only description and labels |
| `release` | yes | source or pinned artifact |
| `runtime` | yes | JavaScript or curated native image |
| `execution` | yes | once, continuous, or interval |
| `deployment` | yes | jobs, paid window, placement, lifecycle, spend |
| `access` | no | retained managed Runtime SSH only |
| `configuration` | no | variables and secrets |
| `observability` | no | managed logging |
| `state` | yes | exactly `{ "mode": "off" }` |
| `debug` | no | diagnostic hold, fixtures only |

`metadata.description` is at most 500 characters. `metadata.labels` has at most
32 values matching `[a-z0-9][a-z0-9._-]{0,62}`. Metadata does not enter the
effective policy digest and cannot re-run a one-shot application.

## `release`

| `mode` | Required fields | Meaning |
| --- | --- | --- |
| `source` | none | Build from exact server-bound GitHub evidence |
| `pinned` | `artifact.digest` | Use one artifact by `sha256:<64 lowercase hex>` |

Source builder repository, ref, workflow, and manifest path are server-side
authority. A pinned artifact contains only its digest; CID, encryption mode,
and artifact kind are resolved evidence.

## `runtime`

### JavaScript

```json
{
  "kind": "javascript",
  "engine": "nodejs",
  "entrypoint": {"file": "bundle.js"}
}
```

`engine` defaults to `nodejs`. The entrypoint is relative to the immutable
artifact root, cannot begin with `/`, and cannot contain a `..` segment.

### Native image

```json
{
  "kind": "native_image",
  "image": {
    "catalog": "liskov-runtime-images",
    "name": "debian-trixie",
    "version": "0.1"
  },
  "entrypoint": {
    "executable": "/bin/sh",
    "args": ["/app/start.sh"]
  }
}
```

`image.catalog` defaults to `liskov-runtime-images`. Catalogue and image names
are 1–63 lowercase letters/digits/hyphens and are checked server-side. Version
is a one- to three-part numeric floor, resolved to an exact digest. Entrypoint
arguments have at most 64 items. No shell string or inline program is parsed.

## `execution`

| `mode` | Fields | Meaning |
| --- | --- | --- |
| `once` | none | One occurrence, then terminal |
| `continuous` | optional `until` | Successive paid windows until the bound or indefinitely |
| `interval` | required `every`, optional `until` | New occurrence on a cadence |

A settled `once` application does not run again on its own, and Liskov never
re-runs it as a recovery retry. The supported way to run the same document
again today is a new Application, which counts against your organization's
job slots; a manual re-run verb is planned.

## `deployment`

| Field | Required | Type, default, and bound |
| --- | --- | --- |
| `jobs` | no | integer 1–256, default 1; first-public admission maximum 2 |
| `schedule.duration` | yes | duration of one paid job window |
| `schedule.phasing` | no | `simultaneous` or `evenly_spaced`; default behavior is simultaneous |
| `placement` | no | capability minimums and/or exact processor selection |
| `lifecycle` | no | renewal and update policy |
| `spend` | yes | managed Service Credit authority |

For `evenly_spaced`, `jobsPerPhase` defaults to 1, must not exceed `jobs`, and
must divide it exactly. `simultaneous` accepts no `jobsPerPhase`.

### `placement`

`minimums` contains at least one of:

| Field | Meaning |
| --- | --- |
| `memory` | total device RAM floor as a byte size |
| `storage` | available storage floor as a byte size |
| `cpuSingleCoreScore` | integer benchmark floor, 1–9,007,199,254,740,991 |
| `cpuMultiCoreScore` | integer benchmark floor, 1–9,007,199,254,740,991 |

`processorSelection` has `mode: exact` and 1–64 `processorIds`. Omitting it
uses open-market selection. Authored evidence profiles, allow/exclude rules,
spread, distribution, topology, and manager/static selectors are absent.

### `lifecycle`

| Field | Values and default |
| --- | --- |
| `renewal.leadTime` | `automatic` (default) or `fixed` with required `duration` |
| `update.timing` | `immediate` (default) or `next_renewal` |
| `update.existingJobs.mode` | `stop_when_successor_ready` (default) or `run_until_scheduled_end` |

Renewal is valid only for continuous execution. If `existingJobs` is present,
its `mode` is required; an empty object fails.

### `spend`

| Field | Required | Rule |
| --- | --- | --- |
| `unit` | yes | exactly `service_credit_micros` |
| `perJob` | yes | total exposure for one delivered occurrence |
| `rate.amount` | for recurring execution | lifetime ceiling expressed over a window |
| `rate.window` | no | duration; defaults to `30d` |

`continuous` and `interval` require `rate`. The organization guard is not a
fallback for an omitted authored rate.

## `access`

The only retained access arm is:

```json
{
  "ssh": {
    "provider": {"kind": "liskov_managed"}
  }
}
```

It is valid only with `runtime.kind: native_image` and requires both the Runtime
SSH capability and a Developer-or-above entitlement. No authorized
keys, port, mode, or alternate provider is authored. Organization operator keys
are snapshotted into an exact job attachment by the server.

## `configuration`

`variables` and `secrets` each contain at most 64 entries.

| Variable source | Required fields | Optional fields |
| --- | --- | --- |
| `literal` | `name`, `value` | none |
| `managed` | `name` | `required` (default true), `default` |

Environment names match `[A-Z_][A-Z0-9_]{0,127}`.

| Secret field | Rule |
| --- | --- |
| `secretId` | 1–127 letters/digits/dot/underscore/hyphen |
| `required` | defaults to true |
| `destination` | `environment` with `name`, or `file` with absolute `path` |

An environment name may be claimed only once across variables and secret
destinations.

## `observability`, `state`, and `debug`

- `observability.logs.enabled` is the only authored logging field.
- `state` is required and has only `mode: off`.
- `debug.holdOnFailure` defaults to false and is reserved for diagnostic
  fixtures, not ordinary customer operation.

## Deferred to a future policy version

The following are not gated V5 features; they are absent from the exact schema:

- public or provider-owned ingress;
- provider integration blocks;
- cohort membership and discovery;
- join/drain hooks and health probes;
- durable volumes, snapshot, or restore;
- placement allow/exclude, diversity, spread, or distribution;
- Tailscale, tunnel, or other SSH providers; and
- `acu_planck` or other self-custody spend.

Their old draft spellings are rejected as unknown fields or closed-union arms.

## Registered publication setup hold

The registered `POST /api/applications/{id}/policy-versions` request accepts
`dryRun: true` to compile and resolve the submitted `document` and `release`
evidence, then roll back without committing policy, pointer or wakeup. Its
response adds `dryRun: true`; an ordinary committed response remains unchanged.
This does not authorize a schema pair that the server's current generation
has not enabled.

`postPublishStatus: "paused"` plus a trimmed 1–500-character `reason` commits
a paused Application in the same transaction as publication. The reason and
actor are retained, and the setup hold appears in Application activity. The
fields must be provided together; `active` is not an accepted post-publication
option. Omitting them preserves normal publication, including activation of a
previously disabled Application and preservation of an existing pause.

`expectedActivePointerVersion` remains the optimistic concurrency fence.
Use it for both preview and confirmation. `invalid_publication_pause` is a
400 response for an invalid reason/pair; `active_pointer_version_conflict`
requires fresh review. CLI `application policy publish --dry-run` and
`--paused --reason TEXT` expose these fields from version `0.13.0`.
