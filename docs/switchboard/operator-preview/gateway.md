---
title: Gateway Runtime
description: Gateway host setup and operations.
---

# Gateway Runtime

Gateway hosts provide L4/SNI route capacity for Switchboard. If you already
run Acurast processors, the gateway is how those processors become useful for
web workloads that need a public HTTPS endpoint.

The host does not need to be expensive. Use existing compute first: a spare
desktop, a small form-factor machine, an old laptop, or a laptop with a broken
screen is fine when it can stay online. Save the high-value hardware for
processor work; the gateway needs steady networking more than raw compute.
The gateway host does not need to be one of your Acurast processors.

## Requirements

Before setup, make sure you have:

- an Acurast manager address and manager ID
- processors under that manager that can accept Switchboard workloads
- a Linux host with Docker and Docker Compose
- a stable public address or hostname for gateway traffic
- firewall or router rules for the ports named in your admission bundle
- local storage for Docker images, Envoy config, gateway state, and logs
- a payout address for USDC route earnings

Put the gateway near the processors it advertises. It must be able to reach
their job ports reliably, and public clients must be able to reach the gateway
for HTTPS/SNI traffic.

Avoid machines that sleep when the lid closes, depend on Wi-Fi that drops
under load, lose clock sync, or need hands-on recovery after power loss.

## Earnings

Gateways can earn USDC from paid Switchboard routes. The configured payout
recipient accrues rewards after route validation and settlement. Uptime,
fresh capability reports, route health, and demand for your advertised
processors all matter.

Read earnings before withdrawing:

```fish
proof switchboard claimable --recipient '<gateway payout address>'
```

Withdraw only with the payout key and an explicit confirmation:

```fish
proof switchboard claim --claim-private-key-env OPERATOR_CLAIM_PRIVATE_KEY --yes
```

Keep the payout private key off the gateway host when you can; claiming can be
done from a separate trusted machine.

## Setup

Run setup on the host that will run the gateway stack:

```fish
proof switchboard gateway setup
```

To prepare an admission request:

```fish
proof switchboard gateway setup \
  --manager-address '<acurast manager address>' \
  --manager-id '<manager id>' \
  --generate-report-seed \
  --prepare-admission
```

This can write local Docker/Compose config, generate a local sr25519 report
seed, and produce a redacted admission request. The seed is stored only in the
gateway env file with restrictive permissions.

Apply the admission bundle from PROOF:

```fish
proof switchboard gateway setup --admission-file operator-admission.json --yes
```

## Discovery

Use discovery to check manager-scoped capacity and suggest gateway env values:

```fish
proof switchboard gateway discover --manager-id '<manager id>' --public-address '<ip-or-host>'
```

Useful options:

```fish
proof switchboard gateway discover --limit 20
proof switchboard gateway discover --smoke-hostname '<sni hostname>'
proof switchboard gateway discover --write-env .operator-host/operator.env
```

Discovery can check existing Acurast schedules by default. Use
`--skip-availability` only when you intentionally want to skip conflict
checks.

Discovery is useful before you ask for admission. It shows which processors
look reachable and which ones are already busy, stale, or schedule-conflicted.

## Status

```fish
proof switchboard gateway status
```

Status checks local Compose state, the gateway-agent API, and relay capability
registration when configured. It is the first command to run after a setup,
restart, admission change, or route-state issue.

## Upgrade

```fish
proof switchboard gateway upgrade --yes
```

Dry-run the Docker Compose commands first:

```fish
proof switchboard gateway upgrade --dry-run
```

Use `--keep-image-override` if the host intentionally uses old or custom image
environment overrides.

## Runtime Components

- Envoy handles the L4/SNI passthrough edge.
- `gateway-agent` polls route state, renders Envoy xDS, and reports capacity.
- `hub-watcher` watches Hub registry events for route intent support.

Application TLS stays with the Acurast job. The gateway routes traffic; it
does not terminate app TLS in the default Switchboard path.
