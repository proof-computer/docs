---
sidebar_position: 1
title: Switchboard
description: User documentation map for Switchboard.
---

# Switchboard

Switchboard gives a supported long-running Acurast web job a stable public
HTTPS endpoint.

Use it when your job already serves HTTP and you want PROOF to coordinate the
public route, job-owned TLS, Hub quote funding, and route validation. The job
still runs on Acurast, keeps its TLS private key, and serves the health and
challenge endpoints Switchboard checks.

## What You Can Do

- Launch the bundled Switchboard Express demo and get a public proof page.
- Deploy a supported Node.js webserver project from `switchboard.json`.
- Use job-owned TLS for canonical Switchboard hostnames.
- Attach customer hostnames with DNS validation and certificate authorization.
- Read deployment status, local workflow state, logs, and recovery hints.
- Inspect claimable rewards, refundable sessions, validator script pins, and
  signed service catalogs.
- Prepare a gateway host when PROOF has admitted you to run one.

## Documentation Map

- [Quickstart](./quickstart/): install the CLI, configure a context, run
  preflight, launch the demo, and deploy a project.
- [Guides](./guides/): customer domains, Cargo SSH jobs, and task-oriented
  workflows after the first deploy.
- [Concepts](./concepts/): trust model, deployment lifecycle, Hub funding,
  gateway routing, job-owned TLS, and validation.
- [SDK & Adapters](./sdk-adapters/): Express, Fastify, core runtime helpers,
  and deploy workflow primitives.
- [Gateway Operators](./operator-preview/): gateway host setup, discovery,
  status, and upgrade flows for admitted gateway operators.
- [Reference](./reference/): CLI, config, environment, relay API, manifest,
  catalog surfaces, and ingress session flow diagrams.
- [Troubleshooting](./troubleshooting/): diagnosis paths for deploy, funding,
  DNS, ACME, route, and recovery failures.

## What Switchboard Supports

Switchboard currently supports long-running Node.js webserver jobs on
Acurast. Your app should serve:

- `GET /` for application traffic.
- `GET /health` for runtime health.
- `GET /.well-known/proofcomputer/challenge?nonce=<value>` for validation.

Switchboard does not yet support arbitrary hosting, arbitrary runtimes,
self-serve gateway selection, delegated gateway DNS zones, or
gateway-terminated application TLS.

## Install The PROOF CLI

```fish
npm install --global @proof-computer/proof-cli
proof plugins install @proof-computer/proof-cli-switchboard
proof switchboard --help
```
