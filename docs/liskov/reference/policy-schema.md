---
title: Policy Schema
description: Every field in a liskov.json application policy, with units.
---

# Policy Schema

A `liskov.json` file declares one application policy. Its schema contract is
`proof.slipway.application-policy.v3` (a stable internal identifier — it does not
change with the brand).

## Top Level

| Field | Type | Notes |
| --- | --- | --- |
| `domain` | string | Always `"proof.slipway.application-policy.v3"`. |
| `applicationId` | string | Unique application id. |
| `displayName` | string | Deprecated v3 source hint used only to seed a newly created application's name. The application-owned Settings name is authoritative and later policy imports never overwrite it. Planned for removal in v4. |
| `replicas` | number | Desired concurrent deployments. |
| `metadata` | object | `displayName` (the same deprecated, non-authoritative v3 source hint), `appType` (e.g. `managed-web-app`), `labels`. |

The v3 policy digest still covers both display-name fields for compatibility.
Changing an application's name in Settings does not edit or republish its policy,
change its slug, or alter any policy version or digest.

## `source`

| Field | Type | Notes |
| --- | --- | --- |
| `provider` | string | `github`. |
| `repository` | string | `owner/repo`. |
| `branch` | string | Branch to launch from. |
| `path` | string | Path to the policy in the repo. |

## `artifact` / `artifactAutomation`

| Field | Type | Notes |
| --- | --- | --- |
| `artifact.mode` | string | `planned-ipfs` — content-addressed encrypted artifact. |
| `artifact.requiredEncryptionMode` | string | e.g. `aes-256-gcm-loader-v1`. |
| `artifactAutomation.github.autoPublish` | boolean | Let the GitHub workflow publish artifacts. |
| `artifactAutomation.github.workflowRef` | string | OIDC-pinned workflow allowed to publish. |

## `runtime`

| Field | Type | Unit | Notes |
| --- | --- | --- | --- |
| `role` | string | — | Caller-defined role label. |
| `runtime` | string | — | `NodeJSWithBundle` for Node web apps. |
| `durationMs` | number | ms | Job lifetime before expiry. |
| `resources.memory` | number | MB | Memory request. |
| `resources.storage` | number | MB | Storage request. |
| `resources.networkRequests` | number | count | Network-request quota (`0` = none declared). |
| `requiredModules` | string[] | — | e.g. `["network"]`. |
| `replacementRunwayMs` | number | ms | Lead time before expiry to launch the successor. |
| `desiredCount` | number | — | Desired replicas at runtime. |
| `launch.reward` | number | planck | Acurast reward per launch (smallest units). |
| `launch.slots` | number | — | Processor slots a launch occupies. |

## `acurast`

| Field | Type | Unit | Notes |
| --- | --- | --- | --- |
| `pinnedProcessors` | string[] | — | Processor addresses to pin to (optional). |
| `verifiedOnly` | boolean | — | Restrict to verified processors. |
| `maxStartDelayMs` | number | ms | Max acceptable start delay. |
| `budgetCaps.maxRewardPerLaunch` | number | planck | Hard cap on reward per launch. |
| `budgetCaps.maxNativeFeePerLaunch` | number | planck | Hard cap on native fees per launch. |
| `quote.required` | boolean | — | Require a signed quote before funding. |

## `environment`

`environment.variables[]` declares non-secret variables delivered to the job:

| Field | Notes |
| --- | --- |
| `name` | Variable name in the job. |
| `source` | e.g. `literal`. |
| `value` | The literal value (non-secret). |
| `delivery` | Delivery channel. |
| `required` | Whether it must be present. |

For secret values, use [`secrets`](#secrets) instead — never put secrets here.

## `ingress`

| Field | Notes |
| --- | --- |
| `mode` | `required` makes a working route a launch precondition. |
| `implementor` | `baran`. |
| `port` | App listen port. |
| `protocol` | `https`. |
| `tlsMode` | `job-owned` — job holds the TLS key. |
| `healthPath` | Readiness path probed by the gateway and validators. |
| `childSessionDurationMs` | Ingress child-session lifetime. |

See [Baran ingress](../guides/baran-ingress.md).

## `secrets`

`secrets.declarations[]` names the secrets the app needs — ids and targets only,
never values:

| Field | Notes |
| --- | --- |
| `secretId` | Stable id within the policy. |
| `name` | Environment variable the secret becomes at runtime. |
| `target` | `env`. |
| `required` | Must be granted before deploy. |

See [Sealed secrets](../guides/sealed-secrets.md).

## `blackbox`

| Field | Notes |
| --- | --- |
| `blackbox.enabled` | Enable [encrypted logging](../guides/encrypted-logging.md). |
