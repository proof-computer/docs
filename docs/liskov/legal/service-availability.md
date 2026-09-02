---
title: Liskov Service Description and Availability Policy — review draft
description: Draft best-effort service boundary, 99.95% availability target, exclusions, maintenance, support, and shared responsibilities.
draft: true
---

# Liskov Service Description and Availability Policy — review draft

:::caution Not in force
Version 0.1, dated 2 September 2026. This policy is a product and legal-review
draft and has no contractual effect.
:::

This policy describes the standard Liskov Service. An Order Form may add a
binding service level for an Enterprise Customer; otherwise this policy states
a target, not a guarantee.

## 1. Service boundary

The standard Service includes the generally available, entitled parts of the
Liskov control plane, including supported account and Organization access,
Application configuration and lifecycle, managed deployment orchestration,
managed secrets and logging where enabled, billing records, and documented
API, Console, and CLI paths.

The standard Service does not include:

- the Acurast or Polkadot networks, individual processors, network governance,
  or network settlement;
- GitHub, IPFS, Stripe, Autumn, Baran, Tailscale, Customer APIs, or another
  independently operated service;
- Customer Applications, source, dependencies, data, or outputs;
- Preview, beta, evaluation, free, internal, or unsupported functionality; or
- a guarantee that an Acurast processor accepts, starts, continues, or
  successfully completes a job.

## 2. Best-effort basis

Liskov is a new platform supplied on a best-effort basis. We design and operate
the control-plane infrastructure for high availability and **target 99.95%
monthly availability** for the production Liskov API and Console.

The 99.95% figure is an operational target, not a warranty, contractual SLA,
or promise of service credits or refunds. No financial remedy applies to a
miss unless an Order Form expressly provides one.

## 3. Measuring the target

Subject to production monitoring validation, monthly availability is intended
to be calculated as:

`(total minutes in month - unavailable minutes) / total minutes in month × 100`

A minute is unavailable when PROOF's monitoring shows that substantially all
valid requests to the production Liskov API or Console fail because of a
PROOF-controlled incident. Partial feature degradation may be recorded
separately.

The following do not count as unavailable minutes:

- announced maintenance and emergency security maintenance;
- Acurast, Polkadot, processor, RPC, chain-finality, or market failure;
- failure of an excluded external service;
- Customer code, configuration, credentials, network, signer, integration, or
  act or omission;
- suspension, rate limiting, spend controls, or enforcement under the
  Agreement;
- Preview, beta, free, evaluation, or unsupported functionality;
- force majeure; or
- inability to place or run a particular workload where the Liskov control
  plane remains available.

:::warning Operational review required
Before publication, PROOF must confirm the exact monitored endpoints,
calculation source, incident owner, partial-degradation treatment, maintenance
notice, and reporting surface.
:::

## 4. Decentralized execution

Applications run on external decentralized infrastructure whose availability,
latency, capacity, geography, continuity, and failure modes differ materially
from conventional cloud infrastructure.

The Customer is responsible for determining suitability and implementing
redundancy, retries, monitoring, backups, recovery, idempotency, key recovery,
and other controls appropriate to the consequence of failure. A single
processor, job, signer, RPC, region, or external API should not be treated as
highly available merely because the Liskov control plane is designed to be so.

## 5. Maintenance and changes

We may perform planned and emergency maintenance. We will use reasonable
efforts to schedule disruptive planned work outside expected peak use and give
advance notice through the Service or account contact. Security, legal, or
external-network events may require immediate work without prior notice.

Features may change or be withdrawn under the Master Terms. We will use
reasonable efforts to provide migration or deprecation guidance for a
materially adverse change to a generally available paid feature.

## 6. Support

Standard support is available at
[support@proof.computer](mailto:support@proof.computer). It is provided on a
best-effort basis without a guaranteed initial-response or resolution time
unless an Order Form states otherwise.

Support may ask for Organization, Application, deployment, job, policy,
transaction, and timestamp identifiers. The Customer must not send private
keys, passwords, session tokens, secret values, card data, raw environment
dumps, or unnecessary personal data.

We prioritize incidents based on scope, security, financial risk, and whether
a supported customer action exists. A response target is not a resolution
commitment and an external-network problem may have no remedy within PROOF's
control.

## 7. Backups and recovery

PROOF maintains recovery measures appropriate to the Service, but standard
service has no contractual recovery-time objective or recovery-point objective.
The Customer must keep independent copies of source, artifacts, configuration,
business data, keys it owns, and records needed to recreate or verify its
Application.

Content published to IPFS or another replicated external system may remain
available outside PROOF after deletion from systems we control. Conversely,
external availability of an IPFS object is not a backup promise by PROOF.

## 8. Dependency cessation

If Acurast, Polkadot, or another essential external dependency materially
changes, stalls, or ceases to operate, we may suspend or discontinue the
affected Service. We are not required to recreate, fork, or migrate that
network.

We will use reasonable efforts to stop new affected commitments, preserve
Liskov-controlled records, explain available export or retirement steps, and
handle Customer billing under the Billing Policy. Existing chain activity may
remain outside our ability to stop or recover.
