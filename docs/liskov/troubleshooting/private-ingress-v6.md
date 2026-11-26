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
| Jobs are waiting on a replaced or lost signer key | `proof liskov application signer`, or **Spend** → **Waiting to close** |
| V6 publication reports an integration refusal | [Publication is refused for an integration](#publication-is-refused-for-an-integration) |
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
| `access_probe_unsupported` | The runtime reported that it could not run the probe. V6 validation accepts only `http` and `tcp` probes. | If you see this for a validated V6 manifest, contact support with the attachment ID and failure code. |

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

When the server reports funding, the CLI's **Observed funding** shows
admitted launches, open reserves, settled launches and the settled amount in
ACU and planck, **Closed, amount unknown** with its count and reasons, and
unresolved holds. The Console's **Observed spend** shows **Launches paid by
your signer**, **Settled**, **Still reserved**, **Closed, cost not known** with
reasons, and **Waiting to close**. If the server reports
`no_customer_funded_execution`, the CLI says funding was not reported and
the Console says **Nothing paid yet**. Add `--json` to read the server body.

**Closed, amount unknown** means the obligation is closed and Liskov could
not prove the amount. An ambiguous signing outcome stays held. A
deregistration request that expires before a signer receives it can be asked
again under the same request ID after Liskov confirms the registration still
exists on chain.

Check your signer's records, then collect a [support bundle](./support.md)
with the Application, the operation ID from the readback, and your signer's
address.

## A signer key is lost or replaced

Pair a new key using the [signer pairing procedure](../operate/private-ingress-v6.md#4-pair-your-self-custody-signer-acu-spend-only).
Each existing job still needs its registering signer to sign its
deregistration. If you have that key, reconnect the old signer using its
existing configuration and binding. Read the Application's signer standing
again to check whether it appears under **Replaced signers**.

If the key is lost, those jobs are unreclaimable. Look under
**Deregistration holds** and **Retired signers to reconnect** in the CLI
readback, or **Waiting to close** in the Console's **Spend** section. When
Liskov knows the registering address, it identifies the signer required.
Contact [support](./support.md) with the Application, the held launches
and the registering address if visible.

## Publication is refused for an integration

Read the refusal code and the named use site. Check the declared integration
and any override for that site, and compare them with your organization's
**Integrations → Tailscale** page. After correcting the cause, validate the
manifest and run the publication preflight again.

| Refusal code | HTTP status | What to do |
| --- | --- | --- |
| `v6_integration_directory_evidence_missing` | 503 | Retry preflight shortly. Contact support if Liskov still cannot read integration evidence. |
| `v6_integration_authority_missing` | 422 | Check that the reported SSH or HTTP endpoint site resolves to a declared integration. If it does, contact support with the code and site. |
| `v6_integration_authority_duplicate` | 422 | Check that the site resolves to a single integration. If the declaration and override are correct, contact support with the code and site. |
| `v6_integration_authority_unconsumed` | 422 | Check that the current manifest still contains the reported use site. Retry with the current manifest and its matching build evidence. Contact support if the refusal persists. |
| `v6_integration_override_mangled` | 422 | Check that the site's override names the intended integration. Contact support if preflight still reports a different resolution. |
| `v6_integration_kind_mismatch` | 409 | Select a Tailscale integration for the reported Tailscale endpoint or SSH provider. |
| `v6_integration_cross_organization` | 403 | Use an integration owned by the Application's organization and publish under that organization. |
| `v6_integration_unknown` | 404 | Check the integration ID against the owning organization's Tailscale integrations and correct the manifest if needed. |
| `v6_integration_revoked` | 409 | Select an active, validated integration and update the manifest. |
| `v6_integration_revocation_epoch_stale` | 409 | Recheck that the integration is active, then run a fresh preflight. Use a validated replacement if it has been disabled. |
| `v6_integration_configuration_revision_stale` | 409 | Revalidate the current integration and run a fresh preflight after the configuration change. |
| `v6_integration_scope_escaped` | 409 | Check that the integration grants the access required at the reported site. Select a validated integration with the required access, or contact support if the grant is already correct. |
| `v6_integration_credential_pointer_missing` | 409 | Validate the integration's credential. If validation fails, rotate it and validate again. If the refusal persists, contact support with the integration ID. |

## A job restarts or is replaced

What Liskov reports for a V6 job's endpoints and tailnet access when the job
restarts or is replaced is pinned when V6 is released.

## Devices and keys after retirement

What Liskov reports when it removes a retired job's tailnet devices and keys
is pinned when V6 is released.
