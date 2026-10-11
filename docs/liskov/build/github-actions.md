---
title: Build and attest with GitHub Actions
description: Build, test, pin, and attest a Liskov artifact using GitHub OIDC and no spend credential.
---

# Build and attest with GitHub Actions

The reusable workflow turns an allowed GitHub commit into immutable artifact
evidence. GitHub OpenID Connect (OIDC) gives Liskov a short-lived statement of
repository, ref, commit, and workflow identity. You do not store a Liskov
bearer token or spend-capable credential in GitHub.

The moving `v2` release is live. The production acceptance recorded for the
`v1` contract used `v1.2.2`. Callers should use `@v2` to receive compatible
fixes. Security-sensitive callers may instead pin the reviewed commit
`2745f48e6c2619f4d431fb80d20d0e8c75068832` (`v2.0.0`) and update it deliberately.

`v2` moved to `v2.2.0` on 11 October 2026. That release changes only the
[internal runtime-image workflows](#runtime-image-workflows-are-internal);
`acurast-app.yml` and the actions it calls are unchanged from `v2.1.0`.

## Add the caller workflow

```yaml title=".github/workflows/liskov.yml"
name: Build Liskov Application

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  id-token: write

jobs:
  artifact:
    uses: proof-computer/liskov-github-actions/.github/workflows/acurast-app.yml@v2
    with:
      app-id: status-worker
      working-directory: .
      entrypoint: app.cjs
      authored-manifest-path: .liskov/application-manifest.json
```

Use the same Application ID, repository, ref, workflow path, and manifest path
as the manifest's builder block. In a monorepo, set `working-directory` to the
directory containing `package.json` and `pnpm-lock.yaml`.

The default IPFS proxy requires no repository secret. A custom IPFS endpoint is
the `ipfs-endpoint` input; it is not a secret. If that endpoint needs a key,
pass it as the `LISKOV_IPFS_API_KEY` secret. Neither authorizes Acurast spend or
Liskov policy publication.

## What runs

The called workflow:

1. checks out the triggering commit;
2. installs the requested pnpm and Node.js versions;
3. runs `pnpm install --frozen-lockfile`, `typecheck`, `test`, and `build`;
4. packages the entrypoint and requested extra files;
5. uploads the bundle to the Acurast IPFS proxy without spending; and
6. attests the CID, SHA-256 digest, manifest digests, and GitHub OIDC identity
   to Liskov.

The **Attest artifact pin** step reports Liskov's deterministic
`artifact-version-id`. Record that ID for publication.

## Verify the run

Open the GitHub Actions run and confirm:

- the workflow came from the allowed branch and exact commit;
- install, typecheck, tests, and build passed;
- the pinned CID and digest are present;
- artifact attestation succeeded; and
- an artifact-version ID was returned.

Then compare that evidence in Liskov:

```bash
proof liskov application artifact-pin list status-worker --json
```

This advanced read is safe. The workflow does not import or publish your
manifest, select a deployment schedule, reserve Service Credits, or register an
Acurast job. Continue with [Validate, import, and publish](./validate-import-publish.md).

## Encrypted JavaScript release boundary

Encrypted JavaScript payload execution is production-verified with Actions
`v1.3.2` and runtime SDK `0.3.30`: the released workflow encrypted, pinned and
attested the module, and a processor obtained its managed key, loaded it and
reported application completion. General customer availability still requires
the registered V5 source-publication release in the
[capability matrix](../reference/capabilities.md).

The [encrypted JavaScript recipe](./encrypted-javascript.md) records the exact
inputs, module contract, paused key setup and verification steps. It uses the
existing managed secrets boundary and does not grant a build workflow publication
or spending authority. See [Trust and data boundaries](../concepts/trust-boundaries.md)
before making a private-code claim; Cargo image and cache confidentiality remains
separate.

## Runtime-image workflows are internal

The same repository also releases `runtime-image.yml` and
`cargo-runtime-image.yml`, which upload or build a native runtime image. A
customer-authored Cargo or runtime image is **Internal** in the
[capability matrix](../reference/capabilities.md). This section records the
released contract so the version boundary is exact; it is not a supported
recipe.

From `v2.2.0`, both workflows at `@v2` read the `manifest-path` input as a
retained [Manifest V5](../reference/manifest-v5.md) source document and import
nothing:

- the file is JSON at a repository-relative path, with no leading `/` and no
  empty, `.`, or `..` segment;
- its `applicationId` equals the `application-id` input, `release.mode` is
  `source`, and `runtime.kind` is `native_image`; and
- the Application already carries a source binding for the calling
  repository, ref, workflow, and manifest path.

A Manifest V4 at that path is refused before anything is uploaded. A caller
that still builds from a Manifest V4 stays on `@v1`, which is frozen at
`v1.3.2` and keeps the V4 import step, and moves to `@v2` together with a V5
document. Manifest V4 publication is closed on both.

Finalizing an upload does not publish a policy version. Both workflows return
the build evidence a `release.mode: source` publication names, in the outputs
`artifact-digest`, `source-repository`, `source-ref`, `source-commit`,
`source-workflow-identity`, `binding-revision`, and `revocation-epoch`.

`cargo-runtime-image.yml` also takes the optional `source-assurance` input,
default `false`. When it is `true` the workflow verifies the committed
CycloneDX SBOM, generated from `pnpm-lock.yaml` when one is present and
otherwise from `Cargo.lock`, and returns `source-digest` and `sbom-path`. Both
outputs are empty when the input is omitted or `false`.

No `@v2` runtime-image run has been observed in production, so this contract
is released but not accepted on a customer path.
