---
title: Use the Liskov runtime SDK
description: Bootstrap a job, read managed configuration, report readiness, log safely, and stop cleanly.
---

# Use the Liskov runtime SDK

`@proof-computer/liskov-runtime` is the job-side SDK. It joins the process to
the correct Liskov Application, policy, deployment, job, processor, and runtime
instance; loads managed values and secrets; and provides logging and signed
diagnostics. It is not a deployment or payment client.

The supported v1 release is `v0.3.26`:

```json title="package.json (excerpt)"
{
  "dependencies": {
    "@proof-computer/liskov-runtime": "github:proof-computer/liskov-runtime-js#v0.3.26"
  }
}
```

## Bootstrap before application code

```ts title="src/index.ts"
import { bootstrapSlipwayRuntime } from "@proof-computer/liskov-runtime";

const runtime = await bootstrapSlipwayRuntime({
  component: "worker",
  revision: process.env.APP_REVISION,
  secrets: { mode: "required" },
  logging: { mode: "background" }
});

try {
  await runtime.whenReady();

  const endpoint = runtime.env.require("API_ENDPOINT");
  const apiToken = runtime.env.require("API_TOKEN");

  await runtime.log("worker.ready", { endpoint });
  await runWorker({ endpoint, apiToken });
} catch (error) {
  await runtime.diagnostics.fatal({
    kind: "explicit",
    code: "application_failed",
    component: "worker",
    error
  });
  throw error;
} finally {
  await runtime.flush();
  runtime.stop();
}
```

`whenReady()` is a fail-fast check, not a polling loop. It returns the current
status only when every required capability is ready; otherwise it throws with
the same blocker status. Let the process fail clearly when required secrets or
identity do not verify.

The exported function keeps its historical `Slipway` name for package
compatibility. New prose and application event names should say Liskov.

## Read configuration after bootstrap

Use `runtime.env.get(name)` for optional values and
`runtime.env.require(name)` for required values. Bootstrap may install newer
managed values and job-bound secrets, so avoid capturing `process.env` in a
module imported before bootstrap.

```ts
const mode = runtime.env.get("FEATURE_MODE") ?? "safe";
const databaseUrl = runtime.env.require("DATABASE_URL");
```

Do not log a secret, include it in a diagnostic, or return it in an error.

## Choose capability modes deliberately

| Mode | Effect |
| --- | --- |
| `required` | Bootstrap fails closed until the capability is valid and ready. Use for secrets your process cannot run without. |
| `background` | Bootstrap may return while the capability is pending or degraded. Logging defaults to this mode. |
| `off` | The process intentionally does not use the capability. |

Call `runtime.status()` to inspect `runtimeEnv`, `secrets`, `logging`, and
`diagnostics`. A capability has a state such as `ready`, `pending`, `degraded`,
`failed`, or `blocked`; `status.ready` considers whether that capability is
required.

## Log and stop

```ts
await runtime.log("batch.complete", { processed: 42 }, {
  severity: "info",
  labels: { component: "importer" }
});

const result = await runtime.flush();
runtime.stop();
```

Liskov logging encrypts records in the job before upload. `flush()` gives
buffered records a final bounded chance to leave; inspect its `ok`, `pending`,
and `dropped` values. `stop()` is synchronous and idempotent. It cancels SDK
refresh, health, and background-secret timers; it does not cancel the Acurast
job.

## Verify

Add a test with fake environment and network adapters, then run typecheck,
tests, and build. After deployment, verify **Runtime ready** and the current
runtime-instance ID in the timeline. A clean local test does not prove signed
bootstrap on a real processor.

For every public method and option, see the
[Runtime SDK reference](../reference/runtime-sdk.md). For configuration
problems, see [Variables, secrets, and runtime bootstrap](../troubleshooting/config-bootstrap.md).
