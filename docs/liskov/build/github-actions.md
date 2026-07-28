---
title: Build and attest with GitHub Actions
description: Build, test, pin, and attest a Liskov artifact using GitHub OIDC and no spend credential.
---

# Build and attest with GitHub Actions

The reusable workflow turns an allowed GitHub commit into immutable artifact
evidence. GitHub OpenID Connect (OIDC) gives Liskov a short-lived statement of
repository, ref, commit, and workflow identity. You do not store a Liskov
bearer token or spend-capable credential in GitHub.

:::caution Release gate
The workflow source has been reviewed, but its `v1` tag is not yet published.
The example below is the v1 contract; do not run it as a production path until
that tag exists and this notice is removed.
:::

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
    uses: proof-computer/liskov-github-actions/.github/workflows/acurast-app.yml@v1
    with:
      app-id: status-worker
      working-directory: .
      entrypoint: app.cjs
      authored-manifest-path: .liskov/application-manifest.json
```

Use the same Application ID, repository, ref, workflow path, and manifest path
as the manifest's builder block. In a monorepo, set `working-directory` to the
directory containing `package.json` and `pnpm-lock.yaml`.

The default IPFS proxy requires no repository secret. A custom proxy may use
`ACURAST_IPFS_URL` and `ACURAST_IPFS_API_KEY`; those authorize upload to that
proxy, not Acurast spend or Liskov policy publication.

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
