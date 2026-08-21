---
unlisted: true
title: Author a retained Application Manifest V5
description: Prepare the retained V5 source, runtime, schedule, spend, configuration, logging, and managed Runtime SSH contract without using deferred fields.
---

# Author a retained Application Manifest V5

:::danger[Not released]

Manifest V5 is implemented but **not available in production**. Production
registration remains V4-only and activation is not authorized. Keep this page
out of customer workflows until [Capabilities and limits](../reference/capabilities.md)
classifies the exact pair as available. Use
[Application Manifest V4](./manifest-v4.md) for production today.

:::

The retained V5 release candidate is deliberately narrow. It supports source or
pinned releases, JavaScript or a curated native image, once/continuous/interval
execution, at most two jobs on the first public surface, capability minimums,
lifecycle timing, managed Service Credit spend, variables, secrets, logging,
and Liskov-managed Runtime SSH.

V5 does not contain public ingress, provider integrations, cohort membership,
lifecycle hooks, durable state beyond `off`, placement diversity rules,
non-managed SSH providers, or self-custody spend. Those concepts require a
future policy version; adding their old draft spellings makes V5 fail closed.

## 1. Start with one bounded job

Commit this JSON document as `.liskov/application-manifest.json`:

```json title=".liskov/application-manifest.json"
{
  "schema": "proof.liskov.application-manifest",
  "schemaVersion": 5,
  "applicationId": "fetch",
  "metadata": {
    "description": "Fetch data from one API and send a result to another."
  },
  "release": {
    "mode": "source"
  },
  "runtime": {
    "kind": "javascript",
    "entrypoint": {
      "file": "bundle.js"
    }
  },
  "execution": {
    "mode": "once"
  },
  "deployment": {
    "schedule": {
      "duration": "30s"
    },
    "spend": {
      "unit": "service_credit_micros",
      "perJob": "50000"
    }
  },
  "state": {
    "mode": "off"
  },
  "observability": {
    "logs": {
      "enabled": true
    }
  }
}
```

`state.mode: off` is required. It makes the absence of Liskov-managed durable
state explicit. Unknown fields, duplicate JSON/YAML keys, YAML anchors, aliases,
merge keys, tags, and multiple YAML documents are rejected.

Validate locally without creating or publishing anything:

```bash
proof liskov application manifest validate \
  --file .liskov/application-manifest.json \
  --json
```

The retained CLI validator is present in
`@proof-computer/proof-cli-liskov` source commit
`e135604ed2f6c59ffc737fce5fe08eaa19d77d0c`. It is newer than the `v0.7.0`
release tag; that source commit is review evidence, not a released package
claim.

## 2. Bind the exact GitHub source

For `release.mode: source`, repository, ref, workflow, manifest path, and any
artifact digest come from verified GitHub evidence. They do not belong in the
manifest.

The prepared source-import action is at exact source commit
`aa1b83f0fd4b08ac33a6c9970d2077885922d79c`:

```yaml title=".github/workflows/liskov-manifest.yml"
name: Import Liskov manifest

on:
  push:
    branches: [main]

permissions:
  contents: read
  id-token: write

jobs:
  import:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: proof-computer/liskov-github-actions/actions/policy-import@aa1b83f0fd4b08ac33a6c9970d2077885922d79c
        with:
          application-id: fetch
          manifest-path: .liskov/application-manifest.json
          repository: ${{ github.repository }}
          ref: ${{ github.ref }}
          workflow-ref: ${{ github.workflow_ref }}
          expected-manifest-path: .liskov/application-manifest.json
```

This commit is two revisions after `v1.2.3`; there is no released workflow tag
for the retained V5 binding yet. Do not replace the full commit with `@v1` until
a release containing it is verified. The action imports a draft and spends
nothing. It refuses a V4 document, a non-source V5 release, a deferred root, or
any repository/ref/workflow/path mismatch.

## 3. Preflight, publish, and explain

After activation and after the workflow has imported the intended draft:

```bash
proof liskov application publish fetch --dry-run --json
proof liskov application publish fetch --yes --json
proof liskov application policy explain fetch --json
proof liskov application status fetch --json
```

The dry run is read-only. Publishing is the mutation: it commits an immutable
effective policy and may begin a spend-bearing deployment. Read the canonical
explanation rather than recomputing policy client-side. Its publication,
execution, spend-closeout, and managed-SSH sections report `absent`,
`notApplicable`, `refused`, or `satisfied` with server-owned next actions.

## Execution and spend

Choose one execution arm:

```json
{"mode": "once"}
```

```json
{"mode": "continuous", "until": "2027-01-01T00:00:00Z"}
```

```json
{"mode": "interval", "every": "6h", "until": "2027-01-01T00:00:00Z"}
```

`until` is an optional bound. Durations are one integer plus `ms`, `s`, `m`,
`h`, or `d`; compound and unitless values fail.

Every deployment requires `schedule.duration` and `spend`. Recurring execution
also requires a rate:

```json
{
  "unit": "service_credit_micros",
  "perJob": "600000",
  "rate": {
    "amount": "15000000",
    "window": "1d"
  }
}
```

Amounts are non-negative decimal strings, never JSON numbers. Thin V5 supports
only managed-custody `service_credit_micros`.

## One or two jobs

`deployment.jobs` defaults to `1`. The retained contract can parse 1–256, but
the first public capability and entitlement limit is **exactly 2**. Three or
more fails before spend.

```json
{
  "jobs": 2,
  "schedule": {
    "duration": "1h",
    "phasing": {
      "mode": "evenly_spaced",
      "jobsPerPhase": 1
    }
  }
}
```

Use `simultaneous` to place all jobs in one phase or `evenly_spaced` to spread
equal phases across the paid window. `jobsPerPhase` must not exceed `jobs` and
must divide it exactly. Two jobs do not create a cluster: V5 has no membership,
topology, state replication, or public-service routing contract.

## Sizing and processor selection

Omit placement for the open market, select exact processors, or state measured
minimums:

```json
{
  "processorSelection": {
    "mode": "exact",
    "processorIds": ["processor-id"]
  },
  "minimums": {
    "memory": "4GiB",
    "storage": "16GiB",
    "cpuSingleCoreScore": 1200
  }
}
```

Minimums are filters, not reserved resources. Memory is total device RAM;
storage is available space. Missing current evidence fails closed. Country,
region, WAN-IP, allow/exclude, spread, distribution, and authored evidence
profiles are not V5 fields.

## Renewal and updates

Lifecycle defaults to immediate update with the predecessor stopping when the
successor is ready. Use `run_until_scheduled_end` when overlap would be unsafe:

```json
{
  "renewal": {
    "leadTime": {"mode": "fixed", "duration": "10m"}
  },
  "update": {
    "timing": "next_renewal",
    "existingJobs": {"mode": "run_until_scheduled_end"}
  }
}
```

Renewal is valid only for continuous execution. Lead time is `automatic` or
`fixed`; update timing is `immediate` or `next_renewal`.

## Variables, secrets, logs, and Runtime SSH

Literal variables participate in the authored digest. Managed variables resolve
at delivery time. Secrets name a server-side secret and an environment or file
destination; secret material never appears in the manifest or effective policy.

```json
{
  "variables": [
    {"source": "literal", "name": "LOG_LEVEL", "value": "info"},
    {"source": "managed", "name": "API_ORIGIN", "required": true}
  ],
  "secrets": [
    {
      "secretId": "api-token",
      "required": true,
      "destination": {"kind": "file", "path": "/run/secrets/api-token"}
    }
  ]
}
```

Environment destinations cannot collide. Arrays contain at most 64 entries.
Managed logging has one authored switch: `observability.logs.enabled`.

Managed Runtime SSH is native-image-only and uses this policy arm:

```json
{
  "access": {
    "ssh": {
      "provider": {"kind": "liskov_managed"}
    }
  }
}
```

Keys are not embedded in V5 policy. Read the prepared
[V5 Managed Runtime SSH procedure](../operate/runtime-ssh-v5.md) before enabling
the arm.

## Exact reference and release identity

- [Application Manifest V5 reference](../reference/manifest-v5.md)
- [Capabilities and limits](../reference/capabilities.md)
- Contract RC: `sha256:549272988045e9357c4945850706569ed8dc7f0c6f419b7cf5c57d54b294bb10`
- Manifest schema: `sha256:38ca88eefe599d9a13b0906fb7ae86be002fb7aa15767925a2fe11908fec95da`
