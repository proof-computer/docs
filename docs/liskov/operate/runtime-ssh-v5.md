---
unlisted: true
title: Use retained V5 Managed Runtime SSH
description: Register operator keys, enable exact-job blind access, pin host trust, connect with one-time tickets, and withdraw a key without republishing.
---

# Use retained V5 Managed Runtime SSH

:::danger[Not released]

The platform seam behind this page is implemented end to end — a V5
Application with `access.ssh` is served its managed SSH access block, checks
in to ready, admits a connection ticket, and is reaped at schedule end
(BKLG-20260830-sxl6 and its packet chain, merged 2026-08-31). Promotion of
this page into normal navigation is gated by the V5 release contract on the
accepted Managed Runtime SSH **live** rehearsal; until then, follow the
current [Runtime SSH Preview](./runtime-ssh.md) for a production V4
Application. The support boundary at promotion: managed provider only
(`access.ssh.provider.kind: liskov_managed`), `native_image` (Cargo/PRoot)
runtime; Tailscale is not yet available for V5 manifests.

:::

V5 Managed Runtime SSH gives an authorized organization operator a shell in one
exact running native-image job. It is not public ingress and it does not change
workload health, replacement, schedule, or spend.

The relay is blind to the encrypted SSH session. Liskov brokers connection
metadata and one-time admission tickets, verifies the runtime-contact and SSH
server binaries, and records access events. The customer runtime image itself
is not attested by that verification.

## Before you start

You need:

- a Starter, Team, or Enterprise organization;
- the retained V5 capability activated for that organization;
- an `ssh-ed25519` key pair you control;
- a `native_image` manifest with managed access; and
- a running job whose attachment is ready.

The private key never leaves your machine.

## 1. Register the public key

```bash
proof liskov runtime-ssh operator-key add \
  --name work-laptop \
  --identity ~/.ssh/liskov-runtime
```

Or register a public-key file:

```bash
proof liskov runtime-ssh operator-key add \
  --name ci-break-glass \
  --public-key-file ./ci-break-glass.pub
```

Review the organization registry:

```bash
proof liskov runtime-ssh operator-key list --json
```

V5 does not store keys in policy. When Liskov creates an attachment, it
snapshots the organization registry into that exact job's immutable access
authority. Every registered organization key is therefore authorized on every
new V5 managed attachment. Keep the registry small and intentional. An
attachment accepts 1–8 keys; an empty registry or more than eight registered
keys makes attachment preparation fail closed.

## 2. Enable the retained policy arm

Managed SSH is native-image-only:

```json
{
  "runtime": {
    "kind": "native_image",
    "image": {"name": "debian-trixie", "version": "0.1"},
    "entrypoint": {"executable": "/bin/sh", "args": ["/app/start.sh"]}
  },
  "access": {
    "ssh": {
      "provider": {"kind": "liskov_managed"}
    }
  }
}
```

There is no `authorizedKeys`, `port`, `mode`, Tailscale, or tunnel field in the
retained V5 arm. Publish the policy only after reviewing the exact operator-key
registry that the next job will snapshot.

## 3. Inspect without consuming a ticket

```bash
proof liskov ssh APP_REF \
  --identity ~/.ssh/liskov-runtime \
  --print-command \
  --json
```

This resolves the exact attachment, deployment, job, selected-key fingerprint,
signed host fingerprint, and verified helper/SSH-server digests. It does not
mint a ticket. If multiple jobs are ready, select one with `--deployment` or
`--job`.

## 4. Pin host trust and connect

```bash
proof liskov ssh APP_REF --identity ~/.ssh/liskov-runtime
```

The first connection displays the signed job host fingerprint. Accepting it
pins the key under an attachment-specific alias in the CLI's mode-0600
`runtime-ssh-known-hosts` file. `--accept-host-key` automates first use only.
It never accepts a mismatch.

A later mismatch is `RUNTIME_SSH_HOST_KEY_MISMATCH`. Stop; do not delete the
known-hosts file or relax OpenSSH checking. Re-run `--print-command --json`,
compare the attachment and signed fingerprint, and escalate with those exact
IDs.

Only after host trust and the selected operator key are verified does Liskov
mint a short-lived ticket. A ticket is bound to the exact attachment, job,
authorization fence, and key fingerprint; it is consumed once. Replay or use
after revocation opens no session. The CLI stores it in a temporary mode-0600
file and removes that directory when SSH exits.

## Withdraw a key, and what a snapshot means

An attachment's authorized-key set is a snapshot of the registry taken when
the attachment is created, and it is committed into the attachment's
authorization digest, which the runtime re-derives on every bootstrap. It is
therefore never narrowed in place. Withdrawal is a separate deny layer over
that snapshot: a withdrawn key still appears in an existing attachment's
snapshot, and the withdrawal is what refuses it.

```bash
proof liskov runtime-ssh operator-key remove KEY_ID --json
```

Removing a registry key withdraws its access in the same step. New connection
requests and tickets for the fingerprint are refused immediately with
`runtime_ssh_operator_key_withdrawn`, its unused tickets are revoked, and
nothing is republished. The response carries the `withdrawal`, the
`revokedTicketCount`, and a `note` stating the drain rule below. Registering a
key, by contrast, affects future attachment snapshots only.

A session that is already open is **not** cut. It drains: it ends when the
operator disconnects, when the job ends, or at the relay's two-hour maximum
session duration, whichever comes first. A connection that stops answering the
relay's heartbeat is closed after 60 seconds. If access must end sooner than
that, end the job.

`--print-command --json` reports three fingerprint lists on the connection, so
the difference between intended and effective access is never silent:
`authorizedKeyFingerprints` is the effective set, `snapshotKeyFingerprints` is
what the attachment was created with, and `withdrawnKeyFingerprints` is the
overlap that a withdrawal now denies.

To withdraw a key that has no registry row, or to see and lift withdrawals:

```bash
proof liskov runtime-ssh withdrawn-key add --fingerprint SHA256:... --reason "left the team"
proof liskov runtime-ssh withdrawn-key list --json
proof liskov runtime-ssh withdrawn-key remove WITHDRAWAL_ID
```

Lifting a withdrawal does not re-register the key: it must still be in the
registry when the next attachment is created.

For planned rotation:

1. add the replacement key and verify its fingerprint;
2. allow new attachments to snapshot the intended registry;
3. verify the replacement key with `--print-command`;
4. remove the old registry key, which withdraws it; a session it has open
   drains; and
5. let old exact-job attachments reach teardown.

### Cut access to one attachment

To end one job's access for everyone on it, without ending the job:

```bash
proof liskov runtime-ssh attachment list --json
proof liskov runtime-ssh attachment revoke ATTACHMENT_ID
```

Revocation is immediate for everything that has not started: no new connection
request, no new ticket, and no connector re-registration is granted, and the
attachment's unused tickets are revoked. The response reports the
`revokedTicketCount` and `newlyRevoked`; revoking an attachment that is already
revoked answers `newlyRevoked: false` rather than an error, so a retried script
is safe. The customer's process, signed health reporting and schedule are
unaffected — the job keeps running.

A session that is already open is **not** cut. It drains on the same bounds as
a key withdrawal: it ends when the operator disconnects, when the job ends, or
at the relay's two-hour maximum, and a connection that stops answering the
heartbeat is closed after 60 seconds. There is no channel that terminates an
established relay. If a session must end sooner than that, end the job.

Choose between the two by blast radius: `withdrawn-key add` denies one person
across every attachment in the organization, and `attachment revoke` ends one
job's access for everyone. Attachment teardown, however it is reached,
leaves workload health unchanged.

When the job ends or the attachment expires, automatic teardown revokes the
attachment and leaves no live unconsumed ticket. Access teardown never extends,
restarts, replaces, or marks the customer process unhealthy.

## Troubleshooting

| Symptom or code | Safe action |
| --- | --- |
| `runtime_ssh_operator_key_registry_empty` | Register at least one organization key, then wait for a new exact-job attachment. |
| `runtime_ssh_operator_key_registry_too_large` | Reduce the registry to at most eight intentional keys before creating a new attachment. |
| `RUNTIME_SSH_IDENTITY_NOT_AUTHORIZED` | The selected key is not in this attachment's effective set. Compare it with `snapshotKeyFingerprints` and `withdrawnKeyFingerprints` from `--print-command --json`; a key registered after the attachment was created reaches only new attachments. |
| `runtime_ssh_operator_key_withdrawn` | This key's access was withdrawn for the organization. An administrator can lift it with `withdrawn-key remove`; otherwise use another authorized key. |
| `access_proxy_rejected_session_already_open` | A session is already open on this job; managed Runtime SSH allows one at a time. Retry when it closes. |
| `access_proxy_rejected_connector_not_registered` | The runtime has not connected to the relay for this job. If its access sidecar failed, that is terminal for this run; launch a new job. |
| `access_proxy_rejected_connector_unavailable` | The runtime's relay connection is not ready yet. Retry in a few seconds. |
| `access_proxy_rejected_credential_rejected` | The relay refused the one-time ticket. This is not your key: the ticket is minted seconds before use. Retry once, then report the `attachmentId` and the time. |
| `runtime_ssh_attachment_not_ready` with `failureCode: operator_revoked` | Access to this attachment was revoked deliberately by an administrator in your organization. Retrying will not help; a new attachment is created when a new job launches. |
| `runtime_ssh_attachment_not_ready` | Confirm the selected job is running and use `--print-command`; an ended job cannot be reattached. The `failureCode` beside the error names the specific cause when there is one. |
| `runtime_ssh_attachment_not_found` | The attachment id is not one of this organization's managed attachments. Take it from `attachment list`. |
| `runtime_ssh_attachment_ambiguous` | Select the exact deployment or job. |
| `runtime_ssh_plan_required` | Use an entitled organization; do not retry the same request. |
| `RUNTIME_SSH_HOST_KEY_MISMATCH` | Stop and compare signed evidence. Never override or delete the pin. |
| Session ends | Reconnect to obtain a fresh ticket if the attachment remains ready. |
| Access must stop now | Withdraw the key with `operator-key remove` or `withdrawn-key add`: new sessions stop at once and an open one drains within two hours. To end it sooner, end the job. |

Verify access and teardown in the Application activity feed. Share identifiers
and timestamps with support, never private keys, bearer tickets, session files,
or secret values.
