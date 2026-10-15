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

For a continuous Manifest V5 Application, every publish takes effect now.
A new policy version, including one that changes only the artifact, starts
its successor at the next executor pass. An executor pass is the next time
Liskov checks the Application and starts work that is due. From that moment,
every job in the deployment starts at once on a fresh renewal grid. A renewal
grid is the repeating schedule of windows that an unchanged Application keeps.
With `evenly_spaced` phasing, a later phase's first window ends on its own
place in that grid, so the first window can be shorter than the duration you
wrote.

`immediate` is the default for `update.timing`, and it means now.
`next_renewal` is the explicit choice to wait. The successor then starts one
renewal lead before the running job's scheduled end. The renewal lead is how
long before that scheduled end Liskov starts the next job when you choose to
wait. The scheduled end is the end time registered for the current job's
window.

Only `update.existingJobs.mode` decides what happens to the old job.
`stop_when_successor_ready` is the default: the old job stops once the new
runtime is ready. `run_until_scheduled_end` lets the old job run until its
scheduled end. A job that has failed, or that Liskov has lost contact with,
is not waited for in either mode.

Overlap is paid. With `run_until_scheduled_end`, and until the new runtime is
ready under `stop_when_successor_ready`, the old job and its successor are
reserved at once. The overlap lasts no longer than the rest of the old job's
window. The Service Credit reserve for that shorter time is in proportion to
the time reserved, as for any window. Use idempotency and external
coordination where duplicate work matters.

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
