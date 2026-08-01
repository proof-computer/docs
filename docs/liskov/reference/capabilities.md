---
title: Capabilities and limits
description: Canonical availability matrix for the v1 customer surface, release-gated features, Preview, internal typed capabilities, and exclusions.
---

# Capabilities and limits

This page is the availability owner. Guides contain only supported recipes.

| Label | Meaning |
| --- | --- |
| **v1** | Supported customer behavior. |
| **Release-gated v1** | Accepted v1 behavior whose final release artifact or rollout is not yet available. Do not assume it is live. |
| **Preview** | Controlled availability with a different support or trust boundary. |
| **Internal** | Platform/compatibility behavior or a typed field not enabled for customers. |
| **Not v1** | Deliberately outside the launch product. |

## Account, Marketplace, and release

| Capability | Availability |
| --- | --- |
| GitHub sign-in; browser-confirmed CLI login | v1 |
| Organizations, switching, team invitations, assignable roles | v1 |
| Plans, terms, Stripe USD funding, Service Credits | v1 |
| Curated first-party Marketplace launch | v1 |
| Uptime Prober | v1 |
| OpenClaw offering | Release-gated v1; no versioned descriptor was present at the reviewed release |
| Third-party Marketplace publishing/payouts | Not v1 |
| Manifest V4 repository import/publication | Release-gated v1 |
| Reusable GitHub build/pin/OIDC workflow | v1; moving `v1` tag verified at `v1.2.2` |
| Pinned first-party IPFS bundle | v1 |
| Private deployed customer code | Not v1; private source access and TEE execution do not make current artifact delivery confidential |
| General customer-authored Cargo/runtime image | Internal |

## Runtime, placement, and lifecycle

| Capability | Availability / limit |
| --- | --- |
| Node.js background bundle and runtime SDK `0.3.26` | v1 |
| Managed variables and managed secrets | v1 |
| Liskov logging and signed diagnostics | v1 |
| Outbound networking and declared quota | v1 |
| Liskov-hosted HTTP/SSH ingress | Not v1 |
| Parallelism | v1 at exactly `1`; schema maximum `64` is not enabled |
| Open-market processor selection | v1 |
| Manager/static selection, placement groups, topology constraints | Internal |
| Job schedule | v1; `durationMs > 0`, account/platform limits also apply |
| Renewal after scheduled end | v1 |
| Renewal before end with fixed lead | v1; 60,000–1,800,000 ms and no more than half the job duration |
| Automatic renewal lead | Internal |
| Immediate or next-renewal update | v1 |
| Existing jobs run to scheduled end | v1 |
| Cooperative cease | Release-gated v1 |
| Launch retry budget | v1; `maxRetries` 0–10, default 5 |
| Runtime replace-after-failure | Internal; v1 waits for scheduled end |

## Operation, money, and custody

| Capability | Availability |
| --- | --- |
| Canonical posture, Action Plan, deployment/job timeline | v1 |
| Proof chain and signed runtime-instance evidence | v1 |
| Pause/resume future planning | v1 |
| Supported bounded Action Plan retry | v1 |
| Safe retirement and immutable receipt | v1 |
| Force stop/delete bypass | Internal; no public bypass |
| Managed custody | v1 default |
| Quote, reserve, final charge, release, history | v1 |
| Customer crypto deposit, swap, balance, withdrawal | Not v1 |
| Self-custody signer | Preview; not in normal navigation until availability is confirmed |

## Product boundaries

Baran is separate and is not Liskov v1 ingress. Acurast Tunnel may be used by
an exact curated offering; it does not become a general repository capability.
Frozen historical implementations and migration workflows are not customer
features.

Valid V4 syntax does not imply availability. Publication can return
`unsupported_policy_feature` or `entitlement_exceeded` for a typed request
outside this matrix.
