---
title: Manifest and Policy Fundamentals
description: Understand authored manifests, release resolution, effective policies, identities, and digests.
---

# Manifest and Policy Fundamentals

An application manifest declares acceptable release, execution, and security
boundaries. It is not a deployment script and it is not the policy consumed by
the executor. Liskov resolves its release and materializes the effective policy.

## A Build Release

```json title=".liskov/application-manifest.json"
{
  "schema": "proof.liskov.application-manifest",
  "schemaVersion": 4,
  "applicationId": "queue-worker",
  "release": {
    "mode": "build",
    "artifact": {
      "kind": "ipfs_bundle",
      "encryption": { "mode": "none" }
    },
    "builder": {
      "kind": "github",
      "repository": "example/queue-worker",
      "allowedRefs": ["refs/heads/main"],
      "workflowRef": "example/queue-worker/.github/workflows/liskov-release.yml@refs/heads/main",
      "manifestPath": ".liskov/application-manifest.json"
    }
  },
  "runtime": {
    "engine": "nodejs",
    "command": "node worker.js",
    "resources": {
      "memoryMiB": 256,
      "storageMiB": 64,
      "networkRequestQuota": 100
    },
    "requiredModules": ["network"]
  },
  "deployment": {
    "parallelism": 1,
    "schedule": {
      "durationMs": 1800000,
      "maxStartDelayMs": 300000
    },
    "lifecycle": {
      "renewal": { "mode": "after_scheduled_end" },
      "update": {
        "timing": "next_scheduled_renewal",
        "existingJobs": { "mode": "run_until_scheduled_end" }
      },
      "recovery": {
        "launch": { "maxRetries": 3 },
        "runtimeFailure": { "mode": "wait_until_scheduled_end" }
      }
    }
  }
}
```

[Download the complete manifest](/examples/liskov/policies/minimal-worker.json).

The required top-level fields are `schema`, `schemaVersion`, `applicationId`,
`release`, and `deployment`. Runtime, ingress, observability, configuration,
and metadata have deterministic defaults, although an omitted runtime may not
be useful.

## Release Is A Tagged Union

A manifest has exactly one release arm:

- `mode: "build"` declares an artifact requirement and exact GitHub builder
  authority. It contains no CID, artifact digest, image URL, upload session, or
  publication switch.
- `mode: "pinned"` declares one resolved artifact. An IPFS bundle has a
  canonical `ipfs://` CID, a `sha256:` digest, and explicit encryption. A
  runtime image has an immutable image digest plus its generated bootstrap CID
  and bootstrap digest.

Build results are immutable artifact versions. Publication of a build release
selects an exact `artifactVersionId`; it never means “use the latest build.”

## Application Identity

`applicationId` is the authored identifier. `applicationUid` is an optional
server-issued immutable identity guard. Never invent a UID; add the issued
value only when the manifest should fail against any other application record.

Metadata is authored, but it is not copied into the effective policy. Owner,
organization, status, timestamps, source commit, workflow evidence, and
publication state are server-owned envelope or artifact evidence.

## Three Digests

| Digest | Identifies | Ordering |
| --- | --- | --- |
| `authoredDigest` | Exact canonical authored manifest | Array order remains evidence-visible |
| `releaseIntentDigest` | Application ID plus normalized release requirements and builder authority | `allowedRefs` is set-normalized |
| `policyDigest` | Complete normalized effective policy, including UID and resolved artifact | Set-like execution collections are normalized |

Metadata changes affect only `authoredDigest`. Builder or release requirement
changes affect `authoredDigest` and `releaseIntentDigest`. Resolved artifact,
runtime, deployment, ingress, observability, configuration, or application UID
changes affect `policyDigest`.

Jobs, runtime registration, and identity-bound secret grants bind only to
`policyDigest`. Dynamic processor choice, price, availability, and secret
version remain launch facts.

## Strict Collections

Required modules, excluded managers, static processor IDs, placement groups,
topology constraints, variables, and secrets are normalized before effective
hashing. Duplicate or conflicting keyed entries fail validation; Liskov never
silently deduplicates them.
