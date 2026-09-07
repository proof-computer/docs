---
title: Author a retained Application Manifest V5
description: Prepare the retained V5 source, runtime, schedule, spend, configuration, logging, and managed Runtime SSH contract without using deferred fields.
---

# Author a retained Application Manifest V5

:::note[Exact retained release]

This guide covers RC
`sha256:549272988045e9357c4945850706569ed8dc7f0c6f419b7cf5c57d54b294bb10`.
[Capabilities and limits](../reference/capabilities.md) owns the supported
surface; [Application Manifest V4](./manifest-v4.md) remains supported.

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

Use `@proof-computer/proof-cli-liskov` `0.9.0` or later. It contains source
commit `e135604ed2f6c59ffc737fce5fe08eaa19d77d0c`; the earlier `v0.7.0` tag does
not. The `application source-binding` verbs in step 2 ship in the release
recorded by the V5 promotion packet.

## 2. Create the Application and bind its exact GitHub source

For `release.mode: source`, the repository, ref, workflow identity, manifest
path, and artifact digest come from verified GitHub evidence. They do not
belong in the manifest: they are bound to the Application once, and every
build attests them.

Create the Application from identity alone, naming the repository that holds
the document. Creation writes no draft and spends nothing:

```bash
proof liskov application create fetch \
  --repository OWNER/REPO \
  --json
```

Bind the exact source the Application may publish from. This requires an
organization `admin`; a maintainer cannot retarget source. The first binding
is revision `1`; a later change must name the revision it expects, and is
refused if another change landed first:

```bash
proof liskov application source-binding set fetch \
  --repository OWNER/REPO \
  --allowed-ref refs/heads/main \
  --workflow-identity OWNER/REPO/.github/workflows/liskov.yml@refs/heads/main \
  --manifest-path .liskov/application-manifest.json \
  --reason "first binding" \
  --yes --json
```

`application source-binding show fetch --json` reads the binding, its
revision, and its revocation epoch; `application source-binding revoke`
withdraws it. A publication whose ref is outside `allowedRefs`, whose workflow
identity differs, or whose manifest path differs is refused.

Then let the reusable workflow build, pin, and attest the document on every
push to the bound ref. Its `app-id`, repository, workflow path, and
`authored-manifest-path` must be the bound values. The moving `v1` tag is
verified at `v1.2.4`, which contains the retained V5 source binding
(`aa1b83f0fd4b08ac33a6c9970d2077885922d79c`):

```yaml title=".github/workflows/liskov.yml"
name: Build Liskov Application

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  id-token: write

jobs:
  artifact:
    uses: proof-computer/liskov-github-actions/.github/workflows/acurast-app.yml@v1
    with:
      app-id: fetch
      working-directory: .
      entrypoint: bundle.js
      authored-manifest-path: .liskov/application-manifest.json
```

The workflow uploads the bundle to the Acurast IPFS proxy without spending and
attests the artifact digest, the source commit and ref, and the workflow
identity to Liskov. It publishes nothing. Its run log prints the artifact
digest as `Artifact sha256:`, and the called workflow exposes it as the
`digest` output.

## 3. Publish from the attested build

Publish the exact document the run attested. Every value must match what was
bound and attested, or the publication is refused before anything is spent:

```bash
proof liskov application policy publish fetch \
  --file .liskov/application-manifest.json \
  --artifact-digest sha256:ARTIFACT_DIGEST_FROM_THE_RUN \
  --source-commit COMMIT_THE_RUN_ATTESTED \
  --source-ref refs/heads/main \
  --workflow-identity OWNER/REPO/.github/workflows/liskov.yml@refs/heads/main \
  --binding-revision 1 \
  --revocation-epoch 0 \
  --expected-pointer-version 0 \
  --yes --json
proof liskov application policy explain fetch --json
proof liskov application status fetch --json
```

Publishing is the mutation: it commits an immutable effective policy and
begins a spend-bearing deployment under the document's `spend`. Nothing is
sent without `--yes`, and the local document is validated first.
`--expected-pointer-version` is the active policy pointer you observed, `0`
for a first publication; a stale value is refused rather than overwriting a
concurrent publication. `--binding-revision` and `--revocation-epoch` are the
values `source-binding show` reports.

Read the canonical explanation rather than recomputing policy client-side. Its
publication, execution, spend-closeout, and managed-SSH sections report
`absent`, `notApplicable`, `refused`, or `satisfied` with server-owned next
actions.

## Execution and spend

Choose one execution arm:

```json
{"mode": "once"}
```

A `once` Application runs one job and settles. It does not run again on its own.
To run the same document again today, create a new Application, which counts
against your organization's job slots. A manual re-run verb is planned.

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
