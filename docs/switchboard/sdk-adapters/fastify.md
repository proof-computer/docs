---
title: Fastify Adapter
description: Add Switchboard endpoints to a Fastify app.
---

# Fastify Adapter

Use `@proofcomputer/switchboard-fastify` for Fastify apps deployed through
Switchboard.

## Install

Install from GitHub:

```fish
npm install github:proof-computer/switchboard-fastify#v0.1.2 fastify
npm install --save-dev typescript tsx @types/node
```

Use `#main` only when intentionally testing unreleased changes.

## Minimal App

```ts
import {serveSwitchboardFastify} from "@proofcomputer/switchboard-fastify";

void serveSwitchboardFastify(async (app) => {
  app.get("/", async (_request, reply) => {
    reply.type("text/html");
    return "<h1>Switchboard Fastify</h1><p>ok</p>";
  });
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
```

For apps that already own their Fastify lifecycle, register the plugin
directly with `switchboardFastify`.

## What The Adapter Provides

- health, status, and challenge endpoints
- runtime TLS setup when deploy-time config enables job-owned TLS
- framework-native request and reply wiring
- SDK-backed registration and certificate helpers

## Local Development

Keep local development separate from live deploy configuration. Do not commit
Acurast seeds, Polkadot payment seeds, EVM developer keys, DNS tokens, or
PROOF gateway admission material into a Fastify app repo.
