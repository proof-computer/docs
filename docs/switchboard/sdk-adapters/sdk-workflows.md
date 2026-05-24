---
title: SDK Workflows
description: Build trusted deploy tooling on Switchboard APIs.
---

# SDK Workflows

The SDK contains runtime helpers and deploy workflow primitives for callers
that are not the interactive CLI.

Most users should use `proof switchboard deploy`. Use SDK workflow APIs when you are
building another trusted shell that can provide its own Acurast, Hub funding,
confirmation, and persistence adapters.

## Install

```fish
npm install github:proof-computer/switchboard-sdk#v0.1.3
```

Framework apps usually install an adapter instead of the SDK directly.

## Runtime API

```ts
import {createSwitchboardRuntime} from "@proofcomputer/switchboard-sdk";

const runtime = createSwitchboardRuntime();

await runtime.prepare();
```

Runtime helpers are for code that runs inside the job. Do not put
developer-machine payment seeds or DNS tokens in the app bundle.

## Workflow API

```ts
import {SwitchboardControlPlaneClient} from "@proofcomputer/switchboard-sdk/control-plane";
import {SwitchboardDeployWorkflow} from "@proofcomputer/switchboard-sdk/workflows";
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
