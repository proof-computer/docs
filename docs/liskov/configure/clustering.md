---
unlisted: true
title: Run a cluster
description: Give jobs a stable identity, let them find each other, act at membership changes, and decide what survives a replacement.
---

# Run a cluster

:::danger[Not released]

Clustering is **not v1** and is not available. This page is written as though
the contract were final so it can be reviewed before implementation begins.
[Capabilities and limits](../reference/capabilities.md) remains the availability
owner.

:::

Running several jobs is easy: set `deployment.jobs`. Making them a *cluster* —
members that find each other, agree on something, and survive being replaced —
needs three more things, and one honest conversation about what survives.

## Start with the thing that makes this different

**On Liskov, replacement is the normal case, not a failure.**

Every job has a finite window. A `continuous` application renews by launching a
*new* job and retiring the old one, so a three-member cluster with a six-hour
window replaces one member every two hours, forever. Nothing is wrong when this
happens. It is how the platform works.

That single fact drives everything below. A cluster design that treats member
replacement as an incident will spend its life in an incident.

The setting that makes it survivable is `phasing`:

```yaml
deployment:
  jobs: 3
  schedule:
    duration: 6h
    phasing:
      mode: evenly_spaced
      jobsPerPhase: 1
```

Windows are staggered so **one member at a time** reaches its boundary, and the
survivors hold quorum while it is replaced. With `simultaneous`, all three
expire together and the cluster is destroyed at every boundary. For a quorum
service this one setting is the difference between high availability and a
scheduled outage.

## Who am I, and who are my peers

Liskov placed the cohort, so Liskov is the only party that can answer this. Two
kinds of answer, delivered differently:

**Facts about you** are injected as environment variables, fixed for the life of
the job:

| Variable | Meaning |
| --- | --- |
| `LISKOV_COHORT_INDEX` | Which member you are — `0`, `1`, `2` |
| `LISKOV_COHORT_SIZE` | How many members there are |
| `LISKOV_GENERATION` | Which generation of this member you are |

**Facts about the cohort** are *served*, not injected, because they change:

```yaml
cohort:
  peers:
    access: metadata_service
```

Your job asks a well-known local endpoint who its peers are and gets an answer
because it is running on the machine — no credential to distribute, and no
bootstrap problem. Membership changes at every replacement, so a peer list
written once at startup is stale within the window. Ask again; do not cache.

The served view always has one entry per member, each with a state:
`pending_placement`, `placed_not_ready`, `ready`, `replacing`, or `lost`. It is
never a short list of whoever happens to be up, because a short list is
indistinguishable from a smaller cluster.

### Your index is stable, and that is the most useful guarantee here

**A replacement inherits the index of the member it replaces.** Member 1 is
always member 1, however many times it is replaced.

That lets you derive your cluster identity from the index — a node ID, a zone, a
name — and get a *durable* identity with **no storage at all**. A returning
member then looks to your cluster like a node whose disk was replaced, which
every clustered system already knows how to heal.

This is worth choosing deliberately. Garage is the clear case: derive the node
ID from the index and the layout never changes, so there is no version bump and
no rebalance every few hours. Ignore the index and mint a fresh identity
instead, and every replacement becomes a membership change your cluster has to
process.

## Let them talk to each other

```yaml
integrations:
  tailscale: int_00000000000000000000000000000000

cohort:
  transport:
    provider: tailscale
    ports: [8107]
```

Peer traffic runs over **your own network**. Liskov brokers the integration; it
does not operate the data plane, and it never sees your peer traffic.

`ports` is declared once here and injected as `LISKOV_COHORT_PORTS`. Read it in
your entrypoint rather than writing the number twice — two copies of a port
number is a cluster that fails to peer for reasons nothing explains.

:::warning[Your tailnet ACL must allow it]

Liskov does not write ACLs on your network. If your tailnet policy does not
permit member-to-member traffic on these ports, the cluster will not form, and
Liskov cannot tell you why. This is the most common first-run failure for a
clustered application.

:::

A port carrying cohort traffic **may not** also be publicly reachable. Postgres
serves clients and replication on the same 5432 and cannot separate them, so
publishing that port would publish replication — the manifest is rejected.

## Act at the right moment

Facts tell your application what is true. **Hooks tell it when something is
happening.**

```yaml
hooks:
  join:
    exec: ["/app/join.sh"]
    timeout: 5m
  drain:
    exec: ["/app/drain.sh"]
```

| Hook | Fires |
| --- | --- |
| `join` | This job is entering the cohort |
| `drain` | This job's window is ending |

Liskov sequences; **your code acts**. Liskov never runs commands against your
cluster on your behalf and never holds a credential to it — the hook is your
script, in your job, with your application's privileges.

Three things to know:

**Hooks must be idempotent.** Delivery is at-least-once. This is a contract, not
advice — and in practice a good `join` hook is a no-op almost every time it
runs, because with a stable index the arriving member usually already holds its
place.

**`join` completing is what "ready" means for a cluster.** When you declare it,
`stop_when_successor_ready` waits for the successor's `join` rather than merely
for its process to start. If `join` never completes, the predecessor is never
stopped — the cluster stays over-provisioned rather than under-provisioned,
which is the safe direction.

**`drain` has no timeout, and cannot have one.** Its bound is the renewal lead —
the runway Liskov already planned. The chain ends the job at its window
regardless, so a longer timeout would be a promise nobody can keep. If you need
more time, lengthen `renewal.leadTime`, which is the field that actually creates
runway.

On JavaScript, register a callback through the SDK and declare `sdk: true`
instead of `exec`. The mechanism differs because the runtimes differ; the events
and their guarantees do not.

## What survives a replacement

Here is the honest part.

**Every job starts with an empty filesystem** — including a relaunch on the same
processor. There is no cache, and nothing is carried over. So the question is
not *"how do I keep my disk"* but *"where does my data actually live"*, and
there are three good answers and one bad one.

### It lives in your other members

Raft, streaming replication, layout-based sharding: a replacement pulls from the
survivors. This is what quorum plus staggered phasing buys, and it comes from
your datastore rather than from Liskov. **This is the strongest answer**, and
it is the reason `phasing` matters so much.

### It lives in object storage, and your application puts it there

Some datastores back themselves up and restore themselves on boot. Where yours
does, use it — you need nothing from Liskov, and the platform will stay out of
the way.

If your datastore has the tools but no scheduler, `state` supplies the cadence
and the ordering:

```yaml
state:
  volumes:
    - name: data
      path: /var/lib/typesense
  snapshot:
    every: 30m
    retain: 24
  restore:
    onLaunch: latest_verified
```

Read `snapshot` as *"run my backup on this cadence, keep this many"* and
`restore` as *"run my restore before my service opens"*. A cluster forms
**empty** and one nominated member imports; Liskov chooses the member, so
nothing has to coordinate it.

### It is derived, and can be rebuilt

A search index built from a source of truth elsewhere does not need to survive
anything. Run several independent instances, let each rebuild, and skip `state`
entirely. It is a real production pattern, not a workaround — but it depends on
one rule: **writes go to the source of truth, never to an instance.** Write
directly to one and your instances diverge.

### And the bad answer

A single job, with local disk, and no replica or backup anywhere. That is not a
cluster and not durable, and on a platform that replaces machines every few
hours it is a system of record that loses its records on a schedule. If your
datastore cannot replicate and cannot back itself up, treat it as a **cache or
an index you can rebuild** — and keep the truth somewhere else.

## Complete example

A three-node Typesense cluster: quorum for durability, staggered replacement,
private reach, and a snapshot for total loss.

```yaml title=".liskov/application-manifest.yaml"
schema: proof.liskov.application-manifest
schemaVersion: 5
applicationId: typesense

metadata:
  description: A three-node Typesense search cluster.

integrations:
  tailscale: int_00000000000000000000000000000000

release:
  mode: source

runtime:
  kind: native_image
  image:
    name: debian-trixie
    version: "0.1"
  entrypoint:
    executable: /bin/sh
    args: ["/app/start.sh"]

execution:
  mode: continuous

deployment:
  jobs: 3
  schedule:
    duration: 6h
    phasing:
      mode: evenly_spaced
      jobsPerPhase: 1
  placement:
    evidence:
      profile: proof.liskov.recent-placement.v1
    spread:
      - by: wan_ip
        strength: required
      - by: operator
        strength: required
  spend:
    unit: service_credit_micros
    perJob: "2400000"
    rate:
      amount: "30000000"
      window: 1d

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
      endpoints:
        - name: private
          provider:
            kind: tailscale

configuration:
  secrets:
    - secretId: typesense-api-key
      required: true
      destination:
        kind: environment
        name: TYPESENSE_API_KEY

cohort:
  peers:
    access: metadata_service
  transport:
    provider: tailscale
    ports: [8107]

state:
  volumes:
    - name: data
      path: /var/lib/typesense
  snapshot:
    every: 30m
    retain: 24
  restore:
    onLaunch: latest_verified

observability:
  logs:
    enabled: true
```

Note what is **not** there: no hook, because Typesense re-reads its peer list
from a file and needs no action at membership change; no `protection`, because a
private endpoint derives it; and no identity block, because the index arrives as
an environment variable.

## Checklist before you launch one

- **`phasing: evenly_spaced`** with one job per phase, unless you have a reason.
- **`spread by wan_ip`, `required`** — three members behind one router is one
  failure domain.
- Your **tailnet ACL** permits peer traffic on the cohort ports.
- Your peer list is **re-read**, not cached at startup.
- Your `join` hook, if you have one, is **idempotent**.
- You can say **which of the three answers above** describes your data. If you
  cannot, you do not yet know what a replacement costs you.
