---
unlisted: true
title: Read Compute and check placement
description: Read the processor network Liskov places on as counts, see how fresh each figure is, and check how many placeable processors meet your V5 placement minimums.
---

# Read Compute and check placement

:::danger[Not released]

The Console **Compute** page and its **placement check** are not released. No
organization can open them yet, and the read that serves their figures is not
verified in production.
[Capabilities and limits](../reference/capabilities.md) owns what is
available, and [Processor placement](../configure/processor-placement.md)
describes placement as it works today.

This page is written as though final so that the contract can be reviewed
before the release. Read it as a design, not as a surface you can reach.

:::

**Compute** describes the network of Acurast processors Liskov can place your
jobs on: how many there are, what they report they can do, whether they have
been heartbeating, and how many look free right now. The **placement check**
counts how many of them meet the requirements you would author in a V5
manifest.

Both are read-only. Opening them, reloading them, or running a check never
selects a processor, reserves one, spends Service Credits, or changes a
deployment.

Everything is a **count**. Compute never lists processors, never shows a
processor or manager identifier, and has no export, page of results, or "show
me the devices behind this number".

## Open Compute

In the Console, open **Compute** in the navigation. The page lives at
`/compute`, and the placement check at `/compute/placement`.

You need to be signed in and an active member of the organization selected in
the Console. The figures describe the network, not your organization: every
organization sees the same counts, and nothing on the page is about your own
deployments.

## How to read a count

Every figure is one of four states. They never stand in for each other:

| You see | State | What it means |
| --- | --- | --- |
| A number | `exact` | The count. It is either **zero** or **20 or more**. |
| **Fewer than 20** | `suppressed` | Between 1 and 19. No number and no share are shown. |
| Hidden | `withheld` | Held back so that a fewer-than-20 count elsewhere on the page cannot be worked out by subtraction. |
| **Unavailable** | `unavailable` | The source could not measure it. This is not zero and not fewer than 20. |

**Zero is shown as zero.** "Nothing meets this" is a measured answer, and it
names no processor.

Because small counts are suppressed and some totals are withheld, figures on
the page do not always add up to their totals. Do not subtract one figure from
another to recover a hidden one.

## How fresh a figure is

Each panel on the page has its own **source**, because the facts behind them
are gathered separately and age separately. Each source says:

- **Current** — read from the latest observation, with how long ago it was
  made;
- **Stale** — the last observation is older than expected; the figures are
  shown with their age, so read them as a past reading, not as now; or
- **Unavailable** — there is nothing to show, for one of these reasons:

| Reason | Meaning |
| --- | --- |
| `projection_missing` | Liskov has no current view of the network to answer from. |
| `source_not_built` | The source for this panel has never published. |
| `no_measured_basis` | The figure needs measured evidence that does not exist yet. |
| `source_conflict` | Liskov found facts that disagree and published neither. |
| `not_served` | This deployment of Liskov does not serve this panel yet. |

One stale or unavailable panel does not change the others. An unavailable
panel shows no figures at all, never zeros.

## Read the panels

### Placeable now

**Known** is every processor Liskov's register currently knows. **Placeable**
is the part of those Liskov could place a job on: finalized, active, attested,
and with no conflicting facts. The other panels count within the placeable
processors unless they say otherwise.

### What processors report

For each of the four V5 placement minimums — **memory**, **storage**,
**single-core CPU score**, and **multi-core CPU score** — Compute shows:

- how many placeable processors reported the figure (**known**) and how many
  did not (**unknown**); an unknown figure is not a low one;
- a series of **at least** thresholds, each counting the processors that meet
  it; and
- the **median** of the known values, shown only when at least 20 processors
  reported one.

Each threshold applies the same headroom placement applies to a minimum. A
processor counts toward a memory or storage threshold only with at least 10%
more than it, and toward a CPU score threshold only with at least 50% more.
So a threshold count answers "how many would pass this minimum", not "how many
report exactly this much".

These are figures the processors report. They are **upper bounds** on what is
placeable, not measurements Liskov guarantees.

### What processors can run

Counts of placeable processors that can run **JavaScript** and **native
images**. A processor whose build Liskov has not read yet is counted as
**native image unknown**, never as unable to run native images.

Support for **secrets** is always **unavailable** here. A processor's secret
response key is known only after it has run a job, so Liskov cannot count it
in advance.

### Heartbeats

For each of the most recent complete UTC hours the register keeps (about a
day), the number of distinct placeable processors **observed** heartbeating in
that hour. The current, partial hour is not included.

This counts heartbeats Liskov saw. It does not infer missed heartbeats, and it
is not a reliability score, an uptime promise, or a forecast. An hour the
register does not cover is **unavailable**, not zero, and the panel says
whether its coverage of the window is **complete** or **partial**.

### Managers

How concentrated the network is: the processor counts of the three largest
managers, largest first, then **all other managers** together, then processors
with **no known manager**. Unknown managers are not added to "other".

Managers are never named or identified, and this is not a ranking of them.

### Location

Location covers **only processors Liskov has already located**, so the panel
leads with how many are **unlocated**. Region and country counts are shares
**of the located**, never of the whole network, and Liskov never extrapolates
from the located to the rest.

Compute does not let you choose where your jobs run. Country and manager
controls belong to a later manifest version, and they are not enabled by these
V5 pages.

### Available now

The number of placeable processors with a free slot in their published job
schedule at the moment of the read. Schedules are read from the Acurast chain,
so this figure trails the network by minutes and has its own freshness.

When this source is unavailable, it means Liskov cannot say how busy the
network is. **Absent occupancy is not zero capacity**: it does not mean that no
processor is free.

### Sizing

Sizing puts memory in familiar terms. For each workload size — 512 MiB, 1 GiB,
2 GiB, 4 GiB, 8 GiB, and 16 GiB — it counts:

- **Devices**: placeable processors with enough memory for **one workload of
  that size per device**, after a measured memory reserve for the device
  itself;
- **Online**: of those, the ones observed heartbeating; and
- **Available now**: of those, the ones with a free schedule slot.

Each column is its own count of processors, not a network-wide share
multiplied into the row. The panel shows the reserve it assumed and the
evidence it was measured from.

Sizing is about **memory only**. It is **not a CPU-speed claim**, and a row is
not a promise that a workload of that size runs as fast as it would on any
particular cloud instance.

Until Liskov has a measured device reserve, the whole panel is
**unavailable** with `no_measured_basis`. Liskov does not substitute an assumed
reserve.

## Check a placement

The placement check asks one question: of the placeable processors, how many
meet the requirements you would author? You enter:

| Input | Manifest key | Rule |
| --- | --- | --- |
| Jobs | `deployment.jobs` | 1–256; one if you leave it out, as in the manifest. |
| Memory | `deployment.placement.minimums.memory` | A V5 byte size, such as `4GiB`. |
| Storage | `deployment.placement.minimums.storage` | A V5 byte size. |
| Single-core score | `deployment.placement.minimums.cpuSingleCoreScore` | An integer, 1–9,007,199,254,740,991. |
| Multi-core score | `deployment.placement.minimums.cpuMultiCoreScore` | An integer, 1–9,007,199,254,740,991. |
| Runtime | `runtime.kind` | `javascript` or `native_image`. |
| Uses secrets | — | Whether the Application reads secrets. |

The minimums are optional, but if you include `minimums` it must name at least
one. The values are checked by the same rules publication uses, so a value the
check accepts is one a V5 manifest accepts. The check shows the matching
manifest fragment, built from exactly the values you submitted.

### Read the answer

The answer shows:

- **Placeable** — the processors every criterion is counted within;
- each criterion, in a fixed order (memory, storage, single-core score,
  multi-core score, runtime, secrets), with the processors meeting it
  **alone** and meeting it **together with every earlier criterion**;
- **Meeting all** — the processors meeting every criterion, counted directly
  rather than taken as the smallest of the others;
- the **tightest criterion**, the one that removes the most processors, when
  Liskov can name it without revealing a hidden count; and
- **Available now** — of the processors meeting every criterion, those with a
  free schedule slot, with its own freshness.

The counting rules above apply: zero is zero, **fewer than 20** has no number,
and an unavailable figure is not zero. If you ask for secrets, the secrets
criterion is **unavailable** for the reason given under
[What processors can run](#what-processors-can-run), and so is **Meeting all**.

The count does not change with `deployment.jobs`. It counts processors, and
says nothing about how many of your jobs they would take.

### What the answer is not

The answer is **advisory**. It is an upper bound: it selects no processor,
ranks none, and reserves nothing. When your deployment launches, Liskov
decides placement again at that moment, from the facts then, and that
**final placement at launch** is what assigns a processor.

The check does not look at everything final placement does. It does not check:

- the reward you offer against what processors accept;
- a processor's full job schedule;
- the runtime modules a processor provides;
- whether a processor accepts work from Liskov's account;
- how many jobs one processor may take; or
- for secrets, whether a processor has a secret response key.

So a processor counted here can still be passed over at launch. A result of 20
or more is not a promise that your jobs will be placed, and a result of zero is
a strong sign that, with these requirements, they will not be.

### What the check refuses

The check refuses a request rather than guessing at it, and names the field:

| Reason | When |
| --- | --- |
| `not_json`, `not_an_object` | The request is not a JSON object. |
| `unsupported_selector` | `deployment.placement.processorSelection` is present. The check counts the open market and never names processors. |
| `unsupported_in_v5` | `deployment.placement` has `allow`, `exclude`, `managers`, or `countries`. Manager and country controls are not V5 placement. |
| `unknown_field` | Any other key the check does not take, such as a cursor, a grouping, or a list of processor IDs. |
| `required` | `deployment`, `runtime`, `runtime.kind`, or the secrets choice is missing. |
| `empty_minimums` | `minimums` is present but names nothing. |
| `invalid_byte_size` | A memory or storage value is not a valid V5 byte size. |
| `out_of_range` | Jobs is not 1–256, or a score is 0 or too large. |
| `not_an_integer`, `invalid_type` | A value has the wrong type. |
| `unknown_runtime_kind` | `runtime.kind` is not `javascript` or `native_image`. |

A request larger than 2,048 bytes is refused as too large.

## When a figure is missing

Compute keeps these situations apart, and never shows one as another:

- **Zero.** Liskov measured, and nothing meets it.
- **Fewer than 20.** Something meets it; the exact number is withheld.
- **Unavailable.** The source could not measure it. There may be many.
- **Stale.** The figure is real but old; read its age.
- **An empty network.** Every panel is current and every count is zero: the
  register knows no processor.
- **The read failed.** Compute shows that the network could not be read, and
  draws no figures. It does not show zeros in their place. Reload the page.

An unavailable or stale panel is not something you need to repair, and it
does not stop you publishing. Placement at launch works from its own facts
either way.

If Compute refuses to open, check that you are signed in and that the
organization selected in the Console is one you are an active member of. See
[Sign-in, organization, and Service Credit reads](../troubleshooting/account-funding.md).

## Read the response

The Console reads two routes with your signed-in session. They are listed here
so the fields on the page can be traced; this is not a separate supported
client interface.

- `GET /api/compute` returns schema `compute_summary_v1`, with the panels
  `population`, `capability`, `runtime`, `heartbeat`, `managers`, `location`,
  `availability`, and `sizing`.
- `POST /api/compute/feasibility` returns schema `compute_feasibility_v1`. It
  echoes the validated request in manifest shape, then `feasibility` and
  `availability`.

Neither route takes query parameters. A count is written as
`{"state":"exact","count":N}` or as a bare `{"state":"suppressed"}`,
`{"state":"withheld"}`, or `{"state":"unavailable"}`. Each panel has a
`source` block:

| Field | Meaning |
| --- | --- |
| `freshness` | `current`, `stale`, or `unavailable`. |
| `observedAtMs` | When the source was observed, as Unix milliseconds, or `null`. |
| `ageMs` | How old the observation was at the read, or `null`. |
| `projectionVersion` | Which version of the register's view it came from, or `null`. |
| `unavailableReason` | One of the reasons [above](#how-fresh-a-figure-is), or `null`. |

Byte sizes are written with both the authored spelling and the exact byte
count as a string, such as `{"authored":"4GiB","bytes":"4294967296"}`.

## Verify

Compute and the placement check describe what placement could do. What
placement did is in your deployment's evidence. After you publish, wait for
processor assignment and read the processor and job in the deployment timeline;
see [Deployments, jobs, and timelines](../operate/deployments-jobs.md).
