---
title: SDK Workflows
description: Build trusted deploy tooling on Baran APIs.
---

# SDK Workflows

Baran exposes separate packages for job-side runtime helpers and
host-side deploy workflow primitives.

Most users should use `proof baran deploy`. Use SDK workflow APIs when you are
building another trusted shell that can provide its own Acurast, Hub funding,
confirmation, and persistence adapters.

## Install

```fish
npm install @proof-computer/baran-runtime @proof-computer/baran-workflows
```

Framework apps usually install an adapter instead of the runtime package
directly.

## Runtime API

```ts
import {createBaranRuntime} from "@proof-computer/baran-runtime";

const runtime = createBaranRuntime();

await runtime.prepare();
```

Runtime helpers are for code that runs inside the job. Do not put
developer-machine payment seeds or DNS tokens in the app bundle.

## Workflow API

```ts
import {BaranDeployWorkflow} from "@proof-computer/baran-workflows";
import {BaranControlPlaneClient} from "@proof-computer/baran-workflows/control-plane";
```

Use:

- `control-plane` for typed relay calls
- `funding` for quote resume and action planning
- `workflows` for the deploy state machine

The workflow core does not read seed environment variables, prompt for user
input, or own persistence. Callers provide adapters for:

- Acurast deployment
- Hub funding and signing
- confirmation/readback
- workflow snapshot persistence
- redacted reporting

## Trust Boundary

The CLI remains the normal interactive shell for local signing, plaintext
inputs, and progress output. A workflow caller that replaces the CLI must
preserve the same boundaries: keep secrets local, verify signed manifests and
quotes, and make mutating actions explicit.
