---
title: Use the Liskov runtime SDK
description: Bootstrap a job, read managed configuration, report readiness, log safely, and stop cleanly.
---

# Use the Liskov runtime SDK

`@proof-computer/liskov-runtime` is the job-side SDK. It joins the process to
the correct Liskov Application, policy, deployment, job, processor, and runtime
instance; loads managed values and secrets; and provides logging and signed
diagnostics. It is not a deployment or payment client.

The supported v1 release is `v0.3.38`:

```json title="package.json (excerpt)"
{
  "dependencies": {
    "@proof-computer/liskov-runtime": "github:proof-computer/liskov-runtime-js#v0.3.38"
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

## Read what Liskov knows about this job

:::caution Release-gated v1
The context API is included in SDK `v0.3.38`. Public availability waits for
the diagnostic readback; see [Capabilities and limits](../reference/capabilities.md).
Do not depend on it for a customer deployment yet.
:::

After signed bootstrap, `runtime.context` is a read-only cached snapshot about
this job. It can be `undefined` when bootstrap supplied no valid context. An
absent context does not mean the job has no identity.

```ts
const context = runtime.context;
if (context !== undefined) {
  const applicationKey = context.application.uid;
  const jobKey = context.job.id;
  const geo = context.network.geolocation;
  const currentCountry = geo.status === "ready" ? geo.countryCode : null;
  // Use these values in your own logic; do not log the whole context.
}
```

`application.uid` is the stable key; `application.name` and
`application.displayName` are labels that may change. Do not key durable logic
on a label. The snapshot also identifies the Liskov and Acurast deployments,
job, processor, bound policy digest/version and artifact CID/digest. The
`capabilities` flags describe runtime configuration, secrets, logging and
ingress for this launch; they do not replace `runtime.status()` readiness
checks or grant a capability. `ingress` is currently `false`.

`network.observedWanIp` is the public IP Liskov observed on the job's request.
The country, region and city are approximate and derived from that IP.
Geolocation is cached for seven days by default for an unchanged IP, and a
change of observed IP schedules a new background lookup. Check
`network.geolocation.status` and `asOfMs` before using the result:

| State | Meaning |
| --- | --- |
| `ready` | The recorded geography matches the observed IP and is current; individual place fields may still be `null`. |
| `pending` | Geography is not yet resolved for this IP; older values may remain, so do not treat them as current. |
| `stale` | Cached geography needs refreshing; any retained place values are not current. |
| `disabled` | The geography provider is switched off. |
| `unavailable` | Liskov could not read the geography observation. |
| `not_observed` | No WAN IP was observed for this request. |

VPNs, carrier NAT, mobile gateways and IPv6 privacy addresses can change or
obscure what the IP describes. This is introspection, not a portable
attestation: it is not GPS, residency evidence or a compliance proof. A missing
network or geography value does not fail bootstrap or configuration delivery.

When you need another snapshot, make one explicit request:

```ts
const refreshed = await runtime.refreshRuntimeContext();
// On success, runtime.context is now the same snapshot as refreshed.
```

Call it when you need it; the SDK never polls for runtime context and never
logs the context automatically. A replayed or too-frequent refresh is refused.
A refresh sends one signed `POST /api/jobs/runtime-context`, updates the cached
snapshot only on success, and does not redeploy, reserve or charge Service
Credits. It may record a changed WAN IP; unchanged observations are debounced.
It reads cached geography rather than calling a provider synchronously, so a
successful refresh does not guarantee a `ready` geography state.

To verify your code, typecheck against the pinned SDK and check the returned
job and Application keys and geography state. If context is absent, continue
without optional introspection or handle that absence explicitly. If refresh
is refused, keep the previous snapshot and inspect the
[refresh error](../reference/runtime-sdk.md#runtime-context-refresh-errors).
Do not loop on a replay refusal; after a rate limit, wait before making a new
explicit call. Next, use the [field reference](../reference/runtime-sdk.md#job-runtime-context)
to choose only the values your job needs.

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
