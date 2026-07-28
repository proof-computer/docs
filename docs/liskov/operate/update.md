---
title: Update an Application
description: Release new artifact, policy, or managed configuration through an explicit successor without mutating running Acurast jobs.
---

# Update an Application

An update changes desired state. Liskov preserves the old immutable policy and
job evidence, then creates a successor according to the new policy's update
timing.

## Repository release

1. Change and test source, Manifest V4, or both.
2. Commit to an allowed ref and let the approved workflow build and attest.
3. Verify the new commit, CID, digest, manifest digests, and artifact-version
   ID.
4. Import the new manifest draft.
5. Run publication preflight with the exact new artifact version.
6. Review the policy diff, spend bounds, and diagnostics.
7. Publish with explicit confirmation.

Use [Validate, import, and publish](../build/validate-import-publish.md) for the
commands. Do not publish an artifact from one commit against a manifest draft
from another.

## Managed configuration change

Change a variable or secret in the Console, then use the supported update flow
when the new value must reach runtime. A saved value is not injected into an
already-running process. Keep old external credentials usable until the
successor is ready if your rotation plan requires continuity.

## What happens to existing jobs

With `timing: immediate`, Liskov starts successor work promptly. With
`next_scheduled_renewal`, it waits for the next renewal boundary. The supported
v1 predecessor behavior is `run_until_scheduled_end`: old Acurast jobs continue
until their chain-owned end. This can produce overlap; use idempotency and
external coordination where duplicate work matters.

## Verify

Compare old and new:

- effective policy version and digest;
- artifact version, CID, digest, and provenance;
- deployment and job IDs;
- scheduled bounds and actual overlap/gap; and
- runtime-instance readiness and application output.

Do not call the update complete merely because publication succeeded. Complete
verification at the new runtime instance, then revoke superseded external
credentials or remove obsolete configuration.
