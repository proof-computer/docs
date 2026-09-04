---
title: Glossary
description: Plain-language definitions for the Liskov, Acurast, deployment, proof, billing, and lifecycle terms used across the docs.
---

# Glossary

## A

**Acurast** — The external network that supplies phones for running Liskov
jobs. Acurast owns processor assignment, job schedules, and network
settlement.

**Action Plan** — The organization queue of work Liskov has stopped on and
will not resolve without you. Per-Application “what is wrong right now” lives
on that Application’s Deployments index. A missing action usually means you
should wait or contact support rather than use an internal recovery command.

**Application** — The long-lived Liskov resource that owns desired
configuration, artifact and policy history, deployments, logs, billing
correlation, and lifecycle.

**Application ID** — The readable identifier authored in Manifest V4. It is
useful in familiar references but is not the immutable database identity.

**Application UID** — The server-issued immutable Application identity. It
survives display-name and repository changes and binds canonical records.

**artifact** — The immutable bundle or image whose bytes a job runs.

**artifact version** — A recorded artifact plus its CID or digest and verified
build provenance.

**attestation** — Signed evidence about an identity or event. In Liskov this
can include GitHub OIDC build identity, processor hardware evidence, or signed
runtime diagnostics. Each attestation proves only its stated boundary.

## D–J

**deployment** — Liskov's recorded attempt or generation for realizing an
effective policy. A deployment can create one or more external facts over its
lifetime; v1 supports one stable job slot.

**effective policy** — The immutable, normalized V4 execution contract Liskov
publishes after resolving server-owned facts. It is distinct from the manifest
in your repository.

**final charge** — Settled USD Service Credit usage after Liskov has the
required execution and settlement evidence.

**IPFS** — A content-addressed storage network. An IPFS content identifier
(CID) identifies bytes by content rather than by a mutable server location.

**job** — A time-boxed Acurast network registration assigned to a processor.
The job is not the long-lived Liskov Application.

## M–R

**managed custody** — The default model in which Liskov uses PROOF-controlled
treasury authority to submit and settle Acurast work within customer-approved
limits. It does not create a customer ACU wallet.

**manifest** — The strict Application Manifest V4 document a developer authors
in a repository or imports as a draft.

**planck** — The smallest integer unit of ACU used by Acurast contracts. Liskov
shows it in exact advanced limits while customer billing remains in USD Service
Credits.

**processor** — An Acurast phone that accepts and runs a job in secure
hardware.

**proof chain** — The connected evidence from source/listing through build,
artifact, policy, Acurast assignment, and runtime contact.

**replacement** — A successor deployment or job created to continue the
Application's desired service before or after an earlier job's scheduled end.

**reserve** — A temporary hold against USD Service Credits for bounded possible
usage. It is not the final charge.

**retirement** — The safe asynchronous lifecycle that stops new work, waits
for execution and financial closure, and finishes with an immutable deletion
receipt.

**runtime instance** — One process boot inside a job. A restart creates a new
runtime instance without necessarily creating a new Acurast job.

## S–V

**schedule** — The chain-owned start/end window for an Acurast job. Liskov can
plan a successor but cannot rewrite an existing job's scheduled end.

**trusted execution environment (TEE)** — Hardware isolation intended to keep
code and data separate from the phone's normal operating environment. TEE
evidence does not by itself prove which source commit produced the code.

**USD Service Credit** — The only customer balance in Liskov. Credits are
non-transferable value for Liskov-managed service, not dollars in a payment
account and not ACU or another cryptoasset.

**variable** — Managed non-secret configuration delivered to a job, normally as
an environment value.

**V4** — Version 4 of the public Application manifest and effective-policy
contracts. It is the only public authoring version.
