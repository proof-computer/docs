---
unlisted: true
title: Author an Application Manifest V5
description: Describe what runs, how often, how it is reached, and what it may spend — starting from the smallest manifest that works.
---

# Author an Application Manifest V5

:::danger[Not released]

V5 is **not v1** and is not available. This page is written as though the
contract were final so it can be reviewed and corrected before implementation
begins. Nothing here can be published today, and
[Capabilities and limits](../reference/capabilities.md) remains the availability
owner. To ship an application now, use
[Application Manifest V4](./manifest-v4.md).

:::

The manifest is the strict document you keep in your repository. It describes
what Liskov may build and run. Liskov resolves the rest — the exact artifact
digest, the image digest, the placement, the launch evidence — into an
immutable **effective policy** you can read back.

Unknown fields fail closed. If Liskov does not recognise something, it refuses
the document rather than ignoring the field.

## The rule that explains the whole contract

V5 is small, and it is small on purpose:

> **You state what only you know. Liskov states the rest.**

A surprising amount of what looks like configuration is either something the
platform already knows, or something you would end up writing twice. V5 leaves
both out. When you find yourself unable to configure something, the answer is
usually that it is derived — and you can see the derived value in the effective
policy.

This is worth internalising early, because it is why V5 manifests are shorter
than you expect, and why a field you were looking for may not exist.

## Your first manifest

The smallest thing that runs. A Node.js program, once, for up to thirty
seconds:

```yaml title=".liskov/application-manifest.yaml"
schema: proof.liskov.application-manifest
schemaVersion: 5
applicationId: fetch

metadata:
  description: Fetch data from an API and post it to another API.

release:
  mode: source

runtime:
  kind: javascript
  entrypoint:
    file: bundle.js

execution:
  mode: once

deployment:
  schedule:
    duration: 30s
  spend:
    unit: service_credit_micros
    perJob: "50000"

observability:
  logs:
    enabled: true
```

That is the whole document. Five decisions:

| You said | Meaning |
| --- | --- |
| `release.mode: source` | Build my code from the repository my integration is bound to |
| `runtime.kind: javascript` | It is a Node.js bundle |
| `execution.mode: once` | Run it one time, not on a schedule |
| `schedule.duration: 30s` | It gets thirty seconds |
| `spend.perJob` | It may cost at most this much to deliver |

### What you did not have to write

- **How many jobs.** One, unless you say otherwise.
- **Which builder, repository, branch or workflow.** Those live in your source
  integration, server-side. A manifest fetched from a repository does not get to
  authorize its own builder.
- **What kind of artifact this produces.** A JavaScript runtime implies a
  bundle. Saying so again would only let you contradict yourself.
- **Recovery behaviour.** How hard and how fast Liskov retries is the
  platform's job, bounded by what you are willing to spend.
- **Memory or storage.** Only state a floor when your workload genuinely has
  one — see [Sizing](#sizing-and-placement). A floor the whole fleet clears
  narrows nothing.

## Choose how it runs

`execution` answers *how often*, and it has three shapes:

```yaml
execution:
  mode: once                      # one occurrence, then done
```

```yaml
execution:
  mode: continuous                # keeps running, renewed automatically
  until: "2027-01-01T00:00:00Z"   # optional end
```

```yaml
execution:
  mode: interval                  # a new occurrence on a fixed cadence
  every: 6h
  until: "2027-01-01T00:00:00Z"   # optional end
```

`until` is a **bound**, not a fourth mode. That is deliberate: as a mode of its
own, "run every six hours until Friday" could not be expressed.

:::note[`duration` means two things, and both are honest]

For `once`, `schedule.duration` is a **deadline** — how long the job gets before
it ends.

For `continuous` and `interval`, it is the **paid window** — how long each job
lasts before it is renewed by a fresh one. A continuous application is not one
long-lived process; it is a succession of jobs, and the window is how long each
one lives.

:::

## Publish an endpoint

Add `ingress` to make a local port reachable. Two things to decide: **who can
reach it**, and **what protects it**.

### Private is the default you probably want

```yaml
integrations:
  tailscale: int_00000000000000000000000000000000

ingress:
  http:
    - name: api
      localPort: 8080
      endpoints:
        - name: private
          provider:
            kind: tailscale
```

The service is published to your own network and nowhere else. Clients on your
tailnet connect directly — no proxy to configure, no certificate to manage, and
no wrapper program on the client side.

**For a database, this is almost always the right answer.** Most datastores
authenticate with a single static token, which is not a posture to put on the
public internet whatever the token is.

### Public, when you mean it

```yaml
ingress:
  http:
    - name: web
      localPort: 3000
      endpoints:
        - name: public
          protection: public_unauthenticated
          provider:
            kind: acurast_tunnel
```

`protection` is **required** on a publicly reachable endpoint, and it has no
default. Liskov cannot see inside your application, so it cannot know whether
you authenticate your own clients — and an endpoint published by accident is
the failure we most want to make impossible to have silently.

| Value | Meaning |
| --- | --- |
| `application_managed` | Your application authenticates its own clients |
| `provider_gated` | An access layer sits in front — Cloudflare Access. Verified against your integration |
| `sidecar_gated` | An authenticating proxy runs inside the job |
| `public_unauthenticated` | Deliberately open. Legitimate for a static site or a game server |

On a `tailscale` endpoint you must **not** write `protection`: reaching it is
already the gate, so the value is derived.

### Choosing a provider

| | Needs from you | Hostname | Several jobs, one address |
| --- | --- | --- | --- |
| `acurast_tunnel` | Nothing | Issued, opaque | **No** |
| `cloudflare_tunnel` | Your own account and zone | Yours | Yes |
| `tailscale` | Your own tailnet | Private | Yes |

The one that catches people: **`acurast_tunnel` gives each job its own URL.**
Five jobs is five separate addresses, not one load-balanced service. If you want
one address across several jobs, use Cloudflare.

### Ports that are not HTTP

`ingress.tcp` publishes a wire protocol — a database port, for instance. How a
client reaches it depends on the provider and is derived, not authored: on a
tailnet the client connects directly; through Cloudflare it runs
`cloudflared access tcp`; through the Acurast Tunnel it must unwrap TLS first.

Anonymous public TCP — a game server that any client can dial — is **not
offered**. Run a tunnel agent as your own child process; see
[Capabilities and limits](../reference/capabilities.md).

## Run more than one job

```yaml
deployment:
  jobs: 5
  schedule:
    duration: 1h
    phasing:
      mode: evenly_spaced
      jobsPerPhase: 1
```

`jobs` is how many run at once. It is called `jobs` rather than `replicas` or
`parallelism` because Liskov does not know how they relate — whether they are
independent workers, replicas, or members of a cluster is your application's
business.

**`phasing` is the setting that matters most and looks least important.** With
`simultaneous`, every job reaches its renewal boundary at the same moment and
they are all replaced together. With `evenly_spaced` and one job per phase,
Liskov staggers the windows so only one job is being replaced at a time.

For a stateless service that is the difference between a brief gap and none. For
a cluster it is the difference between a rolling upgrade and losing quorum.

## Sizing and placement

There is **no `resources` block**, and the distinction matters: you are not
allocating capacity, you are **filtering for it**. Processors are independent
devices whose capability is measured by benchmark, not carved up by a scheduler.
Nobody sets memory aside for you.

So you state a floor, and processors below it are excluded:

```yaml
deployment:
  placement:
    minimums:
      memory: 4GiB
      storage: 16GiB
```

This is enforced **on the chain**, not by Liskov, and it fails closed: a
processor that has published no recent measurement for a pool you constrained is
excluded rather than given the benefit of the doubt.

Two things about it surprise people:

- **`memory` is the device's total RAM, not a budget for your process.** The
  operating system and any co-resident job take a share of it. `storage`, by
  contrast, is *available* space. The asymmetry is in the underlying
  measurements, not a naming slip.
- **Liskov asks for more than you wrote.** A benchmark score is not a guarantee,
  so selection adds headroom — 10% on memory and storage, 50% on the CPU scores.
  The effective floor appears in the effective policy.

You can also constrain CPU with `cpuSingleCoreScore` and `cpuMultiCoreScore`,
which are raw benchmark scores rather than core counts. Omit any key you do not
care about; each one you add narrows placement.

:::warning[Every minimum costs you fleet, and the cliff is steep]

Measured against the live fleet in August 2026:

| `memory` | Processors that qualify |
| --- | --- |
| 2 GiB | ~85% |
| 4 GiB | ~42% |
| 8 GiB | ~12% |
| 16 GiB | **~34 devices** |

Memory is the binding constraint — 64 GiB of storage still leaves about half the
fleet, while 8 GiB of memory removes seven eighths of it.

**Do not size from your datastore vendor's documentation.** ClickHouse recommends
32 GB, which reaches nine processors worldwide. Size from what your workload
actually needs on this fleet, and if that number is large, the honest answer is
that this is the wrong place to run it.

:::

You can also constrain *where* it runs:

```yaml
deployment:
  placement:
    evidence:
      profile: proof.liskov.recent-placement.v1
    spread:
      - by: wan_ip
        strength: required
      - by: country
        minimumDistinct: 3
        strength: preferred
```

`spread` is a property of the **set** of jobs, not of any one job. `by: wan_ip`
with `strength: required` means no two jobs may sit behind the same WAN address
— which for a cluster is the difference between three failure domains and one
router.

Distinctness **fails closed**: a processor whose country is unknown does not
satisfy a country requirement. Treating "unknown" as "probably different" is how
a three-node cluster silently becomes one node with two expensive copies.

An unsatisfiable `required` spread fails **before you are charged**, naming how
many jobs were achievable.

## Money

```yaml
deployment:
  spend:
    unit: service_credit_micros
    perJob: "600000"
    rate:
      amount: "75000000"
      window: 30d
```

- **`unit`** is what you pay in. `service_credit_micros` draws on your USD
  Service Credit balance. `acu_planck` routes payment through your own
  self-custody signer, where your funds pay the chain directly. It is a choice,
  not a consequence — and it decides which path the control plane uses.
- **`perJob`** bounds everything spent getting *one* job running, including
  every failed attempt before the successful one.
- **`rate`** is an amount over a window, not a lifetime total. It is **required**
  for `continuous` and `interval`, because a per-job cap on an application that
  runs forever bounds nothing.

Spend authority is always explicit. Leaving it out does not mean "no limit"; it
means the document is rejected.

## Configuration and secrets

```yaml
configuration:
  variables:
    - name: LOG_LEVEL
      source: literal
      value: info
    - name: FEATURE_FLAG
      source: managed          # set outside the manifest, changeable without republishing
  secrets:
    - secretId: db-uri
      required: true
      destination:
        kind: environment
        name: DATABASE_URL
```

A **variable** is a non-secret string. A `literal` is part of the document and
changing it changes the digest; a `managed` value is set outside the manifest
and can change without republishing.

A **secret** is delivered without ever appearing in the manifest, the effective
policy, logs, or an error message. Anything containing a credential is a secret,
not a variable — a database URI with a password in it is a secret.

## Health, on Cargo

For `native_image` applications, declare how Liskov can tell whether your
service is working:

```yaml
ingress:
  http:
    - name: api
      localPort: 8108
      health:
        live:
          http: /health
        ready:
          http: /debug
          contains: '"state":"OK"'
```

- **`live`** — is the process up. Drives recovery.
- **`ready`** — is it serving *correctly*. Drives traffic and replacement.

The distinction matters more than it sounds. Many services answer their health
endpoint long before they can serve a correct answer — a metrics store will
return an empty result set rather than an error while it is still opening its
data. `contains` exists for services whose status code is uninformative.

Where an HTTP check cannot express readiness, run the check the software already
ships:

```yaml
        ready:
          exec: ["pg_isready", "-q"]
```

`tcp: 5432` is also available and is the weakest of the three: an open port is
not an accepting database.

:::note[JavaScript applications have no `health` block]

Probing needs a supervisor process alongside your application. Cargo has one;
the JavaScript runtime evaluates your bundle directly and has nowhere to put it.
Declaring `health` on a JavaScript application is rejected rather than silently
ignored.

:::

## Clusters, durable data, and lifecycle hooks

Applications whose jobs need to find each other, keep data across replacement,
or act at membership changes are covered in
[Run a cluster](../configure/clustering.md).

## Verify before you commit

```bash
proof liskov application validate .liskov/application-manifest.yaml
proof liskov application publish --dry-run
```

`validate` checks the document. The dry run resolves it into the effective
policy and shows you what Liskov derived — the image digest, the derived client
access, the resolved protection, the assigned endpoints. **Read it.** It is the
fastest way to find out that something you expected to control is decided for
you, and what it was decided to be.

## Full field list

[Manifest V5 reference](../reference/manifest-v5.md).
