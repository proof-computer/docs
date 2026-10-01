---
unlisted: true
title: Private ingress, Tailscale SSH and self-custody funding
description: What a degraded private endpoint, a disabled Tailscale integration and an ambiguous signing outcome look like under V6, where to read each one, and what to do next.
---

# Private ingress, Tailscale SSH and self-custody funding

:::danger[Not released]

V6 is not released. No Application can publish a V6 manifest, so none of the
symptoms on this page can occur yet.
[Capabilities and limits](../reference/capabilities.md) owns what is
available, and the [Application Manifest V6 reference](../reference/manifest-v6.md)
is the contract.

`proof liskov runtime-ssh attachment endpoints` and
`proof liskov application signer` are in the CLI but are not yet listed in
`--help`. Rows whose customer-visible evidence is not yet pinned say so.

This page is written as though final so that it can be reviewed before the
release.

:::

Start from what you can observe. Each section names where to read it and the
safe next step. The journey itself is
[Reach your own service on your own fleet, privately](../operate/private-ingress-v6.md).

| Symptom | Where to read it |
| --- | --- |
| An endpoint is `degraded` | `proof liskov runtime-ssh attachment endpoints`, or **Integrations → Tailscale** |
| An endpoint stays `published` | The same two places |
| Jobs lost their tailnet access after the integration was turned off | `proof liskov runtime-ssh attachment list --include-terminal` |
| A sign request has no legible outcome | `proof liskov application signer`, or the Application's **Spend** section |
| A job restarted or was replaced | Pinned when V6 is released |
| Devices or keys remain after retirement | Pinned when V6 is released |

## Read the endpoint states

Read one attachment's endpoints:

```bash
proof liskov runtime-ssh attachment list
proof liskov runtime-ssh attachment endpoints APPLICATION_ID ATTACHMENT_ID
```

The Console shows the same states on **Integrations → Tailscale**
(`/settings/integrations/tailscale`), in the attachment's block.

| `state` | Meaning |
| --- | --- |
| `pending` | No address has been assigned yet. |
| `published` | The address is assigned. Nothing has been observed answering on it yet. |
| `ready` | The readiness probe succeeded. |
| `degraded` | The endpoint was published, and its probe now fails. |
| `withdrawn` | The endpoint is no longer published. |

`state` is the only readiness fact. An address, the attachment's own readiness
and a timestamp are never read as ready.

## An endpoint is degraded

A degraded endpoint carries the runtime's failure code. The address stays
assigned, and the endpoint's `readyAtMs` is the time it last succeeded.

| Failure code | What it means | What to do |
| --- | --- | --- |
| `access_probe_failed` | The probe ran and did not succeed. | Check that the service is listening on its `localPort`, and that an `http` probe's path answers 2xx with the substring you named. |
| `access_probe_timeout` | The probe did not answer in time. | Check that the service is not blocked or overloaded. Probe timeouts are set by the platform and are not authored. |
| `access_probe_unsupported` | The runtime cannot run this probe shape, as with an `exec` probe. | Use an `http` or `tcp` probe instead, then validate and publish again. |

The probe shapes are in the
[Application Manifest V6 reference](../reference/manifest-v6.md).

## An endpoint stays published

`published` is not an error: the address exists and no probe has succeeded
yet. If it does not move to `ready`, check the same things as for
`access_probe_failed`. An endpoint without a `ready` probe has nothing to
observe it ready; add one.

## The integration is disabled

When your Tailscale integration is no longer enabled, Liskov tears down each
Tailscale attachment that uses it, with the reason `integration_disabled`.
Runtime SSH requests through it are refused with
`runtime_ssh_integration_disabled`.

Read the stopped attachments:

```bash
proof liskov runtime-ssh attachment list --include-terminal
```

To restore access, create a new integration and validate it:

```bash
proof liskov runtime-ssh integration create ...
proof liskov runtime-ssh integration validate INTEGRATION_ID
```

Then name the new integration id in the manifest's `integrations.tailscale`,
validate the manifest, and publish again. A path to re-enable a disabled
integration is pinned when V6 is released.

## A signing outcome is ambiguous

With `deployment.spend.unit: acu_planck`, Liskov sends sign requests to your
self-custody signer. An **ambiguous** request is one your signer was sent and
whose outcome Liskov cannot read: it does not know whether the request was
signed.

Read it:

```bash
proof liskov application signer APPLICATION_ID
```

The **Counts** line shows `ambiguous` with the number of such requests, and
**Standing** reads as sent requests with no legible outcome. The Application's
**Spend** section in the Console (`/apps/<ref>/spend`) shows the same standing.

An ambiguous request is not a charge you can read here. Observed funding is
not reported (`v6_custody_execution_not_built`), and ACU spend is never shown
as Service Credits. Check your signer's own records, then collect a [support bundle](./support.md) with
the Application, the operation id from the readback, and your signer's
address.

## A job restarts or is replaced

What Liskov reports for a V6 job's endpoints and tailnet access when the job
restarts or is replaced is pinned when V6 is released.

## Devices and keys after retirement

What Liskov reports when it removes a retired job's tailnet devices and keys
is pinned when V6 is released.
