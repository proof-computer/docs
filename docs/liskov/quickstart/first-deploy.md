---
title: First Manifest and Publication Preflight
description: Author, validate, import, resolve, and preflight a V4 application without deployment or spend.
---

# First Manifest and Publication Preflight

V4 publication is disabled in production while the materialization contract is
rolled out. This guide stops at the safe, read-only preflight boundary; it does
not deploy, reserve, bill, submit, or issue lifecycle commands.

## 1. Author A Manifest

Create `.liskov/application-manifest.json`:

```json
{
  "schema": "proof.liskov.application-manifest",
  "schemaVersion": 4,
  "applicationId": "my-app",
  "metadata": {
    "appType": "managed-web-app",
    "description": "My first Liskov HTTP service."
  },
  "release": {
    "mode": "build",
    "artifact": {
      "kind": "ipfs_bundle",
      "encryption": { "mode": "none" }
    },
    "builder": {
      "kind": "github",
      "repository": "my-org/my-app",
      "allowedRefs": ["refs/heads/main"],
      "workflowRef": "my-org/my-app/.github/workflows/liskov.yml@refs/heads/main",
      "manifestPath": ".liskov/application-manifest.json"
    }
  },
  "runtime": {
    "engine": "nodejs",
    "command": "node server.js",
    "role": "web",
    "resources": {
      "memoryMiB": 256,
      "storageMiB": 128,
      "networkRequestQuota": 1000
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
    },
    "spend": {
      "maxRewardPlanckPerJob": "50000000000",
      "maxNativeFeePlanckPerJob": "10000000000"
    }
  },
  "ingress": {
    "http": {
      "mode": "required",
      "port": 3000,
      "healthPath": "/health"
    }
  }
}
```

## 2. Validate And Import

```fish
proof liskov application manifest validate \
  --file .liskov/application-manifest.json

proof liskov application import \
  --github my-org/my-app:.liskov/application-manifest.json@main \
  --server-fetch
```

Record both returned digests. Import is manifest-only and never publishes.

## 3. Build And Record The Artifact Version

The authorized workflow builds and pins the bundle, then submits its exact
GitHub OIDC commit/ref/workflow plus the observed `authoredDigest` and
`releaseIntentDigest`. Save the returned `artifactVersionId`.

## 4. Run Read-Only Publication Preflight

```fish
proof liskov application publish my-app \
  --artifact-version av-... \
  --dry-run
```

Review all seven phase flags. A valid manifest can still be blocked by
unresolved release evidence, unsupported capability, missing entitlement, or
the production publication gate.

Do not proceed to deployment or spend while V4 publication remains disabled.
See [Validation and versioning](../policy/validation-and-versioning.md) for the
full phase contract.
