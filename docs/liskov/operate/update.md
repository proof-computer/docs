---
title: Update an Application
description: Release new artifact, policy, or managed configuration through an explicit successor without mutating running Acurast jobs.
---

# Update an Application

An update changes desired state. Liskov preserves the old immutable policy and
job evidence, then creates a successor according to the new policy's update
timing.

## Repository release

1. Change and test source, retained Manifest V5, or both; validate the document.
2. Commit to an allowed ref and let the approved workflow build and attest.
3. Verify the new commit, artifact digest, source ref, and workflow identity.
4. Read the Application's source binding, revision, revocation epoch, and
   current publication pointer version.
5. Run `application policy publish --dry-run` with the exact V5 document,
   attested artifact digest, source evidence, and expected pointer version.
6. Review the policy diff, spend bounds, and diagnostics.
7. Publish with the same evidence and `--yes` in place of `--dry-run`.

Use [Validate, import, and publish](../build/validate-import-publish.md) for the
commands and spend effects. Create the Application and set its source binding
before its first build; updates reuse the verified identity and binding. New
V4 imports and publications are refused. Do not publish an artifact from one
commit against a manifest from another.

## Managed configuration change

Change a variable or secret in the Console, then use the supported update flow
when the new value must reach runtime. A saved value is not injected into an
already-running process. Keep old external credentials usable until the
successor is ready if your rotation plan requires continuity.

## What happens to existing jobs

For a continuous Manifest V5 Application, the default `immediate` timing
allows a successor to start at the next executor pass, including when a new
policy version changes only the artifact. An executor pass is the next time
Liskov checks the Application and starts work that is due. Jobs in the new
deployment start together on a fresh renewal grid. A renewal grid is the
repeating schedule of windows that an unchanged Application keeps. With
`evenly_spaced` phasing, a later phase's first window ends on its own place in
that grid, so the first window can be shorter than the duration you wrote.

To wait for renewal, choose `update.timing: next_renewal`. The successor then
starts one renewal lead before the running job's scheduled end. The renewal
lead is how long before that scheduled end Liskov starts the next job when
you choose to wait. The scheduled end is the end time registered for the
current job's window.

If a continuous single-job Application already has two consecutive jobs open,
the successor waits until the older job's scheduled end, even with
`update.timing: immediate`.

For either wait, open the Application's **Activity** tab in the Console and
look for **Policy update waiting**. Read the summary for the job the update
is waiting behind and the expected time in UTC. If the job ID is unavailable,
the summary gives its generation. See
[Schedules and updates](../configure/schedules-updates.md#updates).

With the default `stop_when_successor_ready`, Liskov asks the old job's runtime
to stop its work once the new runtime has checked in. Liskov sends the request
in response to the old runtime's signed diagnostic check-in. The JavaScript
runtime can act on the request only if it registers an
[`onCease` handler](../reference/runtime-sdk.md#cooperative-stop-oncease).
Cooperative stop is release-gated. See
[Capabilities and limits](../reference/capabilities.md).

With `run_until_scheduled_end`, the old runtime can keep working through its
scheduled end.

The old Acurast job is charged through its scheduled end, and its Service
Credit reserve stays open through that end. An immediate update can overlap
for up to a full job window, with charges for both jobs during the overlap.
Use idempotency and external coordination where duplicate work matters.

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
