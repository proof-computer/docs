---
unlisted: true
title: Reach your own service on your own fleet, privately
description: The V6 journey from your own processor manager, through your Tailscale integration and, for ACU spend, your self-custody signer, to a published manifest, a private endpoint read as Liskov observed it, and SSH from your own tailnet.
---

# Reach your own service on your own fleet, privately

:::danger[Not released]

V6 is not released. No Application can publish a V6 manifest: a document
declaring `schemaVersion: 6` is refused at publication.
[Capabilities and limits](../reference/capabilities.md) owns what is
available, and the [Application Manifest V6 reference](../reference/manifest-v6.md)
is the contract this journey follows.

This page is written as though final so that the journey can be reviewed
before the release. Read it as a design, not as a path you can follow today.

:::

V6 lets one Application run on processors you manage, publish a local HTTP
service to your own Tailscale tailnet, and accept SSH from that tailnet.
Optionally, your own ACU account pays the chain through a signer you hold. The
endpoint is private: it is reachable only on your tailnet and governed by your
tailnet's access rules. V6 adds no public ingress.

The journey has six parts:

1. find your manager id and confirm the fleet it reaches;
2. connect your Tailscale integration;
3. for ACU spend only, pair your self-custody signer;
4. write and validate a V6 manifest;
5. publish it; and
6. read the private endpoint and connect with SSH from your tailnet.

## Before you start

You need:

- an organization on Pro or above, signed in with the CLI;
- at least one processor you manage, and a processor you have already
  deployed to under that manager;
- a Tailscale tailnet you administer, with an OAuth client and a dedicated tag
  for Liskov jobs;
- a `native_image` runtime: SSH, private endpoints and health probes are
  refused on `javascript`; and
- for ACU spend, an ACU account you control, a configured self-custody signer
  with that account's key, and an organization with the `custody_signer`
  entitlement.

Nothing in steps 1–4 spends or launches anything.

## 1. Find your manager id

Your manager id is the processor's on-chain manager, written as digits. Learn
it from a processor you have already deployed to: in the Console, open that
processor at `/operations/processors/<processorId>`; the processor record
shows its `managerId`. You can also read it from the chain.

## 2. Confirm the manager's fleet

Before you name the manager in a placement rule, check what that rule would
reach:

```bash
proof liskov placement manager-fleet MANAGER_ID
```

The answer is a count, never a list of processors:

- **`N of M eligible processors are placeable now`** — the served placement
  projection knows `M` eligible processors under the manager, and a placement
  filtered to it reaches `N` of them now. The evidence age follows.
- **No eligible processors** — a count of zero. A rule naming only this
  manager reaches nobody; check the manager id before you publish.
- **Fleet size unavailable (`placement_projection_unavailable`)** — no
  projection could answer. This is not a count, and it is not zero: read it
  again later.

A manager id that is not 1 to 39 digits is refused before any request is sent.
Add `--json` for the server's body unchanged.

## 3. Connect your Tailscale integration

The integration is your own Tailscale account: you own the tailnet, its access
rules and its audit trail. Create it once per tailnet. The OAuth client secret
is read from standard input or a protected prompt, never from a flag:

```bash
printf '%s\n' "$TAILSCALE_OAUTH_SECRET" | \
  proof liskov runtime-ssh integration create \
    --name 'Production tailnet' \
    --tailnet example.com \
    --tag tag:liskov-runtime \
    --oauth-client-id CLIENT_ID
```

Then confirm Liskov can use it, and keep its id:

```bash
proof liskov runtime-ssh integration validate INTEGRATION_ID
proof liskov runtime-ssh integration list
```

`proof liskov runtime-ssh integration rotate` replaces the OAuth credential
and `proof liskov runtime-ssh integration disable` turns the integration off.
The Console shows the same integration on **Integrations → Tailscale**
(`/settings/integrations/tailscale`).

Each job uses exactly one resolved Tailscale integration: a manifest whose
sites resolve to two different integrations is refused.

The provider client the control plane pins is `proof-computer/tailscale` tag
`v1.98.10-liskov.1`, descriptor `tailscale-aarch64-1.98.10-liskov.1`, from
liskov-rs `4526233012b28c33a849e8f1cb1ddac220ccf179`
(`crates/liskov-runtime-ssh/src/provider_clients.rs`). A released customer
artifact for that descriptor is pinned when V6 is released.

## 4. Pair your self-custody signer (ACU spend only)

Skip this step when `deployment.spend.unit` is `service_credit_micros`:
Service Credits pay, as in V5.

With `deployment.spend.unit: acu_planck`, your own ACU account pays the chain
through your own paired self-custody signer. ACU spend is never Service
Credits, and Liskov never falls back to paying for you.

Issue a pairing token for your Application:

```bash
proof liskov application signer pair APPLICATION_ID
```

The CLI prints the token's expiry and a `Run signer` line starting with
`liskov-self-custody-signer`. Run that line on the host that holds your
signer's keystore, with your signer configuration and spend limits, before the
token expires. Keep the token private. Pairing connects the signer to the
Application and spends nothing. If pairing returns
`self_custody_plan_required` (HTTP 403), check that the selected organization
has the `custody_signer` entitlement.

Read the signer's standing and check that its bound address is your account's
address and that **Standing** says `online`:

```bash
proof liskov application signer APPLICATION_ID
```

The readback names the policy the signer is paired against, each signer's
liveness and reported version, open sign requests, terminal counts, dispatch
lag and the last signature.

The `version` column can show `(update recommended)`, `(update required)` or
`(unknown)` after the version. The `Signer version: minimum` line gives the
supported minimum and adds `required from` with the date when one is set.
An outdated signer can keep signing. A signer below the minimum may stop
signing at an Acurast runtime upgrade until you update or restart it.

**Standing** is the first of these that applies:

- `unpaired`, when no signer is paired;
- `offline (disconnected)`, when a paired signer is not online and not connected;
- `offline (connected, heartbeat N ms ago; online after M ms of silence is not assumed)`, when a paired signer is connected but not online;
- `signer protocol N is below 2`;
- `N sent request(s) with no legible outcome`;
- `N request(s) waiting … ms for a signer`;
- `online`.

To replace the signer, run the same pairing command and start the new signer.
Each job keeps the signer that registered it. A replaced signer can reconnect
to sign deregistrations for those jobs. Keep its key and configuration until
its jobs finish. If that key is gone, the affected jobs are unreclaimable.
The readback lists connected **Replaced signers** and shows deregistration
holds for jobs waiting on a registering signer. See
[what to do if a key is lost or replaced](../troubleshooting/private-ingress-v6.md#a-signer-key-is-lost-or-replaced).

To remove the current signer, confirm removal:

```bash
proof liskov application signer unpair APPLICATION_ID --yes
```

Unpair is refused while sign requests are open. Use the request IDs in the
refusal to check their standing and retry unpair when they finish. After
removal, read the signer again to confirm **Standing** is `unpaired`. The
registering signers are still needed to deregister their existing jobs.

When the server reports funding, the CLI's **Observed funding** shows admitted
launches, open reserves, settled launches and the settled amount in ACU and
planck, **Closed, amount unknown** with its count and reasons, and unresolved
holds. It identifies retired signers to reconnect when their addresses are
known. If there has been no customer-funded execution, the CLI prints
`Observed funding: not reported (no_customer_funded_execution).` Add `--json`
for the unchanged response from
`GET /api/applications/:applicationId/custody/signer`.

In the Console, open the Application's **Spend** section (`/apps/<ref>/spend`).
**Observed spend** shows **Launches paid by your signer**, **Settled**,
**Still reserved**, **Closed, cost not known** with reasons, and **Waiting to
close**. The settled amount covers launch rewards in ACU. Your policy's
declared ACU caps appear under **Limits**. When the read reports
`no_customer_funded_execution`, the Console says **Nothing paid yet**.

**Closed, amount unknown** means the obligation is closed and Liskov could
not prove the amount. It is excluded from unresolved holds. If a
deregistration request expires before reaching a signer, Liskov can ask
again with the same request ID after checking that the registration still
exists on chain. Ambiguous requests and requests rejected by the signer
stay held.

The merged signer daemon is `liskov-self-custody-signer` `0.3.0` at
`cfdf7fbf9b168c6ba71dc0ba742f0b6835beae4b`. Tag `v0.2.0` does not contain that
commit. A released signer artifact is pinned when V6 is released.

## 5. Write and validate the V6 manifest

The [Application Manifest V6 reference](../reference/manifest-v6.md) is the
grammar. A V6 manifest for this journey declares:

- your integration once under `integrations.tailscale`;
- each local HTTP service under `ingress.http`, with a Tailscale endpoint and
  a `health` block containing `live`, `ready`, or both;
- `access.ssh.provider.kind: tailscale`, if you want SSH;
- `deployment.placement.allow` with a `manager` rule naming your manager id;
  and
- `deployment.spend.unit`, either `service_credit_micros` or `acu_planck`.

Validate it locally:

```bash
proof liskov application manifest validate \
  --file .liskov/application-manifest.json
```

This reads one local file and returns diagnostics. It creates nothing and
spends nothing. A valid file prints `Application manifest v6 is valid.`
followed by `authoredDigest`, `releaseIntentDigest`, and
`firstPublicReady: true`. `firstPublicReady: true` is the local validator's
schema result. It is not permission to publish.

## 6. Publish

The current handler generation must authorize the Manifest V6 `source`
publication pair before Liskov accepts a V6 document. Until that generation
is active, publication is refused even when the document passes local
validation.

Once the pair is authorized, use
`proof liskov application policy publish APPLICATION_ID` with the V6 manifest
and the [attested source evidence and publication preflight](../build/validate-import-publish.md#4-review-publication-preflight).
Review the read-only `--dry-run` before substituting `--yes`. Publication can
start a deployment and use the funding source you set in the manifest.

After publication, check the published policy in the Console's **Policy**
section (`/apps/<ref>/policy`). If publication names a V6 integration refusal,
see [Publication is refused for an integration](../troubleshooting/private-ingress-v6.md#publication-is-refused-for-an-integration).

## 7. Read the private endpoint

When a job launches, it joins your tailnet through an attachment. Find the
attachment:

```bash
proof liskov runtime-ssh attachment list
```

Then read its endpoints as Liskov observed them:

```bash
proof liskov runtime-ssh attachment endpoints APPLICATION_ID ATTACHMENT_ID
```

Each row is one service: its name, local port, `state`, address and failure
code. **`state` is the only readiness fact.** An endpoint is `published` once
its address is assigned, before anything has been observed answering on it;
it is `ready` only after its readiness probe succeeds. Do not read an address
as ready.

The Console shows the same states on **Integrations → Tailscale**, in the
attachment's block.

If an endpoint is `degraded`, see
[Private ingress, Tailscale SSH and self-custody funding](../troubleshooting/private-ingress-v6.md).

## 8. Connect with SSH from your tailnet

From a device on your own tailnet, open SSH to the job's MagicDNS name. Your
tailnet's access rules decide who may connect; Liskov never holds the
session.

The login user is pinned when V6 is released.

## What V6 does not add

V6 adds private endpoints on your own tailnet, and nothing public. Public or
provider-owned ingress, TCP ingress, durable state and cohorts are not part of
V6. For SSH through Liskov's managed relay instead of
your tailnet, see [Use retained V5 Managed Runtime SSH](./runtime-ssh-v5.md);
for the integrations your organization can connect, see
[Integrations](./integrations.md).
