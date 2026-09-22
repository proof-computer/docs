---
title: Deploy from GitHub
description: Take the checked retained Manifest V5 starter from your own GitHub repository to a built, attested, published Liskov Application.
---

# Deploy from GitHub

This path takes a small Node.js worker from your own GitHub repository to an
inspectable Liskov Application. It uses retained **Manifest V5** with GitHub
source import: an organization admin binds your repository to the
Application, and every build attests that it came from exactly that source.

You start from the checked
[retained V5 starter](https://github.com/proof-computer/docs/tree/main/examples/liskov-v1/retained-v5-starter).
It makes one harmless `GET` request to `https://example.com/`, records the
result in managed logs, and stops. It needs no variable or secret.

:::caution What spends and what does not
Steps 1–5 spend nothing: installing, building, validating, creating the
Application, binding its source, and running the GitHub workflow create no job
and reserve no Service Credits. **Publishing in step 6 is the mutation**: it
commits an effective policy and starts a deployment that draws on your
organization's already-available Service Credits. Customer checkout and new
Service Credit issuance are release-gated, so there is no supported way to add
funds first. A green workflow is a built artifact, not a running Application.
:::

## Before you begin

Complete [Set up Liskov](./set-up-liskov.md). You need:

- a GitHub repository with a `main` branch you can push to;
- the `admin` role in your Liskov organization, or an admin who will run the
  source binding in step 4 (a maintainer cannot bind or retarget source);
- Node.js 22 or later, and pnpm `10.33.0` (the starter pins it through
  `packageManager`; `corepack enable` provides it); and
- enough already-available Service Credits for the starter's per-job spend
  before you reach step 6.

Repository checks take as long as your project build. Processor acceptance and
runtime startup are external waits with no fixed duration.

## 1. Install the CLI

Use `@proof-computer/proof-cli-liskov` `0.14.0`. It contains the retained V5
authoring, policy, and `application source-binding` verbs this path uses:

```bash
npm install --global @proof-computer/proof-cli
proof plugins install @proof-computer/proof-cli-liskov@0.14.0
proof liskov login
proof liskov whoami
```

`whoami` shows the organization your commands act on. If you belong to more
than one, select the intended one with `proof liskov organization use`.

## 2. Copy the starter into your repository

The starter directory is a complete repository root: source, tests, package
and lock file, TypeScript configuration, manifest, and workflow caller. Copy
it into your repository, then move the workflow caller to where GitHub runs
it:

```bash
git clone --depth 1 https://github.com/proof-computer/docs.git liskov-docs
cp -R liskov-docs/examples/liskov-v1/retained-v5-starter/. YOUR_REPOSITORY/
cd YOUR_REPOSITORY
mkdir -p .github/workflows
mv liskov.yml .github/workflows/liskov.yml
```

Do not push yet. The workflow must not run before the Application and its
source binding exist (step 4).

The files you now have are the same ones the
[Manifest V5 guide](../build/manifest-v5.md#1-build-the-checked-once-mode-starter)
explains: `src/index.ts` bootstraps `@proof-computer/liskov-runtime`
`v0.3.32`, and `.liskov/application-manifest.json` is a once-mode V5 document
with a 60-second schedule, a managed-custody per-job spend, logs enabled, and
`state.mode: off`.

## 3. Build and validate locally

From the repository root, install the exact lock, test, and build:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
test -s dist/bundle.js
```

Then validate the manifest with the released CLI:

```bash
proof liskov application manifest validate \
  --file .liskov/application-manifest.json \
  --json
```

Validation is read-only. A valid document reports `"valid": true` and
`"schemaVersion": 5`. Keep the `60s` schedule duration: the schema parses
shorter values, but the Acurast marketplace refuses a job below its 60-second
provider minimum, so schema acceptance alone does not prove that a schedule
can launch.

## 4. Create the Application and bind its source

Run both commands **before the first push to `main`** that contains the
workflow. The workflow's first build must find the binding; a local build does
not create one. Replace `OWNER/REPO` with your repository.

Create the Application from identity alone. This writes no draft and spends
nothing:

```bash
proof liskov application create hello-liskov \
  --repository OWNER/REPO \
  --json
```

Bind the exact source the Application may publish from. This requires the
organization `admin` role. The first binding is revision `1`:

```bash
proof liskov application source-binding set hello-liskov \
  --repository OWNER/REPO \
  --allowed-ref refs/heads/main \
  --workflow-identity OWNER/REPO/.github/workflows/liskov.yml@refs/heads/main \
  --manifest-path .liskov/application-manifest.json \
  --reason "first binding" \
  --yes --json
```

The workflow's `app-id` is `hello-liskov`, matching the Application created
above. If you choose another Application id, change it in all three places:
the manifest's `applicationId`, the workflow's `app-id`, and these commands.

## 5. Push and let the workflow build

Commit the starter and push it to the bound ref:

```bash
git add .
git commit -m "Add the Liskov retained V5 starter"
git push origin main
```

The workflow calls:

```yaml
uses: proof-computer/liskov-github-actions/.github/workflows/acurast-app.yml@v1
```

The moving `v1` tag is verified at `v1.2.4`, which contains the retained V5
source binding. The called workflow installs, typechecks, tests, and builds;
uploads the bundle without a spend-capable credential; and attests the
artifact digest, source commit and ref, and workflow identity to Liskov. It
publishes nothing and deploys nothing.

When the run succeeds, record two values from it: the artifact digest, printed
in the run log as `Artifact sha256:`, and the commit the run built.

## 6. Publish from the attested build

Stop here if the organization does not already have enough available Service
Credits. Read the binding values publication must repeat:

```bash
proof liskov application source-binding show hello-liskov --json
```

Then publish the exact document the run attested. Every value must match what
was bound and attested, or the publication is refused before anything is
spent:

```bash
proof liskov application policy publish hello-liskov \
  --file .liskov/application-manifest.json \
  --artifact-digest sha256:ARTIFACT_DIGEST_FROM_THE_RUN \
  --source-commit COMMIT_THE_RUN_ATTESTED \
  --source-ref refs/heads/main \
  --workflow-identity OWNER/REPO/.github/workflows/liskov.yml@refs/heads/main \
  --binding-revision 1 \
  --revocation-epoch 0 \
  --expected-pointer-version 0 \
  --yes --json
```

Nothing is sent without `--yes`. `--binding-revision` and `--revocation-epoch`
are the values `source-binding show` reported. `--expected-pointer-version` is
`0` for a first publication; a stale value is refused rather than overwriting
a concurrent publication.

## 7. Verify the result

Read the canonical explanation and the Application status:

```bash
proof liskov application policy explain hello-liskov --json
proof liskov application status hello-liskov --json
```

The explanation's publication, execution, spend-closeout, and managed-SSH
sections report `absent`, `notApplicable`, `refused`, or `satisfied`, with
server-owned next actions. Follow [your first deployment](./first-deployment.md)
through the normal waiting stages.

Then verify the worker's own output. Once the runtime is ready, the managed
logs contain one `starter.fetch.completed` event with the host, success flag,
and HTTP status:

```bash
proof liskov application logs hello-liskov --from-start
```

Completion means more than a green workflow: open **Proof** and confirm the
exact commit and workflow, artifact digest, effective policy digest, Acurast
job and processor, and signed runtime contact in the
[proof chain](../operate/proof-chain.md).

A `once` Application runs one job and settles; it does not run again on its
own. See [Execution and spend](../build/manifest-v5.md#execution-and-spend)
before changing the execution mode.

If the build, attestation, source binding, or publication fails, use
[Build, attestation, import, and publication](../troubleshooting/build-publish.md).

## Next

- Make the worker your own: [Author a retained Application Manifest V5](../build/manifest-v5.md)
  and [Use the runtime SDK](../build/runtime-sdk.md).
- Exact fields: [Application Manifest V5 reference](../reference/manifest-v5.md).
- Operate the Application: [Deploy & operate](../operate/index.md).

## Manifest V4

[Application Manifest V4](../build/manifest-v4.md) remains supported for
existing Applications. Own-repository V4 publication is rollout-gated by
organization; its draft import and publication commands are in
[Validate, import, and publish](../build/validate-import-publish.md). The
recommended first-use path is the V5 path above.
