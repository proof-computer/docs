---
title: Manifest and Policy Handbook
description: Learn how authored Liskov application manifests become immutable effective V4 policies.
---

# Manifest and Policy Handbook

Humans and repositories author an **application manifest**. Liskov resolves its
release and materializes an immutable **effective policy**. Keeping those
documents separate makes build authority reviewable without confusing it with
the execution state that controls rollout, runtime identity, and Lockbox.

Every authored document uses:

```json
{
  "schema": "proof.liskov.application-manifest",
  "schemaVersion": 4,
  "applicationId": "my-application",
  "release": {
    "mode": "build",
    "artifact": {
      "kind": "ipfs_bundle",
      "encryption": { "mode": "none" }
    },
    "builder": {
      "kind": "github",
      "repository": "my-org/my-application",
      "allowedRefs": ["refs/heads/main"],
      "workflowRef": "my-org/my-application/.github/workflows/liskov.yml@refs/heads/main",
      "manifestPath": ".liskov/application-manifest.json"
    }
  },
  "deployment": {
    "schedule": { "durationMs": 1800000 },
    "lifecycle": {
      "renewal": { "mode": "after_scheduled_end" },
      "update": {
        "timing": "next_scheduled_renewal",
        "existingJobs": { "mode": "run_until_scheduled_end" }
      },
      "recovery": {
        "runtimeFailure": { "mode": "wait_until_scheduled_end" }
      }
    }
  }
}
```

V4 rejects unknown fields, mixed release arms, duplicate set members, malformed
digests, and unsafe manifest paths. It has no provider passthrough block.

## The Materialization Flow

```text
application manifest
  → authoredDigest + releaseIntentDigest
  → pinned artifact or verified build artifactVersionId
  → publication preflight
  → effective application policy + policyDigest
```

`authoredDigest` identifies the exact manifest. `releaseIntentDigest` binds the
release requirements and GitHub authority to build evidence. `policyDigest`
identifies normalized execution and security state; it is the sole rollout,
runtime, and Lockbox identity.

## Learn In This Order

1. [Fundamentals](./fundamentals.md) — the two documents, release modes,
   identity, and digests.
2. [Workload recipes](./workload-recipes.md) — complete build manifests for
   common workload shapes.
3. [Lifecycle design](./lifecycle.md) — schedules, renewal, updates, and
   recovery.
4. [Placement and capabilities](./placement-and-capabilities.md) — placement,
   capability gates, and entitlements.
5. [Validation and versioning](./validation-and-versioning.md) — strict
   validation, preflight, publication, and immutable history.
6. [Schema reference](../reference/policy-schema.md) — authored release fields
   and the materialized policy surface.

## Validation Is Not Execution Authority

Contract validity, target capability, and account entitlement are independent.
A manifest may remain a valid draft while publication is blocked because the
target cannot deliver cooperative cease, a requested ingress combination, or
another typed capability. Never remove safety intent merely to make a target
gate pass.
