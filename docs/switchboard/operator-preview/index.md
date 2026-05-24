---
title: Gateway Operators
description: Gateway host setup and operations.
---

# Gateway Operators

Acurast processor providers can run a Switchboard gateway next to their
processors. The gateway gives those processors public HTTPS ingress for
Switchboard workloads, while application TLS still terminates inside the
Acurast job.

You can earn USDC when paid Switchboard routes use your gateway and settle.
Earnings depend on admitted capacity, uptime, route health, validator evidence,
and demand for the processors you advertise.

The gateway itself does not run customer compute. Reused hardware is a good
fit: a spare mini PC, an old laptop, or a laptop with a broken screen can work
if it boots reliably, stays powered, runs Docker, and has stable network.

Use `gateway` commands:

```fish
proof switchboard gateway setup
proof switchboard gateway discover
proof switchboard gateway status
proof switchboard gateway upgrade
```

## What A Gateway Host Runs

The public gateway image contains:

- `gateway-agent`: manages route state, renders Envoy filesystem xDS, and
  submits signed gateway capability reports.
- `hub-watcher`: watches Hub registry events and posts route intents for local
  and recovery flows.

Gateway hosts should use upstream Envoy, VictoriaMetrics, and Grafana images
with mounted config instead of PROOF-republished support images.

## What You Need

- An Acurast manager with processors you want to make reachable through
  Switchboard.
- A host that can stay online near those processors and run Linux, Docker, and
  Docker Compose.
- A stable public address or hostname for gateway traffic, with firewall or NAT
  rules matching the admission bundle.
- Local disk for Docker images, Envoy config, gateway state, and logs.
- A payout address for USDC route earnings.

Do not use a machine that randomly sleeps, overheats, drops network, or loses
time. The best gateway host is modest and predictable.

## Admission Boundary

Gateway setup starts with an admission bundle from PROOF. An operator can
prepare host Docker/Compose config, generate a local report seed, write a
redacted admission request, and later apply the issued bundle.

Gateway operators do not receive:

- PROOF DNS zone write authority
- Cloudflare tokens
- ACME account keys
- Hub recorder keys
- PROOF relayer keys
- broad control-plane bearer tokens

## Earnings Readback

Gateway earnings are paid from Switchboard route sessions after the route is
validated and settlement records fulfillment. Read claimable rewards before
withdrawing:

```fish
proof switchboard claimable --recipient '<gateway payout address>'
proof switchboard claim --claim-private-key-env OPERATOR_CLAIM_PRIVATE_KEY --yes
```

Keep the payout private key off the gateway host when you can; claiming can be
done from a separate trusted machine.

If your gateway is connected to PROOF's Telegram alerting, `/earnings
[gateway-id]` is a read-only view of claimable, pending, and settled USDC.

## Where To Start

Read [Gateway Runtime](./gateway.md) for setup, discovery, status, and upgrade
commands.
