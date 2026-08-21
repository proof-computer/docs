---
unlisted: true
title: Clustering and durable state after retained V5
description: Explain why cohort, topology, hooks, health probes, and durable state are deferred from retained V5.
---

# Clustering and durable state after retained V5

:::danger[Not released]

This is a future policy-version boundary, not a configuration guide. Retained
V5 does not contain cohort, hooks, ingress, health-probe, placement-diversity,
or durable-state fields.

:::

Retained V5 may run one or two jobs and phase two jobs simultaneously or evenly.
That is not a cluster contract. Liskov does not provide membership discovery,
quorum, one-address routing, topology diversity, shared storage, snapshot,
restore, or join/drain sequencing in V5.

Do not carry an earlier V5 draft forward. The exact retained schema rejects:

- `cohort` and `hooks` roots;
- `state` values other than `{ "mode": "off" }`;
- placement `allow`, `exclude`, `spread`, or `distribution`;
- public/provider ingress and health probes; and
- provider integration roots.

A future exact policy pair must introduce those capabilities coherently. Until
that pair is released, applications that require them need an application-owned
design outside Liskov's retained V5 guarantees.
