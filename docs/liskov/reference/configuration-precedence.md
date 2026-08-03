---
title: Configuration and environment precedence
description: Exact source ordering for variables, secrets, signed runtime values, Acurast environment, and compatibility identifiers.
---

# Configuration and environment precedence

Configuration has an authored declaration, an Application-managed value, a
deployment selection, and a final runtime installation. Keep those stages
separate.

## CLI organization selection

For a network-backed organization-scoped `proof liskov` command, organization
selection follows:

1. the command's existing positional selector, when supplied;
2. `--organization SELECTOR`;
3. `LISKOV_ORGANIZATION`; then
4. the persistent organization attached to the CLI session.

The first three are exact organization IDs or case-sensitive slugs. They are
invocation inputs, not Application configuration: they are not saved to the
session, copied into a manifest, or installed in a runtime environment.
`organization use [SELECTOR]` is the explicit exception because its purpose is
to replace the persistent session organization. Explicit billing and Runtime
SSH integration routes require a positional, flag, or environment selector.
`organization list` remains unscoped.

## Authored variables

For each manifest variable:

1. current Application-managed value, if set;
2. otherwise authored `default`, if present;
3. otherwise missing.

A missing required variable blocks affected work. An explicit empty string is a
value and must not be collapsed into missing.

## Managed secrets

The manifest names `secretId`, requiredness, and destination. It never holds
plaintext. The deployment selects a stored encrypted secret version and issues
a job-bound grant. Signed current-job installation is authoritative over stale
ambient values. File secrets are confined below the configured secret base
directory and written with restricted permissions.

## Runtime lookup

Before Liskov installation, the SDK looks for a named value in:

1. supplied `options.env` or `process.env`;
2. Acurast `_STD_.env`; then
3. Acurast `environment(name)`.

Signed runtime bootstrap then authenticates the current Application UID,
policy, deployment, job, processor, and runtime instance; installs managed
runtime-env values; obtains secrets; and attaches logging. Application code
must use `runtime.env` after bootstrap.

## Built-ins and reserved names

Liskov supplies reserved identity, bootstrap, secret, and logging values where
compatibility requires them. They are implementation-facing wire inputs, not
names for new customer variables. Do not declare, override, expose, or copy
reserved values between jobs.

New Liskov-owned environment contracts use `LISKOV_*`.
`LISKOV_ORGANIZATION` is a CLI invocation input, not a runtime contract.

## Change timing

A stored variable or secret version does not mutate a running process.
Publication/configuration update creates a successor according to lifecycle.
Runtime `refreshNow()` refreshes server-authorized runtime env and eligible
background capabilities; it is not a bypass for successor policy or secret
version selection.

## Safe inspection

Inspect names, presence, version/digest, source class, and final non-secret
behavior. Never print secret values to verify precedence. When a required value
is absent, record the exact name, Application UID, policy/deployment/job IDs,
and runtime capability code.
