---
title: Validation and Versioning
description: Validate V4 manifests, resolve releases, preflight publication, and review immutable policy history.
---

# Validation and Versioning

V4 validation is deterministic and fail closed. Liskov never drops, renames,
clamps, or guesses authored behavior.

## Schemas And Validation

```text
GET  /api/application-manifest/schema
POST /api/application-manifest/validate
GET  /api/application-policy/schema
```

The generated schemas identify
`application-manifest-v4.schema.json` and
`application-policy-v4.schema.json`. Validate locally with the same command
surface used by CI:

```fish
proof liskov application manifest validate \
  --file .liskov/application-manifest.json
```

The manifest response reports `manifestValid`, `authoredDigest`,
`releaseIntentDigest`, and pointer-addressed errors. Capability diagnostics do
not make a structurally valid manifest invalid.

## Publication Preflight

```fish
proof liskov application publish my-app \
  --artifact-version av-... \
  --dry-run
```

Preflight is read-only and reports independent phases:

| Phase | Meaning |
| --- | --- |
| `manifestValid` | Strict parse and semantic checks pass |
| `releaseResolved` | A pinned artifact or exact build artifact version is available |
| `policyValid` | The materialized effective policy is valid |
| `targetSupported` | The current target supports every requested capability |
| `entitled` | Account limits cover the requested authority |
| `publicationEnabled` | The V4 publication gate permits this application |
| `publicationReady` | Every preceding phase passes |

For a build release, `--artifact-version` is required. A stale manifest,
cross-UID artifact, release-intent mismatch, wrong commit/ref/workflow, wrong
artifact kind or encryption, or non-ready build fails closed.

## Publication Race Fence

Actual publication remains explicit:

```fish
proof liskov application publish my-app \
  --artifact-version av-... \
  --yes
```

The CLI first observes preflight, then submits that exact `authoredDigest` as
the race fence. The server locks and revalidates the application UID, stored
manifest, expected digest, selected artifact version, capabilities, and
entitlements in the write transaction.

Publication creates immutable policy history only. It does not create a
deployment, job, proposal, reservation, billing record, lifecycle command, or
runtime-control command.

## Immutable History And Rollout

An immutable policy version records:

- `authoredDigest` and `releaseIntentDigest` in its publication envelope;
- the complete effective policy;
- `policyDigest`;
- the selected artifact-version evidence; and
- its predecessor and publication timestamp.

Multiple publication versions may have the same `policyDigest`. Metadata or
builder changes can therefore create new evidence history without creating a
new lifecycle target. Execution-affecting changes must produce a new
`policyDigest`.

## Common Rejections

- Unknown fields or mixed `release` arms.
- Empty identifiers, unsafe manifest paths, malformed CIDs or digests.
- Duplicate or conflicting set-like entries.
- A CID or image digest inside a build release.
- Builder authority inside a pinned release.
- Server-owned source, upload, status, or publication fields.
- Assuming manifest validity means the target is capable or entitled.
