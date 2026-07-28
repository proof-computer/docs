---
title: Logs and diagnostics
description: Resolve missing application logs, logging degradation, scoped reads, and signed runtime failures.
---

# Logs and diagnostics

## No application logs

Check in order:

1. effective policy has `observability.logs.enabled: true`;
2. the workload calls `runtime.log()`;
3. you selected the correct Application, deployment, job, runtime instance, and
   time range;
4. runtime logging capability is `ready` or explains its degraded state; and
5. a one-shot process awaits `runtime.flush()` before `runtime.stop()`.

Early records can be buffered while logging configuration arrives. A process
that exits before any successful flush may leave no remotely visible record.

## Application looks ready but a business event is absent

Runtime readiness covers required SDK capabilities, not the success of every
application operation. Check the workload's schedule/tick, external API, and
its own bounded error handling. For Uptime Prober, the first screenshot can
follow the five-minute tick after readiness.

## Signed fatal diagnostic appears

A fatal event means the bound runtime reported a terminal application error.
Match its runtime-instance ID and timestamp to chain evidence and logs. Do not
assume the process was never restarted or that Acurast has already reported the
same outcome.

## Evidence disagrees

When signed runtime and Acurast execution evidence disagree, Liskov shows an
in-progress review posture. Preserve both sources. Do not change one to match
the other or retry until the Action Plan offers a supported action.

## Sensitive record

If a log contains a credential:

1. stop copying or exporting it;
2. revoke the credential at its provider;
3. rotate the managed secret;
4. release a successor and verify it; and
5. contact support with identifiers, not the secret.

Encryption protects transport/storage boundaries; authorized readers can still
see decrypted application log content.
