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

Each reconcile records an action and the reason for it:

| Action | Reason | Trigger |
| --- | --- | --- |
| `launch` | `missing` | No deployment exists — create the first. |
| `replace` | `near_expiry` | Current job expires within `replacementRunwayMs`. |
| `replace` | `invalid_observed` | Observed state no longer matches policy. |

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
