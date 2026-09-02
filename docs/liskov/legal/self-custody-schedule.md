---
title: Liskov Self-Custody Signer Schedule — review draft
description: Draft additional terms for Customers that hold their own ACU key and operate the Liskov self-custody signer.
draft: true
---

# Liskov Self-Custody Signer Schedule — review draft

:::caution Preview; not in force
Version 0.1, dated 2 September 2026. Self-custody remains Preview and this
schedule applies only after explicit enablement and acceptance.
:::

This schedule supplements the Liskov Master Terms for a Customer approved to
use the self-custody signer. If it conflicts with the Master Terms about
self-custody, this schedule prevails.

## 1. The boundary

Self-custody lets the Customer hold the private key for its own Acurast account
and authorize supported deployment-lifecycle extrinsics through a Customer-run
signer. In this model:

- the private key exists only on infrastructure controlled by the Customer;
- the signer connects outbound to Liskov and submits signed extrinsics directly
  to an Acurast RPC;
- PROOF sends a proposed unsigned lifecycle call and context, but cannot sign
  it;
- the signer independently decodes and checks the call against its local
  allowlist and limits before signing;
- PROOF does not hold or administer the Customer's ACU; and
- there is no silent or automatic fallback to a PROOF-managed key.

Self-custody changes chain key, funding, and availability responsibility. It
does not make Liskov open-source, remove USD fees, or make PROOF responsible for
the Customer's wallet operations.

## 2. Supported activity

The standard signer is intended to authorize only supported Acurast
deployment-lifecycle calls, including registration, deployment, environment
delivery, and deregistration/reclaim, within local limits. It is not intended
to authorize general token transfers, swaps, staking, governance, or arbitrary
extrinsics.

The released signer version, metadata, allowlist, reward limits, and supported
network are authoritative. A source-code example or a modified binary is not a
supported signer merely because it can connect.

## 3. Customer responsibilities

The Customer is solely responsible for:

- generating, holding, backing up, and protecting its key, seed, passphrase,
  and recovery material;
- securing, patching, monitoring, and maintaining the signer host and network;
- keeping the signer running, connected, funded, time-synchronized, and on a
  supported version when lifecycle signatures may be required;
- independently reviewing the network, genesis, runtime, metadata, call,
  Application, amount, schedule, processor, and local limit before approval;
- configuring per-call, per-deployment, and time-window limits appropriate to
  its risk;
- maintaining enough ACU for rewards and network fees and acquiring or
  disposing of ACU outside Liskov;
- selecting and securing any RPC endpoint it configures;
- recording submitted transaction hashes and monitoring inclusion, finality,
  execution, and reclaim; and
- complying with law, tax, sanctions, accounting, and internal-approval duties
  relating to its ACU and on-chain activity.

The Customer must not give PROOF its private key, seed, passphrase, recovery
material, or unrestricted wallet access.

## 4. Key loss and compromise

PROOF never receives the private key and cannot recover, rotate, export, or
restore it. Loss of the key or recovery material may permanently prevent the
Customer from controlling the account, updating or retiring jobs, or reclaiming
unused ACU.

If compromise is suspected, the Customer must stop the signer, use its own
wallet and network procedures to protect remaining assets where possible,
revoke Liskov pairing, and notify support. PROOF cannot reverse signed or
finalized activity.

## 5. Availability and compatibility

Lifecycle work may fail, expire, queue only for a limited time, or remain
incomplete if the signer, Customer network, RPC, Acurast network, account
balance, metadata, or supported binary is unavailable or incompatible.

The signer fails closed on network, runtime, transaction-version, metadata,
decoding, allowlist, or limit disagreement. PROOF may require an update or
re-pairing and may refuse to send requests to an obsolete or insecure signer.
This is expected security behavior, not managed-service downtime.

## 6. Authorization and no agency

Pairing proves control of the Customer's Acurast address and binds it to the
approved Organization or Application. A valid signature from that account is
treated by the network as the Customer's authorization.

PROOF provides orchestration information and the supported signer software. It
does not act as the Customer's wallet custodian, trustee, broker, exchange,
investment adviser, or fiduciary. The Customer decides whether its signer signs
and submits a call.

## 7. ACU and network outcomes

ACU held in the self-custody account belongs to and remains controlled by the
Customer. Rewards, fees, escrow, processor payments, deregistration, and any
protocol return are determined by Acurast. They are not a Liskov-held balance.

PROOF does not guarantee token value, liquidity, fees, inclusion, finality,
processor behavior, execution, or reclaim. A successful signer response or
transaction hash does not prove finality or successful execution.

The managed-custody rule that can release a USD Service Credit reserve or close
a managed no-report outcome does not rewrite or refund the Customer's immutable
self-custody ACU movement.

## 8. Liskov fees

The Customer remains responsible for Liskov plan and service charges stated in
its Order Form or pricing schedule. Those charges are payable in USD or USD
Service Credits and are separate from ACU paid directly by the Customer to the
network.

PROOF may withhold new signing requests when the Organization is not in good
billing standing. The Customer may still use its key independently outside
Liskov.

## 9. Open-source software

The signer software is licensed under its repository licence and may include
third-party open-source components. The licence governs copying and
modification; this schedule governs the supported Liskov service.

PROOF supports only identified releases and configurations. If the Customer
modifies the signer, disables checks, expands the allowlist, changes RPC or
metadata behavior, or uses another binary, the Customer assumes the resulting
risk and PROOF may refuse support or connection.

## 10. Ending self-custody service

Before disconnecting or terminating the signer, the Customer should inspect
active jobs, pending requests, schedules, balances, and reclaim opportunities.
Disconnecting does not cancel a job, undo a transaction, or transfer the key to
PROOF.

On termination, PROOF will revoke the pairing and stop sending new requests.
The Customer remains solely responsible for its account, key, active jobs,
network obligations, and any later lifecycle action.

## 11. Preview disclaimer

Unless an Order Form expressly says otherwise, self-custody is Preview,
best-effort, and excluded from the standard 99.95% availability target. It may
change as Acurast metadata, supported calls, or security requirements change.
