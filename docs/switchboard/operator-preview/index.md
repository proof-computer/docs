---
title: Operator Preview
description: Early operator documentation map.
---

# Operator Preview

Switchboard's first public launch is PROOF-operated, but the gateway runtime
has an early operator-facing surface.

The current user-facing topic is `gateway`, not `operator`:

```fish
switchboard gateway setup
switchboard gateway discover
switchboard gateway status
switchboard gateway upgrade
```

## What A Gateway Host Runs

The public gateway image contains:

- `gateway-agent`: manages route state, renders Envoy filesystem xDS, and
  submits signed gateway capability reports.
- `hub-watcher`: watches Hub registry events and posts internal route intents
  for local or recovery flows.

Gateway hosts should use upstream Envoy, VictoriaMetrics, and Grafana images
with mounted config instead of PROOF-republished support images.

## Admission Boundary

Gateway setup is a PROOF-assisted admission flow. An operator can prepare host
Docker/Compose config, generate a local report seed, write a redacted
admission request, and later apply a PROOF-issued admission bundle.

Gateway operators do not receive:

- PROOF DNS zone write authority
- Cloudflare tokens
- ACME account keys
- Hub recorder keys
- PROOF relayer keys
- broad control-plane bearer tokens

## Where To Start

Read [Gateway Runtime](./gateway.md) for setup, discovery, status, and upgrade
commands.
