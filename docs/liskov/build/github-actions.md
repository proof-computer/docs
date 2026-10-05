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
