---
title: First Deploy
description: Write a V4 liskov.json, preflight, and run your first custody execution.
---

# First Deploy

This page takes a GitHub Node.js webserver from a strict V4 policy to a sealed
deployment on an Acurast phone.

## 1. Declare The App

Create `liskov.json` in your repository:

```json title="liskov.json"
{
  "schema": "proof.liskov.application-policy",
  "schemaVersion": 4,
  "applicationId": "my-app",
  "metadata": {
    "appType": "managed-web-app",
    "description": "My first Liskov HTTP service."
  },
  "artifact": {
    "kind": "ipfs",
    "cid": "bafy-replace-with-your-cid",
    "encryption": {
      "mode": "none"
    }
  },
  "build": {
    "github": {
      "repository": "my-org/my-app",
      "allowedRefs": [
        "refs/heads/main"
      ],
      "workflowRef": "my-org/my-app/.github/workflows/liskov.yml@refs/heads/main",
      "path": "liskov.json"
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
    "requiredModules": [
      "network"
    ]
  },
  "deployment": {
    "parallelism": 1,
    "schedule": {
      "durationMs": 1800000,
      "maxStartDelayMs": 300000
    },
    "lifecycle": {
      "renewal": {
        "mode": "before_scheduled_end",
        "leadTime": {
          "mode": "fixed",
          "durationMs": 300000
        }
      },
      "update": {
        "timing": "next_scheduled_renewal",
        "existingJobs": {
          "mode": "run_until_scheduled_end"
        }
      },
      "recovery": {
        "launch": {
          "maxRetries": 3
        },
        "runtimeFailure": {
          "mode": "wait_until_scheduled_end"
        }
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

V4 rejects unknown fields. The complete contract is in the
[policy schema reference](../reference/policy-schema.md); the
[Policy handbook](../policy/index.md) explains how the sections work together.

## 2. Import And Publish

Register the app from GitHub. `--publish` freezes an immutable policy version:

```fish
proof liskov application import --github my-org/my-app --publish
```

Inspect the authored and effective policy, version, digest, and rollout:

```fish
proof liskov application status my-app
proof liskov application plans my-app
```

## 3. Preflight

Preflight validates policy semantics, platform capability, account entitlement,
artifact, placement, spend, secrets, and required ingress. It does not spend:

```fish
proof liskov custody preflight my-app
```

Read every diagnostic and quote cap before continuing. If a required secret is
missing, grant it first — see [Sealed secrets](../guides/sealed-secrets.md).

## 4. Launch

Run exactly one custody execution:

```fish
proof liskov custody execution run-one my-app --yes-spend
```

`--yes-spend` is stricter than a plain confirmation. Liskov creates the bounded
job, funds the accepted quote, waits for identity-bound runtime registration,
and opens the required HTTP route.

## 5. Watch Canonical State

```fish
proof liskov application status my-app
```

Watch the exact policy digest, deployment, job, processor claim, runtime
readiness, and schedule boundary. The full sequence is in
[Deployment lifecycle](../concepts/deployment-lifecycle.md).

## Next

- Learn the policy model: [Policy fundamentals](../policy/fundamentals.md).
- Start from another workload: [Workload recipes](../policy/workload-recipes.md).
- Understand renewal and updates: [Lifecycle design](../policy/lifecycle.md).
- If launch stalls: [Troubleshooting](../troubleshooting/index.md).
