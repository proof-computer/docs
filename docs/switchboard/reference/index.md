---
title: Reference
description: Switchboard reference documentation map.
---

# Reference

Reference pages are terse by design. Use them to check command names, file
locations, config precedence, and API boundaries.

## Pages

- [CLI Reference](./cli.md): public commands, advanced commands, mutating
  surfaces, and read-only diagnostics.
- [Config Reference](./config.md): project config, contexts, secret files,
  runtime env, and override precedence.
- [Relay API](./relay-api.md): manifest discovery, deployment intents,
  observability, hostname status, catalogs, and HTTPS requirements.

## Version Notes

Current public CLI packages:

- `@proof-computer/switchboard-cli@0.2.0`
- `@proof-computer/proof-cli-switchboard@0.2.0`

Current runtime packages in the public repos:

- `@proofcomputer/switchboard-sdk@0.1.3`
- `@proofcomputer/switchboard-express@0.1.1`
- `@proofcomputer/switchboard-fastify@0.1.2`
- `@proofcomputer/switchboard-express-demo@0.1.8`

During private beta, package publication channels may differ between CLI and
runtime packages. Treat installed package help and release notes as the final
source for the exact version on your machine.
