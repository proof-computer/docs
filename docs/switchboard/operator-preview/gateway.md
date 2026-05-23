---
title: Gateway Runtime
description: Gateway operator content target.
---

# Gateway Runtime

Gateway hosts provide L4/SNI route capacity for Switchboard.

## Setup

Run setup on the host that will run the gateway stack:

```fish
switchboard gateway setup
```

For a PROOF-assisted admission request:

```fish
switchboard gateway setup \
  --manager-address '<acurast manager address>' \
  --manager-id '<manager id>' \
  --generate-report-seed \
  --prepare-admission
```

This can write local Docker/Compose config, generate a local sr25519 report
seed, and produce a redacted admission request. The seed is stored only in the
operator env file with restrictive permissions.

Apply an admission bundle from PROOF:

```fish
switchboard gateway setup --admission-file operator-admission.json --yes
```

## Discovery

Use discovery to check manager-scoped capacity and suggest gateway env values:

```fish
switchboard gateway discover --manager-id '<manager id>' --public-address '<ip-or-host>'
```

Useful options:

```fish
switchboard gateway discover --limit 20
switchboard gateway discover --smoke-hostname '<sni hostname>'
switchboard gateway discover --write-env .operator-host/operator.env
```

Discovery can check existing Acurast schedules by default. Use
`--skip-availability` only when you intentionally want to skip conflict
checks.

## Status

```fish
switchboard gateway status
```

Status checks local Compose state, the gateway-agent API, and relay capability
registration when configured. It is the first command to run after a setup,
restart, admission change, or route-state issue.

## Upgrade

```fish
switchboard gateway upgrade --yes
```

Dry-run the Docker Compose commands first:

```fish
switchboard gateway upgrade --dry-run
```

Use `--keep-image-override` if the host intentionally uses old or custom image
environment overrides.

## Runtime Components

- Envoy handles the L4/SNI passthrough edge.
- `gateway-agent` polls route state, renders Envoy xDS, and reports capacity.
- `hub-watcher` watches Hub registry events for route intent support.

Application TLS stays with the Acurast job. The gateway routes traffic; it
does not terminate app TLS in the default Switchboard path.
