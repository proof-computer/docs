---
title: Deploy from GitHub
description: Turn a supported GitHub repository into a built, attested, policy-bound Liskov Application.
---

# Deploy from GitHub

This path takes a Node.js background worker from source to an inspectable
Liskov Application. The workflow builds and tests your code, pins immutable
bytes to the InterPlanetary File System (IPFS), a content-addressed storage network, and records GitHub OpenID Connect (OIDC) identity. Publication
and deployment remain separate, explicit steps.

:::caution Publication availability
The reusable build, pin, and OIDC workflow is live at `@v1` (verified with
`v1.2.2`). Own-repository Manifest V4 publication is still rollout-gated by
organization. Confirm that publication is enabled for your organization before
treating this whole journey as available.
:::

## Before you begin

Complete [Set up Liskov](./set-up-liskov.md). You need:

- a GitHub repository you can authorize for Liskov;
- Node.js 22 or later and pnpm 10 for the supported example shape;
- a background workload that can be bundled as `dist/app.cjs`; and
- enough Service Credits for the displayed deployment reserve.

Repository checks take as long as your project build; processor acceptance and runtime startup are external waits with no fixed duration.

## 1. Prepare the workload

Follow [Repository and workload requirements](../build/workload-requirements.md)
and [Use the runtime SDK](../build/runtime-sdk.md). The process must bootstrap
the runtime before application work, report readiness, and stay within the
configured outbound-network and resource limits.

## 2. Author Manifest V4

Create `.liskov/application-manifest.json`. Use
[Author an Application Manifest V4](../build/manifest-v4.md) for the supported
starter document. Set the GitHub builder authority to your exact repository,
allowed branch ref, workflow path, and manifest path.

Validate before import:

```bash
proof liskov application manifest validate \
  --file .liskov/application-manifest.json
```

Validation is read-only. Save the returned authored and release-intent
digests; they distinguish the document you wrote from the release-bearing
intent used by the build.

## 3. Add the reusable workflow

Add `.github/workflows/liskov.yml` using the verified example in
[Build and attest with GitHub Actions](../build/github-actions.md). It calls:

```yaml
uses: proof-computer/liskov-github-actions/.github/workflows/acurast-app.yml@v1
```

The called workflow runs install, typecheck, tests, and build; pins the bundle
without a spend-capable credential; then records the GitHub repository, ref,
commit, workflow, content identifier (CID), digest, and manifest digests with Liskov. It does not
publish a policy or deploy an Acurast job.

## 4. Import the draft

Install the public command-line interface (CLI) if needed:

```bash
npm install --global @proof-computer/proof-cli
proof plugins install @proof-computer/proof-cli-liskov@0.7.0
proof liskov login
```

Import the manifest from GitHub:

```bash
proof liskov application import \
  --github OWNER/REPOSITORY:.liskov/application-manifest.json@main \
  --server-fetch
```

Replace `OWNER/REPOSITORY`. Import creates or updates a draft; it never
publishes, deploys, or spends.

## 5. Build and select the artifact

Push the manifest, workload, and workflow to the allowed ref. After the
workflow succeeds, record its `artifact-version-id`. Confirm that its commit,
workflow, CID, digest, authored digest, and release-intent digest match the
release you intend.

## 6. Preflight and publish

Run publication preflight:

```bash
proof liskov application publish APPLICATION_ID \
  --artifact-version ARTIFACT_VERSION_ID \
  --dry-run
```

This is read-only. Resolve every diagnostic, then publish deliberately:

```bash
proof liskov application publish APPLICATION_ID \
  --artifact-version ARTIFACT_VERSION_ID \
  --yes
```

Publication repeats preflight and uses the authored digest as a race fence. It
does not authorize an unlimited spend; deployment still applies the effective
policy caps, organization credits, quote, and reserve rules.

## 7. Verify deployment

Open the Application and follow
[your first deployment](./first-deployment.md). Completion means more than a
green workflow: verify the exact commit/workflow, artifact, policy digest,
Acurast job/processor, and signed runtime contact in the
[proof chain](../operate/proof-chain.md).

If build, OIDC, artifact, import, or publication fails, use
[Build, attestation, import, and publication](../troubleshooting/build-publish.md).
