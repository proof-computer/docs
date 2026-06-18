---
title: Runtime, Workflows & Adapters
description: Runtime package and adapter documentation map.
---

# Runtime, Workflows & Adapters

Baran apps can use framework adapters or the lower-level runtime package.
Host-side tooling can use workflow packages.

Most webserver jobs should start with an adapter. Use the runtime package
directly when you need lower-level job-side control. Use workflows only from
trusted host/orchestrator code.

## Packages

Public packages use the `@proof-computer` npm scope:

- `@proof-computer/baran-runtime`
- `@proof-computer/baran-workflows`
- `@proof-computer/baran-express`
- `@proof-computer/baran-fastify`
- `@proof-computer/baran-express-demo`
- `@proof-computer/proof-cli`
- `@proof-computer/proof-cli-baran`

## Choose A Surface

Use [Express Adapter](./express.md) when your app already uses Express or you
want the simplest supported Node.js example.

Use [Fastify Adapter](./fastify.md) when your app already uses Fastify or owns
its Fastify lifecycle.

Use [SDK Workflows](./sdk-workflows.md) when you are building a non-CLI
host-side caller that needs typed control-plane calls, funding action
planning, or resumable deploy workflow primitives.

## Runtime Boundary

Adapters should stay thin:

- mount Baran health, status, and challenge endpoints
- wire framework request and response objects
- start the server with deploy-time runtime config
- leave Acurast deployment, Hub funding, and local signing to the CLI or a
  caller-provided workflow adapter

Do not bundle developer-machine secrets into the application. Runtime values
delivered to the job should be the minimum needed for registration,
certificate requests, health, status, and challenge responses.
