---
title: Validate, import, and publish
description: Validate retained Manifest V5, create and bind its Application, then publish an exact attested build; new V4 imports and publications are refused.
---

# Validate, import, and publish

For a new release, use a retained Manifest V5 source document. Local validation,
Application creation, source binding, artifact attestation, and publication are
separate steps. Follow the [GitHub path](../get-started/github.md) for the
complete checked starter and prerequisites.

:::caution Manifest V4 import and publication are closed
New V4 imports, publication preflight, and publication are refused with
`v4_publication_disabled`, in every organization. Local validation of a stored
V4 document does not reopen those routes. Existing V4 Applications keep running
until they are retired. Author a [retained Application Manifest V5](./manifest-v5.md)
instead. A confirmed
`proof liskov application set-repository APP_REF OWNER/REPO --yes` is refused
with the same code for an Application whose draft is still a Manifest V4, and
changes nothing, because confirming a repository change republishes the
manifest; the preview without `--yes` still answers.
:::

## 1. Validate locally

Use the released CLI from the [GitHub path](../get-started/github.md#1-install-the-cli)
and a retained V5 document:

```bash
proof liskov application manifest validate \
  --file .liskov/application-manifest.json \
  --json
```

This reads one local file, creates nothing, and spends nothing. Confirm
`"valid": true` and `"schemaVersion": 5` before continuing.

## 2. Create the Application and bind its source

For a new Application, create its identity before the first workflow build.
The following commands use the starter's `hello-liskov` Application ID; replace
`OWNER/REPO` with your repository. If the Application already exists, verify its
identity rather than creating another one.

```bash
proof liskov application create hello-liskov \
  --repository OWNER/REPO \
  --json
```

An organization admin must bind the repository, allowed ref, workflow identity,
and manifest path before the workflow can attest its build:

```bash
proof liskov application source-binding set hello-liskov \
  --repository OWNER/REPO \
  --allowed-ref refs/heads/main \
  --workflow-identity OWNER/REPO/.github/workflows/liskov.yml@refs/heads/main \
  --manifest-path .liskov/application-manifest.json \
  --reason "first binding" \
  --yes --json
```

Creation writes no draft. Binding authorizes the exact source; neither step
publishes, creates a job, reserves, or spends Service Credits. This replaces
V4 draft import; `proof liskov application import` cannot import a new V4 draft.

## 3. Build and inspect exact artifact evidence

Commit the validated V5 document and source to the bound ref, then run the
[approved GitHub workflow](./github-actions.md). Confirm its exact commit,
workflow identity, artifact digest, and successful attestation. Record the
`Artifact sha256:` digest and the commit the run attested. A green build does
not publish or deploy.

Read the binding before publication:

```bash
proof liskov application source-binding show hello-liskov --json
```

Use its current binding revision and revocation epoch. Do not select an
artifact only because its branch name or timestamp looks right.

## 4. Review publication preflight

The example below is a first publication with pointer version `0`. For an
update, use the current pointer version; a stale value is refused rather than
overwriting a concurrent publication. Use the exact document from the attested
commit and the evidence from step 3:

```bash
proof liskov application policy publish hello-liskov \
  --file .liskov/application-manifest.json \
  --artifact-digest sha256:ARTIFACT_DIGEST_FROM_THE_RUN \
  --source-commit COMMIT_THE_RUN_ATTESTED \
  --source-ref refs/heads/main \
  --workflow-identity OWNER/REPO/.github/workflows/liskov.yml@refs/heads/main \
  --binding-revision BINDING_REVISION \
  --revocation-epoch REVOCATION_EPOCH \
  --expected-pointer-version 0 \
  --dry-run --json
```

Preflight is read-only. Review the intended policy, source evidence, spend
bounds, and diagnostics. It does not reserve or spend Service Credits.

## 5. Publish deliberately

After a clean preflight, run the same command with `--yes` in place of
`--dry-run`. The source-evidence and expected-pointer flags remain required.
Publication commits an immutable effective policy and can start a deployment
and reserve Service Credits. Stop if the organization does not already have
enough available credits; customer checkout and new issuance remain
release-gated.

If the document, source binding, or pointer changes, read the current state and
review a fresh preflight before confirming. Do not repeat a spend-bearing
command to work around a refusal.

## Verify

```bash
proof liskov application policy explain hello-liskov --json
proof liskov application status hello-liskov --json
```

Confirm the Application UID, policy digest, attested commit, and artifact
digest. Publication is not proof of a live job: follow the
[deployment timeline](../get-started/first-deployment.md) through processor
assignment, bootstrap, and runtime contact, then verify the workload's output.

When validation, binding, attestation, or preflight fails, resolve its typed
diagnostic using [Build, attestation, import, and publication](../troubleshooting/build-publish.md).
