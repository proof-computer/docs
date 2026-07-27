---
title: Workload Recipes
description: Complete V4 policies for workers, HTTP services, static and managed placement, evidence-gated pipelines, fleets, and recovery-sensitive workloads.
---

# Workload Recipes

These are complete strict V4 build manifests. Give each example the exact
repository, allowed refs, workflow identity, and manifest path that owns its
build. The checked-in examples contain no placeholder CIDs or artifact digests;
the authorized workflow produces an immutable artifact version separately.

## Choose A Starting Point

| Workload | Start with | Key decisions |
| --- | --- | --- |
| Queue consumer or cron-like worker | [Minimal worker](#minimal-worker) | No ingress, after-end renewal, no runtime replacement |
| Long-running API or web service | [HTTP service](#http-service) | Fixed overlap, HTTP readiness, secrets, encrypted logs |
| Audited hardware workload | [Static processor job](#static-processor-job) | Exact processor allowlist and schedule-clear proof |
| Contracted processor pool | [Manager-pool service](#manager-pool-service) | Manager identity and bounded discovery |
| Confidential data pipeline | [Evidence-gated pipeline](#evidence-gated-pipeline) | Runtime image, machine profile, fresh evidence, file secrets |
| Multi-region service | [Multi-region fleet](#multi-region-fleet-capability-gated) | Stable slots, counted geography, topology, automatic lead |
| Failure-sensitive worker | [Recovery policy](#replacement-after-failure-capability-gated) | Contact-loss evidence and bounded replacement budgets |

## Minimal Worker

Use this for work that can tolerate a gap between schedules and does not need
public ingress:

```json
{
  "schema": "proof.liskov.application-manifest",
  "schemaVersion": 4,
  "applicationId": "queue-worker",
  "release": {
    "mode": "build",
    "artifact": {
      "kind": "ipfs_bundle",
      "encryption": {
        "mode": "none"
      }
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

[Download the complete minimal worker policy](/examples/liskov/policies/minimal-worker.json).

Why it is conservative:

- one stable slot;
- no paid overlap;
- updates wait for the renewal boundary;
- the old job runs to scheduled end; and
- runtime failure does not authorize a new registration.

## HTTP Service

The HTTP example adds:

- a GitHub build release requiring an encrypted IPFS artifact;
- open-market processor safety gates;
- ten minutes of scheduled renewal lead;
- immediate updates that request cease only after the successor is ready;
- explicit reward, fee, and Service Credit caps;
- required HTTP ingress with `/health`;
- encrypted structured logs; and
- managed variables plus env/file secret destinations.

The lifecycle core is:

```json
{
  "renewal": {
    "mode": "before_scheduled_end",
    "leadTime": {
      "mode": "fixed",
      "durationMs": 600000
    }
  },
  "update": {
    "timing": "immediate",
    "existingJobs": {
      "mode": "cooperative_cease",
      "trigger": "successor_runtime_ready"
    }
  },
  "recovery": {
    "launch": {
      "maxRetries": 5
    },
    "runtimeFailure": {
      "mode": "wait_until_scheduled_end"
    }
  }
}
```

[Download the complete HTTP service policy](/examples/liskov/policies/http-service.json).

Choose `successor_runtime_ready` rather than `rollout_started` when availability
matters more than minimizing overlap. Cooperative cease still falls back to the
old schedule end.

## Static Processor Job

Static selection is appropriate when processors have been audited out of band:

```json
{
  "processorSelection": {
    "mode": "static",
    "processorIds": [
      "5ProcessorAddressA",
      "5ProcessorAddressB"
    ],
    "managerId": "audited-manager",
    "allowUnknownManager": false,
    "requireScheduleClear": true,
    "requireConsumerAccess": true,
    "maxHeartbeatAgeSeconds": 120,
    "candidateLimit": 2,
    "scanLimit": 2
  }
}
```

[Download the complete static processor policy](/examples/liskov/policies/static-processor-job.json).

The two processor IDs are eligible candidates for one slot; they do not create
two simultaneous jobs. Set `deployment.parallelism` separately when fleet
capability is enabled.

## Manager-Pool Service

Manager selection constrains discovery to one known manager:

```json
{
  "processorSelection": {
    "mode": "manager",
    "managerId": "partner-manager",
    "allowUnknownManager": false,
    "requireScheduleClear": true,
    "requireConsumerAccess": true,
    "maxHeartbeatAgeSeconds": 300,
    "candidateLimit": 8,
    "scanLimit": 32
  }
}
```

[Download the complete manager-pool policy](/examples/liskov/policies/manager-pool-service.json).

Use this for contractual pools where manager identity is part of the trust and
commercial boundary. Keep `scanLimit` larger than `candidateLimit` so filtering
can reject stale or occupied processors without immediately exhausting the
search.

## Evidence-Gated Pipeline

This example combines a versioned runtime image, machine minimums, and recent
processor evidence:

```json
{
  "requirements": {
    "trustProfile": "proof.liskov.attested-runtime.v1",
    "machine": {
      "class": "confidential-compute",
      "profileVersion": "v2",
      "minimums": {
        "memoryMiB": 2048,
        "storageMiB": 4096
      }
    },
    "evidence": [
      {
        "profile": "proof.liskov.processor-evidence.v1",
        "metric": "successful_attested_launches",
        "minimum": 20,
        "maxAgeMs": 86400000,
        "minimumSamples": 20,
        "minimumConfidenceBps": 9500,
        "strength": "required"
      }
    ]
  }
}
```

[Download the complete evidence-gated pipeline policy](/examples/liskov/policies/evidence-gated-pipeline.json).

The policy names immutable requirement profiles. The actual evidence records
and selected processor are launch facts, so fresh observations do not require
policy republication.

## Multi-Region Fleet (Capability-Gated)

The advanced fleet example demonstrates the complete long-lived contract:

- four stable Liskov slots;
- two country-bound US slots and two versioned-region European slots;
- required processor anti-affinity and preferred operator anti-affinity;
- automatic lead using `proof.liskov.renewal-lead.v1`; and
- bounded replacement after runtime failure.

[Download the complete multi-region fleet policy](/examples/liskov/policies/multi-region-fleet-gated.json).

This policy can be schema-valid while execution is rejected with
`unsupported_policy_feature` or `entitlement_exceeded`. Counted groups,
topology, automatic lead, parallelism above one, and replacement after failure
each require their own enabled capability and entitlement.

## Replacement After Failure (Capability-Gated)

Use the recovery example to study the failure contract without the additional
fleet features:

```json
{
  "runtimeFailure": {
    "mode": "replace_after_failure",
    "contactLossAfterMs": 300000,
    "restartGraceMs": 600000,
    "maxSameJobRestarts": 3,
    "maxFreshRegistrationReplacements": 2
  }
}
```

[Download the complete recovery policy](/examples/liskov/policies/recovery-policy-gated.json).

This does not mean “retry forever.” It says:

- wait five minutes before contact loss qualifies;
- allow ten minutes of restart grace;
- accept at most three same-job restarts; and
- authorize at most two fresh-registration replacements.

Every counter is explicit and bounded. Learn the evidence and transition model
in [Lifecycle design](./lifecycle.md).

## Adapting A Recipe

Change one concern at a time:

1. set the exact release requirement and builder authority;
2. size runtime resources and network quota;
3. choose schedule duration and renewal mode;
4. select processors and placement requirements;
5. set spend caps from a reviewed preflight;
6. add ingress and its readiness path;
7. declare variables and secret destinations; and
8. add observability without putting sensitive values in manifest JSON.

After each change, validate both schema semantics and the target control
plane's capability/entitlement response.
