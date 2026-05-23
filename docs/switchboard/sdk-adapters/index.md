---
title: SDK & Adapters
description: Runtime package and adapter documentation map.
---

# SDK & Adapters

Switchboard apps can use framework adapters or the lower-level SDK.

Most webserver jobs should start with an adapter. Use the SDK directly when
you need lower-level runtime or workflow control.

## Packages

The current public runtime packages use the `@proofcomputer` npm scope and are
available through GitHub installs during private beta:

- `@proofcomputer/switchboard-sdk`
- `@proofcomputer/switchboard-express`
- `@proofcomputer/switchboard-fastify`
- `@proofcomputer/switchboard-express-demo`

The CLI packages use the `@proof-computer` scope:

- `@proof-computer/proof-cli`
- `@proof-computer/proof-cli-switchboard`
- `@proof-computer/switchboard-cli`

## Choose A Surface

Use [Express Adapter](./express.md) when your app already uses Express or you
want the simplest supported Node.js example.

Use [Fastify Adapter](./fastify.md) when your app already uses Fastify or owns
its Fastify lifecycle.

Use [SDK Workflows](./sdk-workflows.md) when you are building a non-CLI caller
that needs typed control-plane calls, funding action planning, or resumable
deploy workflow primitives.

## Runtime Boundary

Adapters should stay thin:

- mount Switchboard health, status, and challenge endpoints
- wire framework request and response objects
- start the server with deploy-time runtime config
- leave Acurast deployment, Hub funding, and local signing to the CLI or a
  caller-provided workflow adapter

Do not bundle developer-machine secrets into the application. Runtime values
delivered to the job should be the minimum needed for registration,
certificate requests, health, status, and challenge responses.
