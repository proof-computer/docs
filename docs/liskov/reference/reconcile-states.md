---
title: Reconcile States
description: Deployment-state and launch-decision vocabulary.
---

# Reconcile States

Liskov continuously reconciles observed on-chain state toward your declared
policy. These are the terms you will see in `application status` and `plans`
output.

## Deployment States

| State | Meaning |
| --- | --- |
| `candidate` | Newly proposed; awaiting acceptance and registration. |
| `active` | Running and serving traffic. |
| `draining` | Being replaced; finishing existing work, taking no new traffic. |
| `expired` | Past its scheduled end. |

The normal forward path is `candidate → active → draining → expired`, with a
successor entering `candidate` before the predecessor drains.

## Launch Decisions

V4 reconciliation records a durable lifecycle reason:

| Action | Reason | Trigger |
| --- | --- | --- |
| `launch` | `missing` | No deployment exists — create the first. |
| `renew` | `renewal` | The slot reached its after-end or fixed-lead renewal target. |
| `update` | `update` | The active policy digest differs from the predecessor digest. |
| `recover` | `launch_recovery` | A bounded launch retry is authorized. |
| `recover` | `runtime_recovery` | Accepted runtime failure evidence and policy authorize replacement. |

## Rollout Intent States

| State | Meaning |
| --- | --- |
| `queued` | Deterministic successor intent exists but has not entered execution preflight. |
| `preflight` | Exact policy, placement, schedule, and spend inputs are being checked. |
| `submitted` | Successor deployment is linked and submitted. |
| `claimed` | Canonical positive processor claim exists for the exact successor job. |
| `ready` | Earliest accepted readiness event advanced the slot generation. |
| `completed` | Predecessor scheduled end released surge occupancy. |
| `failed` | Successor terminalized before readiness or accepted evidence conflicted. |

## Holds

A **replacement hold** is a derived safety state that blocks further resume or
replacement until you override it deliberately. It is not a failure state; it is
a brake. See [Replacement holds](../troubleshooting/replacement-holds.md).

## Identifiers

| Id | Example | Notes |
| --- | --- | --- |
| Application id | `my-app` | Stable across versions. |
| Policy version id | `…` | One immutable, signed policy version. |
| Execution id | `live-execution:…:r1` | One custody execution attempt. |
| Deployment id | `75824` | One Acurast deployment. |

Use these ids when reading status or filing a recovery report — see
[Recovery](../troubleshooting/recovery.md).
