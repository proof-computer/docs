---
title: Open a shell in a running job
description: Connect to one of your running Liskov jobs over SSH to inspect it live, using a key that never leaves your machine.
---

# Open a shell in a running job

Logs tell you what a job chose to print. Sometimes you need to look at the
running process itself — what is on disk, what the environment actually
contains, whether the thing you expected to be listening is listening.

Runtime SSH gives you a shell inside one of your own running jobs.

:::info Preview
Runtime SSH through the Liskov relay is available on Developer and above. It is
a Preview capability: the behaviour below is supported, but the relay that
carries managed sessions runs on a single machine. If that machine is lost or
restarted, every open session drops until it returns; reconnect when it does.
Your jobs keep running and are unaffected when that happens.

Interactive administration is included. Traffic through the relay counts
against your plan's included log volume, and bytes above it are charged to
your Service Credits at the plan's log overage rate. Your usage and remaining
allowance appear in Billing before any charge is made.

Connecting over your own Tailscale network instead of the relay is a separate
capability, available on Enterprise only — see
[Bring your own Tailscale network](#bring-your-own-tailscale-network).
:::

## Before you start

You need:

- a job that is currently running — check with
  `proof liskov application status APP_REF`;
- an SSH key pair you control. Liskov never sees the private half;
- the public half declared in your Application manifest; and
- `proof-cli-liskov` installed, signed in, with your organization selected.

If you do not have a key yet:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/liskov-runtime -C "liskov runtime ssh"
```

Keep the private file readable only by you. Liskov reads only the public half,
from your manifest.

## 1. Declare who may connect

Add the public key to your Application manifest and publish it. Access is bound
to the manifest, so changing who may connect is a publish, not a console
toggle.

```json
{
  "ingress": {
    "ssh": {
      "mode": "required",
      "provider": {
        "kind": "liskov",
        "authorizedKeys": [
          "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... liskov runtime ssh"
        ]
      }
    }
  }
}
```

`"kind": "liskov"` uses the Liskov-operated relay, which needs nothing from you
beyond the key. To use your own Tailscale network instead, see
[Bring your own Tailscale network](#bring-your-own-tailscale-network).

Publish as usual. The next job launched from this manifest accepts that key;
jobs already running were launched under the previous manifest and do not.

## 2. Check the connection before you use it

`--print-command` resolves and verifies everything without opening a session or
consuming an access ticket. Run it first — it is the cheapest way to confirm the
job is reachable.

```bash
proof liskov ssh APP_REF \
  --identity ~/.ssh/liskov-runtime \
  --print-command --json
```

You get the attachment, the deployment and job it is bound to, the host
fingerprint, your key fingerprint, and the verified digests of the helper and
SSH server Liskov placed in the runtime. No ticket is issued.

## 3. Connect

```bash
proof liskov ssh APP_REF --identity ~/.ssh/liskov-runtime
```

The first connection to a job shows its host key and asks you to confirm it.
Accept it once and it is pinned; a later mismatch is refused rather than
re-prompted, so **a second prompt for a job you have already trusted is a
warning, not a formality**. Add `--accept-host-key` to trust the first key
without prompting in scripts.

You get an ordinary interactive shell. Your customer process keeps running
alongside you.

Pick an exact target with `--deployment` or `--job` when an Application has more
than one running job.

## Verify it worked

Inside the session:

```bash
tty        # /dev/pts/0 — you have a real terminal
uname -m   # aarch64 — you are on the processor, not your laptop
```

Then, back on your machine, confirm the access was recorded:

```bash
proof liskov application activity APP_REF
```

Every connection appears in your activity feed — access granted, session opened,
and session closed with its duration and how much data moved. That record exists
so you can audit access to your own runtimes, including access by Liskov
support.

## What you can run in there

The runtime is a minimal Debian image plus your application. Core tools are
present: `ls`, `cat`, `grep`, `find`, `sed`, `awk`, `tar`, `ps`-less process
inspection through `/proc`, and `pidof`.

Some familiar tools are **not** installed, including `ps`, `top`, `curl`,
`wget`, and editors. To list processes:

```sh
for p in /proc/[0-9]*; do pid=${p#/proc/}; printf "%-6s %s\n" "$pid" \
  "$(tr '\0' ' ' < $p/cmdline 2>/dev/null | cut -c1-60)"; done
```

Do not install packages. The runtime's contents are digest-verified, and
installing at runtime breaks that guarantee for the rest of the job's life. If
you need a tool permanently, add it to your image and publish.

## Bring your own Tailscale network

Enterprise plan only, as a Preview. On any other plan, publishing a manifest
that names the Tailscale provider is refused with
`runtime_ssh_provider_plan_required`; the relay path above stays available.

If you already run Tailscale, you can have the job join your own tailnet
instead of using the Liskov relay. Traffic then goes directly between your
machine and the job over your network, and Liskov is not in the path, so
none of it counts against your log volume.

This needs a Tailscale integration on your organization first, then a manifest
that names it:

```json
{
  "ingress": {
    "ssh": {
      "mode": "required",
      "provider": { "kind": "tailscale", "integrationId": "int-...", "port": 22 }
    }
  }
}
```

An integration belongs to exactly one organization and cannot be used by
another.

## When something is wrong

**`runtime_ssh_attachment_not_ready`** — the job has not finished preparing SSH,
or it has already ended. Check it is still running with
`proof liskov application status APP_REF`. A job that reached its scheduled end
is gone; launch a new one.

**A host-key mismatch warning** — stop. The key pinned on your machine does not
match the job answering. Do not override it. Re-run with `--print-command
--json` and compare the fingerprint against the activity feed for that job.

**`runtime_ssh_plan_required`** — the Application's organization is on a plan
that does not include Runtime SSH.

**`runtime_ssh_provider_plan_required`** — the organization's plan includes
the Liskov relay but not the provider the manifest names. Today that means a
manifest with `"kind": "tailscale"` on a plan below Enterprise: switch the
provider to `"liskov"` and publish, or move to Enterprise.

**Your session ends by itself** — sessions have a maximum duration and an idle
heartbeat. Reconnecting is normal and safe; it issues a fresh one-time ticket.

## What this does not do

- It does not change your job's lifecycle. Connecting, disconnecting, or losing
  SSH does not restart, replace, or extend it.
- It does not give Liskov the ability to authenticate as you. Your private key
  never leaves your machine.
- It is not inbound ingress. It does not publish a port or serve traffic to
  anyone; see the capability matrix for hosted ingress, which is not part of v1.

## Next

- [Read logs and activity](./logs-activity.md) — including the record of every
  SSH session.
- [Capabilities and limits](../reference/capabilities.md) — the availability
  owner for this feature.
