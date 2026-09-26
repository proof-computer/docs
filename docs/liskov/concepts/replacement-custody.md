---
title: Replacement custody and time-boxed execution
description: Understand how Liskov continues Application intent through successors while Acurast retains control of registered job schedules.
---

# Replacement custody and time-boxed execution

Liskov provides **replacement custody**: it safely holds the authority and
state needed to create bounded successor jobs as an Application renews,
updates, or recovers from a launch-stage failure.

It does not own a kill switch for the Acurast network.

## Why successors exist

An Acurast job has an immutable registration and scheduled end. The long-lived
Application therefore continues through generations:

```mermaid
timeline
  title One Application slot over time
  Generation 1 : policy A : processor X : scheduled end
  Generation 2 : policy A renewal : processor Y : new runtime instance
  Generation 3 : policy B update : processor Z : new configuration
```

Liskov records desired successor state separately from proof that it was
submitted, assigned, bootstrapped, and ready.

## Renewal and update

Renewal uses the same effective policy digest. An update selects a new policy,
artifact, or configuration generation. Fixed pre-end renewal can request
overlap; after-end renewal can avoid deliberate overlap. Neither guarantees
continuity because processor assignment and startup are market/network facts.

The supported v1 update behavior lets existing jobs run to scheduled end. That
preserves chain truth and can produce two live generations temporarily. Design
workloads with idempotent operations, leases, or external coordination when
duplicate activity matters.

## Pause and retirement

Pause stops new Liskov planning and spend admission. Existing registrations
continue. Retirement starts with pause, waits for all schedules and financial
tails to close, and then seals a receipt. No user or administrator can turn an
ambiguous nonzero gate into “complete.”

## Failure budgets

Launch retries are bounded by policy and surfaced through the Action Plan.
For a V5 registration that makes no signed runtime contact, Liskov may buy one
replacement for the occurrence after the verified scheduled start, the assigned
maximum start delay, and five more minutes. It does so only while other jobs
have recently made verified contact with Liskov. The original registration and
its financial closeout continue independently, and a late contact does not
erase a replacement already reserved. The absence of contact does not establish
a fault in your application or prove that the processor crashed.

Other runtime replace-after-failure behavior remains internal; v1 otherwise
waits for scheduled end. The one no-contact replacement still passes the
authored spend ceiling and launch pacing, so it may be deferred or refused.

The core distinction is simple: policy describes allowed intent; evidence
describes what actually happened.
