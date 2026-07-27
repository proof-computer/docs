---
title: Policy Fundamentals
description: Understand the V4 policy mental model, minimum shape, defaults, identity, and immutable effective state.
---

# Policy Fundamentals

Start with a policy as a declaration of boundaries, not a deployment script.
You describe acceptable outcomes and authority; Liskov resolves dynamic facts
such as the chosen processor, current price, schedule availability, and secret
version at launch time.

## A Minimum Useful Worker

This complete policy declares one 30-minute Node.js worker:

```json title="liskov.json"
{
  "schema": "proof.liskov.application-policy",
  "schemaVersion": 4,
  "applicationId": "queue-worker",
  "artifact": {
    "kind": "ipfs",
    "cid": "bafy-replace-with-your-cid",
    "encryption": {
      "mode": "none"
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
        "mode": "after_scheduled_end"
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
    }
  }
}
```

[Download this policy](/examples/liskov/policies/minimal-worker.json).

## Required Top-Level Fields

Only four top-level fields are required:

| Field | Meaning |
| --- | --- |
| `schema` | Exact contract identity: `proof.liskov.application-policy`. |
| `schemaVersion` | Exact version: `4`. |
| `applicationId` | Stable author-facing application identifier. |
| `deployment` | Schedule and lifecycle authority. |

Everything else has an empty or secure default, but omission does not
necessarily make a workload launchable. A real launch normally needs an
artifact and runtime description.

## Identity: `applicationId` And `applicationUid`

`applicationId` is authored and required. It is 1–64 lowercase letters,
numbers, dots, underscores, or dashes, and must start with a letter or number.

`applicationUid` is different: it is an optional immutable identity pin issued
by the server. Do not invent one. Add it only after Liskov has assigned the
application UID and you want publication to fail if the repository is imported
into the wrong application.

Display name, organization, owner, publication timestamps, status, and import
provenance are server-owned. They do not belong in the authored policy.

## Authored, Effective, And Dynamic Facts

Liskov preserves three layers:

| Layer | Contains | Digest |
| --- | --- | --- |
| Authored | Exact JSON you reviewed and published. | `authoredDigest` |
| Effective | Authored policy with deterministic defaults normalized. | `policyDigest` |
| Launch facts | Processor, price, availability, secret versions, resolved profiles, and other observations for one attempt. | Stored with that attempt or grant |

The job, runtime registration, and identity-bound secret grants bind to
`policyDigest`, not to a mutable draft.

Two policies with different whitespace or object-key order have the same
canonical digest. Adding an omitted field whose value equals its default can
change `authoredDigest` while leaving the normalized policy intent equivalent.

## Secure Defaults

The most important defaults are:

```json
{
  "runtime": {
    "bootstrap": {
      "trustProfile": "proof.liskov.attested-runtime.v1",
      "signedDiagnosticsRequired": true,
      "identityBoundSecretsRequired": true
    }
  },
  "deployment": {
    "parallelism": 1,
    "placement": {
      "requirements": {
        "trustProfile": "proof.liskov.attested-runtime.v1"
      },
      "processorSelection": {
        "mode": "open_market",
        "allowUnknownManager": false,
        "requireScheduleClear": false,
        "requireConsumerAccess": false
      }
    }
  },
  "observability": {
    "logs": {
      "enabled": false
    },
    "runtimeDiagnostics": {
      "signed": true
    }
  }
}
```

The trust profile, signed diagnostics, identity-bound secrets, and signed
runtime diagnostics cannot be weakened. Explicit `false` is rejected for the
mandatory booleans.

## Units And Large Integers

- Durations and timestamps are milliseconds.
- `maxHeartbeatAgeSeconds` is seconds.
- Memory and storage use MiB.
- Confidence uses basis points.
- Acurast reward and native-fee caps use decimal strings in planck so JSON
  number precision cannot corrupt them.
- Service Credit caps use integer micros per generation.

## Strict Means Strict

Every object rejects unknown fields:

```json
{
  "deployment": {
    "lifecycle": {
      "renewal": {
        "mode": "after_scheduled_end",
        "renewalWindowMs": 300000
      }
    }
  }
}
```

The example above fails with `unknown_field` at
`/deployment/lifecycle/renewal/renewalWindowMs`. V4 never guesses that an
old or misspelled field means something else.

Next, choose a [workload recipe](./workload-recipes.md) and then learn how its
[lifecycle](./lifecycle.md) behaves.
