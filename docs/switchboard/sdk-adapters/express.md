---
title: Express Adapter
description: Express adapter content target.
---

# Express Adapter

Use `@proofcomputer/switchboard-express` for Express apps deployed through
Switchboard.

## Install

During private beta, install from GitHub:

```fish
npm install github:proof-computer/switchboard-express#v0.1.1 express
npm install --save-dev typescript tsx @types/node @types/express
```

Use `#main` only when intentionally testing unreleased changes.

## Minimal App

```ts
import express from "express";
import {serveSwitchboardExpress} from "@proofcomputer/switchboard-express";

const app = express();

app.get("/", (_request, response) => {
  response.type("html").send("<h1>Switchboard Express</h1><p>ok</p>");
});

void serveSwitchboardExpress(app).catch((error) => {
  console.error(error);
  process.exit(1);
});
```

The adapter mounts Switchboard health, status, and challenge endpoints and
starts the server with the runtime config supplied at deploy time.

## What The Adapter Provides

- `GET /health`
- `GET /status`
- `GET /.well-known/proofcomputer/challenge?nonce=<value>`
- runtime TLS setup when deploy-time config enables job-owned TLS
- registration and certificate helper wiring through the SDK

## Local Development

Run your app locally with certificate automation disabled or with local test
values. Do not use production Acurast, payment, DNS, or PROOF secrets for a
local-only Express preview.

For the packaged demo app, use `switchboard launch-demo` rather than copying
demo renderer code into your project.
