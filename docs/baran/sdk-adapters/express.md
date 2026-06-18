---
title: Express Adapter
description: Add Baran endpoints to an Express app.
---

# Express Adapter

Use `@proof-computer/baran-express` for Express apps deployed through
Baran.

## Install

```fish
npm install @proof-computer/baran-express express
npm install --save-dev typescript tsx @types/node @types/express
```

## Minimal App

```ts
import express from "express";
import {serveBaranExpress} from "@proof-computer/baran-express";

const app = express();

app.get("/", (_request, response) => {
  response.type("html").send("<h1>Baran Express</h1><p>ok</p>");
});

void serveBaranExpress(app).catch((error) => {
  console.error(error);
  process.exit(1);
});
```

The adapter mounts Baran health, status, and challenge endpoints and
starts the server with the runtime config supplied at deploy time.

## What The Adapter Provides

- `GET /health`
- `GET /status`
- `GET /.well-known/proofcomputer/challenge?nonce=<value>`
- runtime TLS setup when deploy-time config enables job-owned TLS
- registration and certificate helper wiring through the runtime package

## Local Development

Run your app locally with certificate automation disabled or with local test
values. Do not use production Acurast, payment, DNS, or PROOF secrets for a
local-only Express preview.

For the packaged demo app, use `proof baran launch-demo` rather than copying
demo renderer code into your project.
