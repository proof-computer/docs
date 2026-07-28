---
title: Repository and workload requirements
description: Prepare a Node.js background workload that Liskov can build, start, and observe on Acurast.
---

# Repository and workload requirements

The first public repository path is a Node.js background process packaged as
one Acurast script bundle. It starts without an inbound server, uses the Liskov
runtime SDK, and makes only the outbound requests allowed by its policy.

## Supported starting point

Use Node.js 22 or later and pnpm 10. Keep a lockfile in the directory passed to
the reusable workflow. These scripts must succeed without prompts:

```json title="package.json (excerpt)"
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "tsup src/index.ts --format cjs --out-dir dist --out-extension .js=.cjs"
  }
}
```

Your build must produce `dist/app.cjs`, or you must set the workflow's
`entrypoint` input to the actual filename. Bundle application dependencies;
the processor does not run `pnpm install`.

## Repository layout

```text
.
├── .github/workflows/liskov.yml
├── .liskov/application-manifest.json
├── pnpm-lock.yaml
├── package.json
├── src/index.ts
└── dist/app.cjs                 generated, not hand-edited
```

The manifest's GitHub builder must name the same repository, allowed ref,
workflow, and manifest path. A mismatch correctly prevents attestation or
publication.

## Process contract

Your entrypoint should:

1. bootstrap `@proof-computer/liskov-runtime` before application work;
2. read configuration through `runtime.env` after bootstrap;
3. call `runtime.whenReady()` before claiming the workload is ready;
4. report useful, non-secret events through `runtime.log()`; and
5. flush and stop the SDK during a planned exit.

See [Use the Liskov runtime SDK](./runtime-sdk.md) for a complete entrypoint.

An Acurast job is time-boxed and its local disk is ephemeral. Store durable
state in an external system you control, and make repeat work safe: a restart
or successor may repeat the last operation. Do not use the processor's identity
as a permanent hostname or database identity.

## Networking and serving

The v1 repository path supports outbound networking. Declare the `network`
module when your workload calls an external API, and size its request quota.
Liskov does not provide hosted HTTP or SSH ingress for an arbitrary workload.
If a curated offering uses Acurast Tunnel, that boundary is documented by the
offering rather than inherited by every Application.

## Verify locally

From the workflow working directory, run exactly what CI will run:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
test -f dist/app.cjs
```

Then validate the manifest separately:

```bash
proof liskov application manifest validate \
  --file .liskov/application-manifest.json
```

A successful local build proves that the repository is packageable. It does
not pin an artifact, attest GitHub provenance, publish a policy, or deploy.

Next, [author Manifest V4](./manifest-v4.md) and
[add the reusable workflow](./github-actions.md).
