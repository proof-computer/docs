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
| Organizations, persistent and request-scoped CLI selection, team invitations, assignable roles | v1 |
| Service Credit balance, reservation, and ledger reads | v1; read-only surfaces are supported for an existing organization (Console Account, Billing & funding, and Ledger; CLI billing/transaction reads) |
| Plan catalog and plans page | v1 read of the catalog on `/organizations/new/plan`; paid attach, trial start, and production collection remain release-gated |
| Plan selection and terms acceptance | Release-gated v1; the commercial go-live decision is not complete. Writing a plan id does not activate a paid plan |
| Stripe USD checkout and Service Credit issuance | Release-gated v1; checkout is disabled for customer use and internal acceptance must not be treated as availability |
| Paid subscription activation | Release-gated; a written plan id does not activate a paid plan. Usable only after reconciled Autumn/Stripe payment. Production paid billing is not enabled |
| Curated first-party Marketplace launch | Release-gated v1; limited to internal first-party engineering acceptance |
| Uptime Prober | Release-gated v1; an internal first-party acceptance fixture, not a supported customer offering |
| OpenClaw offering | Release-gated v1; no versioned descriptor was present at the reviewed release |
| Third-party Marketplace publishing/payouts | Not v1 |
| Manifest V4 repository import/publication | Release-gated v1 |
| Retained Manifest V5 / Policy V5 exact pair | v1; exact RC `sha256:549272988045e9357c4945850706569ed8dc7f0c6f419b7cf5c57d54b294bb10`, with one or two jobs and the retained source/runtime/schedule/spend/configuration/logging surface |
| Retained V5 GitHub source import | v1; repository, allowed refs, workflow identity, and manifest path are bound to the Application by an organization admin before publication, and every build attests them; `liskov-github-actions` `v1.2.4` contains the exact-bound import (`aa1b83f`) |
| Reusable GitHub build/pin/OIDC workflow | v1; moving `v1` tag verified at `v1.2.2` |
| Pinned first-party IPFS bundle | v1 |
| Private deployed customer code | Not v1; private source access and TEE execution do not make current artifact delivery confidential |
| General customer-authored Cargo/runtime image | Internal |

## Runtime, placement, and lifecycle

| Capability | Availability / limit |
| --- | --- |
| Node.js background bundle and runtime SDK `0.3.26` | v1 |
| Managed variables and managed secrets | v1 |
| Managed Application logging through Console and `proof liskov application logs`, including live follow and full-history pagination through the CLI; signed diagnostics | v1 |
| Outbound networking and declared quota | v1 |
| Liskov-hosted HTTP/SSH ingress | Not v1 |
| Runtime SSH into your own running job, Liskov-operated relay | Preview on Developer and above; Liskov operates the relay and cannot read the session. The relay is a single machine: if it is lost, open sessions drop until it returns and you reconnect; your jobs are unaffected. Relay traffic counts against your plan's included log volume and is charged at the log overage rate above it. A key's access can be withdrawn at once without republishing; a session already open drains rather than being cut |
| Retained V5 managed Runtime SSH policy path | Preview on Developer and above; native-image-only `access.ssh.provider.kind: liskov_managed`, with organization operator keys snapshotted into each exact-job attachment (register at least one key before the Application's first launch); the relay's single-machine and helper/sidecar blast radii and metered relay traffic apply as on the row above |
| Runtime SSH into your own running job, your own Tailscale network | Preview on Pro and above; requires a Tailscale account you own |
| Simultaneous jobs | Manifest V4 is v1 at exactly `1`; retained V5 is v1 at one or two jobs; higher schema ceilings are not availability |
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
| Organization-gated processor record in Console | v1; your deployment history, runtime contact, operability, and chain-published hardware are visible on every plan; fleet reliability, register liveness, placement assessments, confidence, conflict, and watermark require Enterprise |
| Proof chain and signed runtime-instance evidence | v1 |
| Pause/resume future planning | v1 |
| Supported bounded Action Plan retry | v1 |
| Safe retirement and immutable receipt | v1 |
| Force stop/delete bypass | Internal; no public bypass |
| Managed custody | v1 default |
| Quote, reserve, final charge, release, history | v1 |
| Managed no-report settlement | v1 billing rule; after the strict report deadline, scanner-proven absence is not billed, closes at zero charge, releases the full reserve, and needs no customer action |
| Customer crypto deposit, swap, balance, withdrawal | Not v1 |
| Self-custody signer | Preview; not in normal navigation until availability is confirmed, and the managed no-report billing rule does not reverse or refund immutable ACU movement |

## Product boundaries

Acurast Tunnel may be used by an exact curated offering; it does not become a
general repository capability.
Frozen historical implementations and migration workflows are not customer
features.

Valid V4 syntax does not imply availability. Publication can return
`unsupported_policy_feature` or `entitlement_exceeded` for a typed request
outside this matrix.
