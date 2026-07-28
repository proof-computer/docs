---
title: How Liskov works
description: Understand the customer-to-runtime sequence and the responsibilities shared by Liskov, GitHub, IPFS, Acurast, and your external services.
---

# How Liskov works

Liskov is a control plane for long-running intent over time-boxed Acurast jobs.
You select or build immutable code, declare its authority, fund service in USD,
and inspect evidence as Acurast phones execute it in trusted hardware.

## End-to-end sequence

```mermaid
sequenceDiagram
  participant U as Customer
  participant L as Liskov
  participant G as GitHub / Marketplace
  participant A as Acurast network
  participant P as Processor secure runtime

  U->>L: Select offering or import Manifest V4
  G->>L: Attest exact artifact provenance
  U->>L: Review policy, quote, and reserve
  L->>A: Register bounded job
  A-->>L: Job and processor evidence
  P->>L: Signed bootstrap identity
  L-->>P: Job-bound configuration and secrets
  P->>L: Signed readiness and diagnostics
  L-->>U: Posture, Action Plan, proof, logs, charges
```

Marketplace starts from a curated pinned artifact and option schema. The
GitHub path starts from a V4 manifest and an allowed workflow that builds,
pins, and attests an artifact. Both converge on an immutable effective policy.

## Desired state and observed state

The policy says what Liskov is authorized to seek: artifact, runtime,
configuration, schedule, placement, lifecycle, and spend bounds. The network
then produces observed facts: quote, reserve, registration, processor
assignment, runtime contact, actual overlap or gap, and final charge.

Liskov does not rewrite observed history to match intent. If a successor is
late, the timeline records a gap. If a registered predecessor continues during
an update, the timeline records overlap.

## What the customer controls

You control organization access, release choice, authored authority, managed
configuration, external accounts, confirmation of spend-bearing work, and
lifecycle requests. Liskov manages network payment and replacement planning
within those bounds. Acurast owns chain registration and processor assignment.
The processor runs the job. Your external services remain their own trust and
cost boundaries.

Start with [Applications, policies, artifacts, deployments, and jobs](./domain-model.md),
then read [Trust and data boundaries](./trust-boundaries.md).
