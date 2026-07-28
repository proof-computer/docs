---
title: Runtime SDK
description: Public @proof-computer/liskov-runtime v0.3.26 bootstrap handle, capability states, options, and environment behavior.
---

# Runtime SDK

Supported package:

```text
@proof-computer/liskov-runtime
github:proof-computer/liskov-runtime-js#v0.3.26
```

The main export keeps the compatibility name `bootstrapSlipwayRuntime`.
`bootstrapLiskovRuntime` is an alias in this release. Use the documented
high-level handle rather than low-level protocol modules.

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
| `status()` | Return current identity, blockers, and capability states. |
| `whenReady()` | Resolve immediately when required capabilities are ready; otherwise throw `SlipwayRuntimeNotReadyError`. |
| `log(event, details?, options?)` | Emit a structured Liskov log record. |
| `flush()` | Bounded log flush returning counts and state. |
| `refreshNow()` | Refresh runtime env, make one eligible background-secret attempt, then refresh logging. |
| `diagnostics.report(...)` | Send an ordinary bounded signed diagnostic. |
| `diagnostics.fatal(...)` | First-call-wins terminal boundary; close health/logging and make one bounded signed attempt. |
| `stop()` | Synchronously and idempotently stop SDK timers/retries. |

`stop()` does not stop the Acurast job.

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

Compact environment variables whose names retain `PROOF_SLIPWAY_*`,
`PROOF_LOCKBOX_*`, or `BLACKBOX_*` are compatibility wire contracts supplied
by Liskov. Customers should not create them manually.

## Logging types

Severity is `debug`, `info`, `warn`, or `error`. Labels are string pairs.
`flush()` returns `{ok, state, flushed, pending, dropped, message?}`.
Application log details must be JSON-safe and non-secret.

See [Use the Liskov runtime SDK](../build/runtime-sdk.md) for a guided
entrypoint.
