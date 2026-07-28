---
title: Variables, secrets, and runtime bootstrap
description: Diagnose missing managed values, secret grants, identity mismatch, precedence, and runtime readiness without exposing plaintext.
---

# Variables, secrets, and runtime bootstrap

## Required variable is missing

1. Confirm the name exactly matches Manifest V4, including case.
2. Check whether a managed value is set for the intended Application.
3. Otherwise verify a non-secret manifest default exists.
4. Publish/apply a successor according to update policy.

An empty string is an explicit value. A configuration save does not mutate a
running process.

## Required secret is missing

```bash
proof liskov application secrets APPLICATION_ID
```

Confirm the declared secret ID, requiredness, destination, and configured
version presence. The command never returns plaintext. Add/rotate the value in
Console, then create the required successor. Do not put it in a variable or
repository to bypass the blocker.

## Runtime rejects a secret grant

Record the non-secret error code and the Application UID, policy digest,
deployment ID, job ID, processor ID, and runtime-instance ID. Identity, policy,
job, expiry, destination, or version mismatch must fail closed. Never copy an
encrypted grant from another job or enable a downgrade.

## `whenReady()` throws

Inspect the attached runtime status and its `blockers`:

```ts
try {
  await runtime.whenReady();
} catch (error) {
  console.error(JSON.stringify(error.status));
  throw error;
}
```

Redact messages before sharing and make sure no application value was included.
`pending`, `failed`, and `blocked` are not ready. Background logging can be
degraded without blocking when policy/code chose that mode; required secrets
cannot.

## Stale or unexpected value

Read [Configuration precedence](../reference/configuration-precedence.md).
Confirm you are looking at the new runtime instance, not a predecessor still
running to scheduled end. Signed current-job bootstrap is authoritative; do not
manually set compatibility bootstrap variables.

## Verify safely

Test presence or a harmless authenticated operation. Log a secret ID/version
or boolean at most, never the value, token prefix, decrypted file, or full
credential-bearing URL.
