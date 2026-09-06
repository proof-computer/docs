---
title: Variables, secrets, and runtime bootstrap
description: Diagnose missing managed values, secret grants, identity mismatch, precedence, and runtime readiness without exposing plaintext.
---

# Variables, secrets, and runtime bootstrap

## Required variable is missing

1. Confirm the name exactly matches Manifest V5, including case.
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

## Native helper or file installation is incompatible

`runtime_bootstrap_customer_secrets_runtime_incompatible` means the pinned
native artifact predates customer-secret installation. Rebuild with
runtime-contact 0.10.40 or newer and publish a successor. Updating the
Application's active artifact does not replace the helper inside an existing job.
JavaScript absolute file destinations require SDK 0.3.32 or newer and the default
installer, or an atomic custom `installGroup` writer.

For `runtime_secrets_file_installation`, check the declared absolute path,
parent-directory access, free space, and whether a path component is a symlink.
Do not print the decrypted file. Required failures prevent customer startup;
disabling logging does not bypass secret requirements.

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
