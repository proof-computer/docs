---
title: Processor placement
description: Use the supported open Acurast market and distinguish authored requirements from launch-time facts.
---

# Processor placement

For v1, Liskov selects one eligible processor through the Acurast open market.
The processor is a phone that accepts the job and runs it in a trusted execution
environment (TEE). Its exact identity and market terms are launch-time facts,
not values you should hard-code.

## Supported declaration

```json
{
  "deployment": {
    "parallelism": 1,
    "placement": {
      "requirements": {
        "trustProfile": "proof.liskov.attested-runtime.v1"
      },
      "processorSelection": {
        "mode": "open_market"
      }
    }
  }
}
```

The trust profile is mandatory and cannot be weakened. Omit `requirements` if
you only need its secure default. The open market can return a different
processor for a later job.

## Authored requirements versus observed facts

The policy may contain durable requirements. Current processor availability,
quoted market reward, chosen processor, manager, assignment time, and observed
performance belong to deployment evidence. Treat them as outcomes to inspect,
not promises encoded in an Application description.

The V4 schema can express counted geography groups, topology constraints,
manager selection, static processor IDs, heartbeat filters, and other
selection controls. Those features are not enabled for the first public
capability set. A structurally valid field may still fail publication with
`unsupported_policy_feature` or `entitlement_exceeded`.

## Verify

After submission, wait for processor assignment, then verify the processor and
job IDs in the deployment timeline. Assignment proves a market participant
accepted the job; wait for signed runtime contact before calling the
Application ready.

See [Deployments, jobs, and timelines](../operate/deployments-jobs.md) for the
evidence sequence and [Capabilities and limits](../reference/capabilities.md)
for availability.
