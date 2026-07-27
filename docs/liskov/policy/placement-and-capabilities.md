---
title: Placement And Capabilities
description: Select processors and express V4 machine, evidence, geography, topology, and rollout requirements.
---

# Placement And Capabilities

Placement policy separates stable author intent from dynamic launch facts.
Your policy may require a machine class, evidence profile, geography, topology,
or processor-selection strategy. Liskov records the actual processor,
availability, attestation, and price with the launch.

## Requirements

```json
{
  "requirements": {
    "trustProfile": "proof.liskov.attested-runtime.v1",
    "machine": {
      "class": "confidential-general",
      "profileVersion": "v1",
      "minimums": {
        "memoryMiB": 512,
        "storageMiB": 256
      }
    },
    "evidence": [
      {
        "profile": "proof.liskov.processor-evidence.v1",
        "metric": "successful_attested_launches",
        "minimum": 20,
        "maxAgeMs": 86400000,
        "minimumSamples": 20,
        "minimumConfidenceBps": 9500,
        "strength": "required"
      }
    ]
  }
}
```

The trust profile is always
`proof.liskov.attested-runtime.v1` and cannot be weakened.

Machine `minimums` is a map from profile-defined metric names to unsigned
integer thresholds. Profile definitions are immutable and versioned;
server-resolved catalog metadata does not belong in policy JSON.

Evidence requirements are exact seven-dimensional gates: profile, metric,
minimum, maximum observation age, sample count, confidence in basis points, and
`required` or `preferred` strength.

## Processor Selection

All modes share these optional controls:

| Field | Meaning |
| --- | --- |
| `excludeManagers` | Manager identifiers that must not be selected. |
| `allowUnknownManager` | Whether a processor without a known manager may pass. Defaults to `false`. |
| `requireScheduleClear` | Require conclusive schedule availability. Defaults to `false`. |
| `requireConsumerAccess` | Require the account to be authorized for the processor. Defaults to `false`. |
| `maxHeartbeatAgeSeconds` | Maximum accepted age of processor heartbeat evidence. |
| `candidateLimit` | Maximum candidates retained after filtering. |
| `scanLimit` | Maximum processors examined during discovery. |

### Open Market

```json
{
  "processorSelection": {
    "mode": "open_market",
    "excludeManagers": [
      "untrusted-manager"
    ],
    "allowUnknownManager": false,
    "requireScheduleClear": true,
    "requireConsumerAccess": true,
    "maxHeartbeatAgeSeconds": 180,
    "candidateLimit": 16,
    "scanLimit": 64
  }
}
```

This is the default selection mode.

### Manager Pool

```json
{
  "processorSelection": {
    "mode": "manager",
    "managerId": "partner-manager",
    "requireScheduleClear": true,
    "requireConsumerAccess": true
  }
}
```

`managerId` is required. Use this when a contracted or organizational pool is
the placement boundary.

### Static Processors

```json
{
  "processorSelection": {
    "mode": "static",
    "processorIds": [
      "5ProcessorAddressA",
      "5ProcessorAddressB"
    ],
    "managerId": "audited-manager",
    "requireScheduleClear": true,
    "requireConsumerAccess": true
  }
}
```

`processorIds` is required. The optional manager binding adds another
fail-closed identity check; it does not replace the exact processor list.

## Counted Geography Groups

Groups divide stable application slots:

```json
{
  "parallelism": 4,
  "placement": {
    "groups": [
      {
        "name": "us",
        "count": 2,
        "geography": {
          "kind": "country",
          "standard": "ISO-3166-1-alpha-2",
          "values": [
            "US"
          ]
        }
      },
      {
        "name": "europe",
        "count": 2,
        "geography": {
          "kind": "region",
          "catalog": "proof.liskov.geo.v1",
          "values": [
            "eu-west",
            "eu-central"
          ]
        }
      }
    ]
  }
}
```

Group names must be unique and non-empty, every count must be positive, and
counts must sum exactly to `deployment.parallelism`. Country codes are
uppercase ISO 3166-1 alpha-2. Region selectors name a non-empty versioned
catalog and at least one catalog value.

## Topology

```json
{
  "topologyConstraints": [
    {
      "kind": "anti_affinity",
      "scope": "this_deployment",
      "topologyKey": "processor",
      "strength": "required"
    }
  ]
}
```

| Dimension | Values |
| --- | --- |
| `kind` | `affinity`, `anti_affinity` |
| `scope` | `this_deployment` |
| `topologyKey` | `processor`, `operator`, `manager`, `country`, `region` |
| `strength` | `required`, `preferred` |

Required constraints fail placement when they cannot be proven. Preferred
constraints influence ranking but do not invent a guarantee.

## Capability Matrix

The V4 schema describes the long-lived contract. A control plane additionally
checks its enabled capability set:

| Contract feature | Initial executable subset |
| --- | --- |
| `parallelism` | `1` |
| renewal | after-end and bounded fixed lead |
| update | next renewal or immediate |
| existing jobs | run to scheduled end; cooperative cease where command delivery is enabled |
| processor selection | supported open-market, manager, and static profiles |
| automatic lead | typed, gated |
| counted groups | typed, gated |
| topology constraints | typed, gated |
| replacement after failure | typed, gated |
| optional ingress | typed, gated |
| simultaneous HTTP and SSH ingress | typed, gated |

Entitlements are independent of platform capability. A platform may support a
four-slot fleet while an account is entitled to only one slot; the policy then
fails with `entitlement_exceeded`.

Use [workload recipes](./workload-recipes.md) to distinguish executable
single-slot examples from advanced gated contracts.
