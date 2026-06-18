---
title: Fastify Adapter
description: Add Baran endpoints to a Fastify app.
---

# Fastify Adapter

Use `@proof-computer/baran-fastify` for Fastify apps deployed through
Baran.

## Install

```fish
npm install @proof-computer/baran-fastify fastify
npm install --save-dev typescript tsx @types/node
```

## Minimal App

```ts
import {serveBaranFastify} from "@proof-computer/baran-fastify";

void serveBaranFastify(async (app) => {
  app.get("/", async (_request, reply) => {
    reply.type("text/html");
    return "<h1>Baran Fastify</h1><p>ok</p>";
  });
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
```

For apps that already own their Fastify lifecycle, register the plugin
directly with `baranFastify`.

## What The Adapter Provides

- health, status, and challenge endpoints
- runtime TLS setup when deploy-time config enables job-owned TLS
- framework-native request and reply wiring
- runtime-backed registration and certificate helpers

## Local Development

Keep local development separate from live deploy configuration. Do not commit
Acurast seeds, Polkadot payment seeds, EVM developer keys, DNS tokens, or
PROOF gateway admission material into a Fastify app repo.
