---
title: Inspect a processor your organization used
description: Read your organization's history on one processor, distinguish runtime contact from fleet intelligence, and understand the Enterprise boundary.
---

# Inspect a processor your organization used

The Console provides a processor record after your organization has deployed a
job there. It does not provide a processor directory or search. This keeps the
record useful for investigating your own runs without exposing Liskov's fleet
inventory.

The read is available on every plan. Your organization's history and
chain-published facts are always visible. Liskov's fleet intelligence is
available only with the **Enterprise** entitlement.

## Before you begin

You need:

- access to the organization that ran the deployment; and
- a processor link from an Application's **Deployments** or **Executions**
  page.

This is a read-only task. Opening the record does not create a deployment,
submit a chain transaction, reserve Service Credits, or add a final charge.

## Open the processor record

1. In the [Liskov Console](https://liskov.proof.computer), select the
   organization that ran the job.
2. Open the Application and choose **Deployments** or **Executions**.
3. Select the processor identifier.

The Console opens an organization-level route under **Operations**:

```text
/operations/processors/<PROCESSOR_ID>
```

Use the page's **Back** action to return to the deployment or execution you
were investigating. The Console re-checks the active organization's deployment
history on every processor read; possessing or editing a URL does not grant
access.

## Read the scope labels

Every section says whose evidence it contains:

| Scope | What it means |
| --- | --- |
| **your org** | Only deployments and runtime contact from the active organization. A small number of runs is history, not a reliability score. |
| **whole fleet** | A chain-published fact or Liskov register result about that processor across the fleet. |

Do not merge the two records. Your four deployments do not measure fleet
reliability, and a fleet counter does not describe the outcome of your four
deployments.

## What every plan can read

- your organization's deployments on the processor, across its Applications;
- each returned deployment's Acurast job and first/latest runtime contact;
- placement eligibility, attestation, and geography needed to reason about
  your own deployment;
- chain-published status, manager, platform, and build; and
- the four chain-published hardware values: single-core score, multi-core
  score, memory bytes, and storage bytes.

The hardware panel has one observation time for the set. `storageBytes` is free
space at that observation, not device capacity. It can change before a later
placement decision.

Runtime contact and register liveness are different evidence. Runtime contact
comes from the Liskov runtime inside your deployment. Register liveness is
fleet telemetry; it is not a second view of your runtime heartbeat.

## What Enterprise adds

Enterprise fills the panels labelled with the Enterprise chip:

- fleet acknowledgement and reported execution counters;
- register contact, silence, freshness, and staleness while your organization
  has a running deployment there;
- Liskov's placement assessments; and
- register confidence, conflict state, projection version, and source
  watermark.

When your organization's last deployment ends, the live register feed freezes
at your last contact. Historical access to your own deployment record remains.
The page reports positive acknowledgement, success, and failure observations;
it does not infer a failure rate from acknowledgements the register did not
observe.

On a plan without the entitlement, labels remain visible and values are
redacted. An Enterprise page with no current register profile instead says that
data was not reported. Redaction and missing data are not the same state.

## Verify the record

Confirm that:

- the page appears under **Operations**, not inside one Application;
- the deployments table includes only the active organization's history;
- each section is labelled **your org** or **whole fleet**;
- chain-published hardware remains visible regardless of plan; and
- an Enterprise record shows values where a non-Enterprise record shows
  deliberate redaction bars.

Use **Acurast Hub** from the processor page when you need the chain's record of
the address. Continue to [Inspect the proof chain](./proof-chain.md) when you
need to relate the processor to policy, job, runtime-instance, and attestation
evidence.

## If the page is not found

An unknown processor and a processor your active organization has never used
produce the same not-found result. This prevents the URL from becoming a way to
enumerate Liskov's register.

Check the active organization and return to the deployment or execution that
provided the link. If the link still fails, collect the exact Application,
deployment, job, and processor identifiers for
[support](../troubleshooting/support.md). Do not replace the processor ID with
an address from another organization.
