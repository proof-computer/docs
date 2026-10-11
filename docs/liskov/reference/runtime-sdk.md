---
title: Runtime SDK
description: Public @proof-computer/liskov-runtime bootstrap handle, capability states, options, and environment behavior.
---

# Runtime SDK

Supported package:

```text
@proof-computer/liskov-runtime
github:proof-computer/liskov-runtime-js#v0.3.38
```

The main export keeps the compatibility name `bootstrapSlipwayRuntime`.
`bootstrapLiskovRuntime` is an alias in this release. Use the documented
high-level handle rather than low-level protocol modules.
Use `v0.3.38`. It includes the V5 JavaScript signed runtime-env fallback and
current secret installation. Releases before `v0.3.28` cannot bootstrap against
the current platform and are not supported. `v0.3.34` is the first release
that decrypts a secret grant on a processor with a secp256k1 encryption key
(see [Processor key kinds](../configure/secrets.md#processor-key-kinds)).

## Minimal call

```ts
const runtime = await bootstrapSlipwayRuntime({
  component: "worker",
  revision: "release-2026-07-28"
});
```

## Handle

| Member | Contract |
| --- | --- |
| `home` | Resolved SDK state directory. |
| `env.get(name)` | Return a final runtime value or `undefined`. |
| `env.require(name)` | Return a final runtime value or throw when absent. |
| `context` | Read-only cached `LiskovRuntimeContext` or `undefined` when no valid context was supplied. Release-gated v1. |
| `refreshRuntimeContext()` | One explicit signed request returning `Promise<LiskovRuntimeContext>`; replace the cache on success only. Release-gated v1. |
| `status()` | Return current identity, blockers, and capability states. |
| `whenReady()` | Resolve immediately when required capabilities are ready; otherwise throw `SlipwayRuntimeNotReadyError`. |
| `log(event, details?, options?)` | Emit a structured Liskov log record. |
| `flush()` | Bounded log flush returning counts and state. |
| `refreshNow()` | Refresh runtime env, make one eligible background-secret attempt, then refresh logging. |
| `diagnostics.report(...)` | Send an ordinary bounded signed diagnostic. |
| `diagnostics.fatal(...)` | First-call-wins terminal boundary; close health/logging and make one bounded signed attempt. |
| `stop()` | Synchronously and idempotently stop SDK timers/retries. |

`stop()` does not stop the Acurast job.

## Job runtime context

Release-gated v1: SDK `v0.3.38` exports this API, but public availability waits
for the diagnostic readback. See [Capabilities and limits](./capabilities.md).

`LiskovRuntimeContext` is a read-only snapshot from signed bootstrap or an
explicit refresh. All fields below are present in a valid snapshot. `null`
means that fact was not available, not an empty string or zero; the SDK
preserves legitimate empty strings and zero timestamps. `runtime.context`
itself is `undefined` if bootstrap omitted context or supplied an invalid
optional block. All `*Ms` timestamps are milliseconds since the Unix epoch.

| Field | Type | Meaning / null semantics |
| --- | --- | --- |
| `schema` | `"proof.liskov.runtime-context.v1"` | Context schema identifier. |
| `serverTimeMs` | `number` | Server time when this snapshot was built. |
| `application.uid` | `string` | Stable Application key (`app-…`); use this for durable logic. |
| `application.name` | `string` | Slug label; may change. |
| `application.displayName` | `string \| null` | Display label; `null` when not available. May change. |
| `deployment.liskovDeploymentId` | `string` | Bound Liskov deployment identity. |
| `deployment.acurastDeploymentId` | `string \| null` | Acurast deployment identity; `null` when not recorded on the binding. |
| `job.id` | `string` | This job's identity. |
| `job.scheduleEndsAtMs` | `number \| null` | Scheduled end; `null` when not recorded. |
| `processor.id` | `string` | Processor running this job. |
| `policy.digest` | `string` | Bound policy digest. |
| `policy.versionId` | `string \| null` | Bound policy version; `null` when not available. |
| `artifact.cid` | `string \| null` | Artifact CID from the policy; `null` when absent there. |
| `artifact.digest` | `string \| null` | Artifact digest from the policy; `null` when absent there. |
| `capabilities.runtimeEnv` | `boolean` | Whether this launch uses managed runtime configuration. |
| `capabilities.secrets` | `boolean` | Whether this launch declares secrets. |
| `capabilities.logging` | `boolean` | Whether logging is enabled in the bound policy. |
| `capabilities.ingress` | `boolean` | Currently `false`; no public ingress capability is supplied by bootstrap. |
| `network.observedWanIp` | `string \| null` | Public IP observed on this job's request; `null` when no IP was observed. |
| `network.observedAtMs` | `number \| null` | IP observation time; `null` when no IP was observed. |
| `network.geolocation.status` | `"ready" \| "pending" \| "stale" \| "disabled" \| "unavailable" \| "not_observed"` | Whether the approximate place may be treated as current. |
| `network.geolocation.countryCode` | `string \| null` | Approximate country code; `null` when unavailable. |
| `network.geolocation.countryName` | `string \| null` | Approximate country name; `null` when unavailable. |
| `network.geolocation.region` | `string \| null` | Approximate region; `null` when unavailable. |
| `network.geolocation.city` | `string \| null` | Approximate city; `null` when unavailable. |
| `network.geolocation.asOfMs` | `number \| null` | Geography resolution time; `null` when not recorded. |
| `network.geolocation.accuracy` | `"ip-derived"` | Geography is derived from the observed IP. |

Only `ready` means current geography for the observed IP. Even then, some
place fields can be `null`. `pending` can retain geography for an older IP;
`stale` can retain an expired observation. Neither is current. `disabled`
means the provider is switched off, `unavailable` means the observation could
not be read, and `not_observed` means no WAN IP was seen on this request.
These states do not fail bootstrap or managed configuration delivery.

The capability flags describe launch facts, not current readiness or new
permissions. The snapshot is introspection, not a portable attestation.
See [Read what Liskov knows about this job](../build/runtime-sdk.md#read-what-liskov-knows-about-this-job)
for the identity and IP caveats.

### Runtime context refresh errors

`await runtime.refreshRuntimeContext()` sends one signed
`POST /api/jobs/runtime-context` using the bootstrap job and processor binding.
Each call signs a fresh nonce. There is no automatic retry, backoff, logging or
polling for runtime context. A success updates `runtime.context`; a failure
leaves the previous snapshot intact. `refreshNow()` refreshes configuration,
secrets and logging, not runtime context.

A refused HTTP response throws `LiskovRuntimeContextRefusedError` with
`code: string`, `status: number` (the HTTP status) and `retryable: boolean`.
The SDK marks only HTTP 429 and 503 retryable; it still performs no retry.
Common refusal codes are:

| Code | HTTP status | Customer action |
| --- | --- | --- |
| `runtime_context_request_invalid` | `400` | Check the pinned SDK and signed bootstrap path; do not handcraft the request. |
| `runtime_context_job_unbound` | `409` | Verify the job still has its bootstrap binding; keep optional introspection disabled if it does not. |
| `runtime_context_expiry_invalid` | `400` | Check the job clock and SDK version; do not resend the same request. |
| `runtime_context_request_stale` | `403` | Check the job clock; a later explicit call creates a fresh request. |
| `runtime_context_signature_invalid` | `403` | Check signed bootstrap and the job identity; do not substitute another identity. |
| `runtime_context_nonce_replayed` | `409` | The nonce was already used; never retry that signed request. |
| `runtime_context_rate_limited` | `429` | Wait before making a new explicit call. |
| `runtime_context_store_unavailable` | `503` | Keep the last snapshot and try a new explicit call later if needed. |
| `runtime_context_request_refused` | Response status | Fallback when no recognized runtime-context code is returned; inspect the HTTP status. |

Without a signed bootstrap binding, refresh throws
`SlipwayRuntimeNotReadyError`. Malformed JSON, an invalid context schema or
mismatched response bindings throw an ordinary `Error`; do not use the
rejected response as a snapshot. If absence or refusal prevents your job from
running, handle it explicitly in application code rather than polling.

## Capability states

`runtimeEnv`, `secrets`, `logging`, `diagnostics`, and the optional ingress
adapter use:

| State | Meaning |
| --- | --- |
| `off` | Intentionally disabled. |
| `pending` | Work has not reached a conclusion. |
| `ready` | Current capability is usable. |
| `degraded` | Partially available; inspect code/message. |
| `failed` | Attempt failed. |
| `blocked` | Prerequisite or trust condition prevents progress. |

Each capability also states whether it is required. `status.ready` is true only
when all required capabilities are ready.

## Common bootstrap options

| Option | Values/default |
| --- | --- |
| `appId`, `component`, `revision` | Optional diagnostic/log metadata. The SDK never derives Application UID from the slug. |
| `home` | Explicit state root; otherwise compatibility env, user home, then `/tmp/slipway`. |
| `secrets.mode` | `required`, `background`, or `off`; required when signed bootstrap says secrets are required. |
| `secrets.retry` | Defaults: initial 0 ms, interval 5,000 ms, max elapsed 60,000 ms, max attempts 12. |
| `logging.mode` | `background` by default; also `required` or `off`. |
| `logging.earlyBufferMaxRecords` | Default 100 in-memory early records. |
| `logging.spoolMode` | `auto`, `disk`, or `memory`. |
| `runtimeHealth` | Optional interval, initial delay, and send-timeout overrides. |
| `diagnostics` | Local callback for redacted SDK events. |

Transport, clock, environment, identity, randomness, and timer injection
options are test hooks; production code normally leaves them unset.

## Lookup and bootstrap order

Initial values are read from process environment, then Acurast `_STD_.env`,
then Acurast `environment(name)`. Signed Liskov bootstrap is authoritative for
the current job, installs runtime-env values, obtains required secret grants,
and then attaches logging. Application code should read through `runtime.env`
only after bootstrap.

Reserved compact environment values are compatibility wire contracts supplied
by Liskov. Customers should not create, expose, or copy them manually.

## Logging types

Severity is `debug`, `info`, `warn`, or `error`. Labels are string pairs.
`flush()` returns `{ok, state, flushed, pending, dropped, message?}`.
Application log details must be JSON-safe and non-secret.

See [Use the Liskov runtime SDK](../build/runtime-sdk.md) for a guided
entrypoint.
