---
title: Logging and diagnostics
description: Emit encrypted application logs, read scoped records, and distinguish them from signed runtime evidence.
---

# Logging and diagnostics

Liskov has two complementary signals:

- **application logs** are messages your code chooses to emit; and
- **runtime diagnostics** are bounded, signed evidence about bootstrap,
  capability readiness, health, and terminal failure.

Neither should contain a secret.

## Enable logging

```json
{
  "observability": {
    "logs": { "enabled": true },
    "runtimeDiagnostics": { "signed": true }
  }
}
```

Signed diagnostics are a non-weakenable runtime requirement. Logging is
optional and disabled by default unless policy enables it.

`enabled` is the only logging field needed for new manifests. Liskov provisions
the encrypted logging path automatically; authors do not choose a profile,
sink, or logging context.

## Emit useful records

```ts
await runtime.log("probe.complete", {
  host: "example.com",
  status: 200,
  latencyMs: 184
}, {
  severity: "info",
  labels: { component: "prober" }
});
```

Use stable event names and small structured fields. Log a credential's
presence or version, never its value. Records are encrypted in the job before
upload. The SDK can buffer early records while logging configuration becomes
available; call `flush()` during a planned one-shot exit.

## Read the right signal

Use **Logs** for application behavior and **Activity** or the deployment
timeline for lifecycle facts. A missing application log is not proof that the
processor was never assigned. A runtime-ready diagnostic is not proof that a
particular business operation succeeded.

For a terminal application error, use the SDK's fatal diagnostic boundary once
and exit non-zero. Repeating fatal reports or swallowing the error makes the
timeline harder to understand.

## Verify

After deployment, emit a harmless known event. Confirm it appears under the
intended organization, Application, deployment, job, and runtime instance;
then compare the signed readiness event in the timeline. Redact log payloads
before sharing support evidence.

Read the same records from the CLI when needed:

```bash
proof liskov application logs APPLICATION_UID --limit 50

# Stream new records live while you verify.
proof liskov application logs APPLICATION_UID --follow

# Page through the full retained history oldest-first.
proof liskov application logs APPLICATION_UID --from-start
```

See [Monitor logs and activity](../operate/logs-activity.md) and
[Logs and diagnostics troubleshooting](../troubleshooting/logs.md).
