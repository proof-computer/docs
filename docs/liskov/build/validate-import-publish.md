---
title: Validate, import, and publish
description: Move a Manifest V4 from a local check to a draft and then an immutable effective policy without conflating the steps.
---

# Validate, import, and publish

Validation, import, artifact attestation, and publication are intentionally
separate. Each produces evidence you can inspect before the next mutation.

:::caution Release gate
Manifest V4 publication is accepted for v1 but remains rollout-gated. The
commands describe the final customer path; do not expect a production publish
to succeed until your account and the v1 release are enabled.
:::

## 1. Validate locally

```bash
proof liskov application manifest validate \
  --file .liskov/application-manifest.json
```

This reads one local file and returns validation diagnostics plus the authored
and release-intent digests. It creates nothing and spends nothing.

## 2. Import a draft

Import the GitHub copy after it is committed:

```bash
proof liskov application import \
  --github OWNER/REPOSITORY:.liskov/application-manifest.json@main \
  --server-fetch
```

Or import a local file while iterating:

```bash
proof liskov application import \
  --file .liskov/application-manifest.json
```

Import creates or updates an Application draft. It never publishes, deploys,
or spends. Confirm that the returned `applicationUid`, `authoredDigest`, and
`releaseIntentDigest` describe the intended Application.

## 3. Select exact artifact evidence

For a build release, wait for the allowed GitHub workflow and copy its
artifact-version ID. You can inspect accepted pins with:

```bash
proof liskov application artifact-pin list APPLICATION_ID --json
```

Do not select an artifact only because its branch name or timestamp looks
right. Compare commit, workflow, CID, digest, and manifest digests.

## 4. Run publication preflight

```bash
proof liskov application publish APPLICATION_ID \
  --artifact-version ARTIFACT_VERSION_ID \
  --dry-run
```

Preflight is read-only. It resolves the artifact, enforces builder authority,
checks identity and enabled capabilities, and returns actionable diagnostics.
It may also expose later deployment prerequisites; it does not reserve or
spend Service Credits.

## 5. Publish deliberately

After reviewing a clean preflight:

```bash
proof liskov application publish APPLICATION_ID \
  --artifact-version ARTIFACT_VERSION_ID \
  --yes
```

The command repeats preflight and sends the authored digest as a race fence.
If the draft changed between review and confirmation, publication fails instead
of publishing different content. A successful result returns the immutable
effective policy version and digest.

## Verify

```bash
proof liskov application status APPLICATION_ID
proof liskov application plans APPLICATION_ID --json
```

Confirm the Application UID, effective policy version/digest, and selected
artifact version. Publication is not proof of a live job: follow the
[deployment timeline](../get-started/first-deployment.md) through processor
assignment, bootstrap, and runtime contact.

When preflight fails, resolve its typed diagnostic once. Do not repeat a
spend-bearing action; use [Build, attestation, import, and publication](../troubleshooting/build-publish.md).
