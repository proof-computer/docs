---
unlisted: true
title: Use retained V5 Managed Runtime SSH
description: Register operator keys, enable exact-job blind access, pin host trust, connect with one-time tickets, and revoke safely.
---

# Use retained V5 Managed Runtime SSH

:::danger[Not released]

The retained V5 policy path is implemented but production registration remains
V4-only. Follow the current [Runtime SSH Preview](./runtime-ssh.md) for a
production V4 Application. Use this page only to review the prepared V5 path.

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

## Revoke safely

Registry removal and live revocation are different operations.

```bash
proof liskov runtime-ssh operator-key remove KEY_ID --json
```

Removing a registry key affects **future attachment snapshots only**. It does
not rewrite an existing policy or attachment and does not terminate a live
session. The command's response repeats this non-revocation boundary.

For planned rotation:

1. add the replacement key and verify its fingerprint;
2. allow new attachments to snapshot the intended registry;
3. verify the replacement key with `--print-command`;
4. remove the old registry key; and
5. let old exact-job attachments reach teardown.

For urgent revocation of a current attachment, stop opening sessions and
contact support with the `attachmentId`, Application UID, deployment ID, job ID,
and host fingerprint from `--print-command --json`. There is no customer CLI
command that revokes a live managed attachment. Support must revoke that exact
attachment; revocation blocks new tickets, invalidates unused tickets, survives
a control-plane restart, and leaves workload health unchanged.

When the job ends or the attachment expires, automatic teardown revokes the
attachment and leaves no live unconsumed ticket. Access teardown never extends,
restarts, replaces, or marks the customer process unhealthy.

## Troubleshooting

| Symptom or code | Safe action |
| --- | --- |
| `runtime_ssh_operator_key_registry_empty` | Register at least one organization key, then wait for a new exact-job attachment. |
| `runtime_ssh_operator_key_registry_too_large` | Reduce the registry to at most eight intentional keys before creating a new attachment. |
| `RUNTIME_SSH_IDENTITY_NOT_AUTHORIZED` | Compare the selected fingerprint with the attachment snapshot; registry edits affect only new attachments. |
| `runtime_ssh_attachment_not_ready` | Confirm the selected job is running and use `--print-command`; an ended job cannot be reattached. |
| `runtime_ssh_attachment_ambiguous` | Select the exact deployment or job. |
| `runtime_ssh_plan_required` | Use an entitled organization; do not retry the same request. |
| `RUNTIME_SSH_HOST_KEY_MISMATCH` | Stop and compare signed evidence. Never override or delete the pin. |
| Session ends | Reconnect to obtain a fresh ticket if the attachment remains ready. |
| Access must stop now | Request exact attachment revocation through support; registry deletion alone is insufficient. |

Verify access and teardown in the Application activity feed. Share identifiers
and timestamps with support, never private keys, bearer tickets, session files,
or secret values.
