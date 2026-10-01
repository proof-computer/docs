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

Three commands on this page — `proof liskov placement manager-fleet`,
`proof liskov application signer` and
`proof liskov runtime-ssh attachment endpoints` — are in the CLI but are not
yet listed in `--help`. Steps that have no customer path yet say so.

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
- for ACU spend, an ACU account you control and a self-custody signer.

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

## 4. Pair your self-custody signer (ACU spend only)

Skip this step when `deployment.spend.unit` is `service_credit_micros`:
Service Credits pay, as in V5.

With `deployment.spend.unit: acu_planck`, your own ACU account pays the chain
through your own paired self-custody signer. ACU spend is never Service
Credits, and Liskov never falls back to paying for you.

Pairing a signer is not yet a customer path. The pairing procedure is pinned
when V6 is released.

Once a signer is paired, read its standing:

```bash
proof liskov application signer APPLICATION_ID
```

The readback names the policy the signer is paired against, each signer's
liveness, open sign requests, terminal counts, dispatch lag and the last
signature. **Standing** is the first of these that applies: `unpaired`,
offline, an old signer protocol, sent requests with no legible outcome,
requests waiting for a signer, or `online`.

Observed funding is **not reported**: the readback prints the server's reason
(`v6_custody_execution_not_built`), never a figure. Your declared ACU caps are
on the Application's **Spend** section in the Console (`/apps/<ref>/spend`),
which also draws the signer's standing.

## 5. Write and validate the V6 manifest

The [Application Manifest V6 reference](../reference/manifest-v6.md) is the
grammar. A V6 manifest for this journey declares:

- your integration once under `integrations.tailscale`;
- each local HTTP service under `ingress.http`, with a Tailscale endpoint and
  optional `live` and `ready` probes;
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
spends nothing.

## 6. Publish

```bash
proof liskov application policy publish APPLICATION_ID ...
```

`proof liskov application policy publish` refuses a V6 document until V6 is
released. The release names the publication pair; until then, nothing on this
page launches a job.

After publication, the Console's **Policy** section (`/apps/<ref>/policy`)
shows the published policy.

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
provider-owned ingress, TCP ingress, durable state, cohorts and placement
spread are not part of V6. For SSH through Liskov's managed relay instead of
your tailnet, see [Use retained V5 Managed Runtime SSH](./runtime-ssh-v5.md);
for the integrations your organization can connect, see
[Integrations](./integrations.md).
