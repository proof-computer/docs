---
sidebar_position: 1
title: Switchboard
description: User documentation map for Switchboard.
---

# Switchboard

Switchboard provides production HTTPS ingress for supported long-running
Acurast Node.js jobs.

The v1 documentation should stay focused on the supported private-beta path:
install the CLI, configure local identities, launch a demo or deploy a
webserver job, inspect status, and diagnose DNS, certificate, route, funding,
or validation failures.

## Documentation Map

- **Quickstart**: install, configure, preflight, deploy, and status.
- **Guides**: common tasks such as customer domains and Cargo SSH jobs.
- **Concepts**: trust model, lifecycle, settlement, validation, DNS, and TLS.
- **SDK & Adapters**: runtime helpers, Express, Fastify, and workflow APIs.
- **Operator Preview**: gateway-oriented material for early operators.
- **Reference**: CLI, config, relay API, challenge endpoint, and env fields.
- **Troubleshooting**: diagnosis paths for deployment and DNS/ACME failures.

## Product Boundary

Switchboard is not generic hosting and not a generic reverse proxy. It is an
operator-backed ingress layer for supported Acurast deployments where TLS
terminates inside the job, quote funding lands on Polkadot Hub, and route-open
evidence is validated before activation and settlement.
