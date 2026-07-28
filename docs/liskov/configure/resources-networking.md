---
title: Runtime resources and outbound networking
description: Size memory, storage, and outbound requests for the supported v1 runtime without assuming hosted ingress.
---

# Runtime resources and outbound networking

An Acurast processor is a phone running your time-boxed job in secure hardware.
Resource declarations bound what the workload asks Liskov to schedule; they are
not a promise that every device or external service has identical performance.

## Declare resources

```json
{
  "runtime": {
    "engine": "nodejs",
    "command": "node app.cjs",
    "requiredModules": ["network"],
    "resources": {
      "memoryMiB": 256,
      "storageMiB": 256,
      "networkRequestQuota": 1000
    }
  }
}
```

- `memoryMiB` is the requested memory boundary.
- `storageMiB` is ephemeral local storage for this job.
- `networkRequestQuota` bounds outbound requests under the Acurast runtime.
- `requiredModules` declares capabilities such as `network`.

Explicit zero is preserved; it is not treated as “unset.” Start with measured
needs and leave headroom for the Node.js runtime and SDK. Publication or launch
may reject values outside the enabled capability or organization entitlement.

## Outbound, not inbound

The public v1 repository path can call allowlisted public endpoints over
outbound networking. It does not receive a stable public IP, custom hostname,
Liskov HTTP endpoint, or Liskov SSH endpoint. Processor identity and assignment
can change at renewal.

If an external API allowlists domains or enforces rate limits, include those
facts in your readiness test. Store durable results outside the processor, and
retry network operations with bounded backoff and idempotency.

A curated offering may use an Acurast service such as Tunnel. That is an
offering-specific Acurast boundary, not general Liskov ingress.

## Verify

Test the final bundle under the declared memory and storage assumptions. After
deployment, inspect runtime diagnostics for resource or network blockers and
verify one harmless request to each required external service. A successful
processor assignment alone does not prove network readiness.

See [Capabilities and limits](../reference/capabilities.md) before relying on a
module or resource value not shown in the supported starter manifest.
