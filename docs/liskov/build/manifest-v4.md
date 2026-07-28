---
title: Author an Application Manifest V4
description: Describe a supported build, runtime, schedule, lifecycle, configuration, and spend boundary in the public v1 contract.
---

# Author an Application Manifest V4

The manifest is the strict document you keep in the repository. It describes
what Liskov may build and run. Liskov resolves server-owned facts—such as the
exact artifact version and launch evidence—into an immutable effective policy.

V4 is the only public authoring version. Unknown fields and unsupported
capabilities fail closed.

## Supported starter manifest

```json title=".liskov/application-manifest.json"
{
  "schema": "proof.liskov.application-manifest",
  "schemaVersion": 4,
  "applicationId": "status-worker",
  "metadata": {
    "appType": "background-worker",
    "description": "Checks an external service and records its status"
  },
  "release": {
    "mode": "build",
    "artifact": {
      "kind": "ipfs_bundle",
      "encryption": { "mode": "aes256_gcm" }
    },
    "builder": {
      "kind": "github",
      "repository": "OWNER/REPOSITORY",
      "allowedRefs": ["refs/heads/main"],
      "workflowRef": "OWNER/REPOSITORY/.github/workflows/liskov.yml@refs/heads/main",
      "manifestPath": ".liskov/application-manifest.json"
    }
  },
  "runtime": {
    "engine": "nodejs",
    "command": "node app.cjs",
    "requiredModules": ["network"],
    "resources": {
      "memoryMiB": 256,
      "storageMiB": 256,
      "networkRequestQuota": 1000
    }
  },
  "deployment": {
    "parallelism": 1,
    "schedule": { "durationMs": 3600000 },
    "placement": {
      "processorSelection": { "mode": "open_market" }
    },
    "lifecycle": {
      "renewal": { "mode": "after_scheduled_end" },
      "update": {
        "timing": "immediate",
        "existingJobs": { "mode": "run_until_scheduled_end" }
      },
      "recovery": {
        "launch": { "maxRetries": 5 },
        "runtimeFailure": { "mode": "wait_until_scheduled_end" }
      }
    },
    "spend": {
      "maxServiceCreditMicrosPerGeneration": 5000000
    }
  },
  "observability": {
    "logs": { "enabled": true },
    "runtimeDiagnostics": { "signed": true }
  },
  "configuration": {
    "variables": [
      {
        "name": "API_ENDPOINT",
        "required": true,
        "default": "https://example.com/api",
        "managed": true
      }
    ],
    "secrets": [
      {
        "secretId": "api-token",
        "required": true,
        "destination": { "kind": "env", "name": "API_TOKEN" }
      }
    ]
  }
}
```

Replace both `OWNER/REPOSITORY` values. The example uses the supported v1
capability set: one open-market job, a fixed duration, renewal after scheduled
end, immediate successor updates while old jobs run to end, bounded launch
retries, and no runtime replacement before scheduled end.

`maxServiceCreditMicrosPerGeneration` is a maximum authority of 5,000,000
micros, or USD 5.00 in Service Credits, for one slot generation. It is not the
quoted or final price.

## Validate, then review the digests

```bash
proof liskov application manifest validate \
  --file .liskov/application-manifest.json
```

Validation returns an `authoredDigest` for the exact authored content and a
`releaseIntentDigest` for normalized builder/release authority. Later,
publication creates a `policyDigest` for the immutable effective policy. A
change in any of these is a review event; do not copy one value into another.

Validation proves the document is structurally and semantically acceptable.
It does not prove your organization is entitled to every valid field, that an
artifact exists, or that enough Service Credits are available. Publication
preflight checks those contextual facts.

## Avoid gated fields in recipes

The V4 type system also represents features that are not in the first public
capability set, including parallelism above one, manager/static processor
selection, placement groups, topology constraints, automatic renewal lead,
runtime replace-after-failure, and general ingress. Do not add them because
they appear in a schema. See [Capabilities and limits](../reference/capabilities.md)
before using an unfamiliar field.

The exact field tables, defaults, bounds, and cross-field rules live in the
[Manifest V4 reference](../reference/manifest-v4.md).
