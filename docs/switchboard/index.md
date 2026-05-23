---
sidebar_position: 1
title: Switchboard
description: User documentation map for Switchboard.
---

# Switchboard

Switchboard gives supported long-running Acurast jobs a stable public HTTPS
endpoint.

It is not generic hosting and not a generic reverse proxy. The private-beta
product is narrower: PROOF-operated ingress for Acurast webserver jobs where
the job keeps the TLS private key, payment is funded through a signed Polkadot
Hub quote, and route-open evidence is checked before activation and
settlement.

## What You Can Do Today

- Launch the bundled Switchboard Express demo and get a public proof page.
- Deploy a supported Node.js webserver project from `switchboard.json`.
- Use job-owned TLS for canonical Switchboard hostnames.
- Attach customer hostnames with DNS validation and certificate authorization.
- Read deployment status, local workflow state, logs, and recovery hints.
- Inspect claimable rewards, refundable sessions, validator script pins, and
  signed service catalogs.
- Prepare an early gateway host when PROOF has admitted the operator.

## Documentation Map

- [Quickstart](./quickstart/): install the CLI, configure a context, run
  preflight, launch the demo, and deploy a project.
- [Guides](./guides/): customer domains, Cargo SSH jobs, and task-oriented
  workflows after the first deploy.
- [Concepts](./concepts/): trust model, deployment lifecycle, Hub funding,
  gateway routing, job-owned TLS, and validation.
- [SDK & Adapters](./sdk-adapters/): Express, Fastify, core runtime helpers,
  and deploy workflow primitives.
- [Operator Preview](./operator-preview/): gateway host setup, discovery,
  status, and upgrade flows for early operators.
- [Reference](./reference/): CLI, config, environment, relay API, manifest,
  and catalog surfaces.
- [Troubleshooting](./troubleshooting/): diagnosis paths for deploy, funding,
  DNS, ACME, route, and recovery failures.

## Product Boundary

Supported v1 workloads are long-running Node.js webserver jobs on Acurast. The
normal app path serves:

- `GET /` for application traffic.
- `GET /health` for runtime health.
- `GET /.well-known/proofcomputer/challenge?nonce=<value>` for validation.

Not v1: arbitrary hosting, arbitrary runtimes, permissionless gateway
marketplaces, delegated operator DNS zones, or gateway-terminated application
TLS.

## Install Surface

Switchboard is available two ways:

```fish
npm install --global @proof-computer/proof-cli
proof plugins install @proof-computer/proof-cli-switchboard
proof switchboard --help
```

The standalone compatibility binary is also supported:

```fish
npm install --global @proof-computer/switchboard-cli
switchboard help
```

The examples in these docs use `switchboard` for readability. The same user
commands are available as `proof switchboard ...` through the PROOF CLI plugin.
