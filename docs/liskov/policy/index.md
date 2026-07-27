---
title: Policy Handbook
description: Learn the Liskov application-policy v4 contract from first principles to advanced lifecycle and placement design.
---

# Policy Handbook

A Liskov policy is the versioned, reviewable contract for one application. It
describes the artifact and runtime you want, how Liskov should place and
schedule jobs, what lifecycle transitions it may perform, the maximum spend it
may authorize, and which configuration, ingress, and observability capabilities
the workload needs.

Every authored policy uses the strict V4 identity:

```json
{
  "schema": "proof.liskov.application-policy",
  "schemaVersion": 4,
  "applicationId": "my-application",
  "deployment": {
    "schedule": {
      "durationMs": 1800000
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
        "runtimeFailure": {
          "mode": "wait_until_scheduled_end"
        }
      }
    }
  }
}
```

V4 rejects unknown fields. It does not contain a compatibility or
provider-specific passthrough block.

## Learn In This Order

1. [Policy fundamentals](./fundamentals.md) — the mental model, minimum valid
   shape, defaults, and the difference between authored intent and launch-time
   facts.
2. [Workload recipes](./workload-recipes.md) — complete policies for workers,
   HTTP services, static placement, manager pools, evidence-gated pipelines,
   fleets, and recovery-sensitive workloads.
3. [Lifecycle design](./lifecycle.md) — schedules, stable slots, renewal,
   updates, recovery, surge, generations, and measured overlap.
4. [Placement and capabilities](./placement-and-capabilities.md) — machine and
   evidence requirements, processor selection, geography, topology, and
   capability gates.
5. [Validation and versioning](./validation-and-versioning.md) — strict parsing,
   JSON pointers, semantic validation, digests, publication records, and safe
   policy evolution.
6. [Complete schema reference](../reference/policy-schema.md) — every field,
   enum, default, bound, and cross-field rule.

## The Five Questions A Policy Answers

| Question | Policy section |
| --- | --- |
| What code runs, and how was it built? | `artifact`, `build`, `runtime` |
| How many jobs run, where, and for how long? | `deployment.parallelism`, `schedule`, `placement` |
| What may Liskov do when time, policy, or health changes? | `deployment.lifecycle` |
| What is the maximum authorized cost? | `deployment.spend` |
| What must be delivered to and exposed from the job? | `configuration`, `ingress`, `observability` |

## Schema Validity Is Not Execution Authority

The schema is deliberately broader than the first executable capability set.
For example, multi-slot fleets, automatic renewal lead calculation, topology
constraints, and replacement after runtime failure are fully typed but may be
capability-gated by a control plane.

A policy passes three distinct checks:

1. **Shape** — valid JSON with only known fields and enum values.
2. **Semantics** — bounds and cross-field invariants are correct.
3. **Capability and entitlement** — this control plane and account are
   authorized to execute the requested behavior.

Never remove safety intent just to make a capability check pass. Select an
executable policy deliberately, or wait for the required capability.
