---
unlisted: true
title: Encrypted JavaScript delivery
description: Build an encrypted JavaScript payload, publish paused, configure its managed key, and verify processor execution.
---

# Encrypted JavaScript delivery

:::danger[Not released]
This recipe requires the enabled registered V5 publication path and production
acceptance of encrypted execution. It is prepared for that release; the
[capability matrix](../reference/capabilities.md) remains the availability authority.
:::

The build encrypts your application module before upload. IPFS carries a public
bootstrap, a public descriptor and ciphertext. The bootstrap obtains the key
through the existing job-bound managed Lockbox grant, verifies both payload
digests and AES-GCM authentication, and loads the module inside the processor.
PROOF can access the managed key during release. This protects the payload
from public artifact readers; it is not operator-blind code delivery, and it
does not establish [Cargo image or cache confidentiality](../concepts/trust-boundaries.md).

## Prepare the module and key

Use Actions `v1.3.0` or a compatible later `@v1`; its public loader includes
runtime SDK `0.3.29`. Use CLI `0.13.0` or later for the paused publication
flags below. The server must support registered publication previews and
atomic setup holds.

Your build produces a self-contained CommonJS module at `dist/encrypted.cjs`
with an exported `start(runtime)` function. Use the supplied, already
bootstrapped runtime handle; do not start another runtime bootstrap. Include
all application dependencies in this module. The encrypted mode accepts one
module of at most 16 MiB, and rejects extra files, prepared artifacts, custom
artifact metadata and reused CIDs.

```typescript
import type { BootstrapSlipwayRuntimeHandle } from "@proof-computer/liskov-runtime";

export async function start(runtime: BootstrapSlipwayRuntimeHandle): Promise<void> {
  await runtime.diagnostics.report({
    stage: "application.completed",
    status: "succeeded",
    code: "work_completed"
  });
  runtime.stop();
}
```

Generate a cryptographically random 32-byte key and encode it as canonical
standard base64. Store it as a GitHub repository secret, for example
`APPLICATION_CODE_KEY`. Keep the same value available for the Application's
managed secret setup. Never commit the key or print it in a build step.

Declare the required secret in the V5 manifest's `configuration.secrets`:

```json
{
  "secretId": "application-code-key",
  "required": true,
  "destination": {"kind": "environment", "name": "LISKOV_CODE_KEY"}
}
```

Use `release.mode: source`, JavaScript with the `nodejs` engine, and
`runtime.entrypoint.file: encrypted.cjs`. Keep the secret ID identical in the
manifest and workflow. Set the intended execution mode, paid duration and
Service Credit cap deliberately: publishing a `once` policy normally starts
one paid occurrence.

## Build, encrypt, pin and attest

The Application identity and its source binding must already authorize the
exact repository, ref, caller workflow and manifest path. Add a caller workflow:

```yaml title=".github/workflows/encrypted-code.yml"
name: Encrypted JavaScript artifact
on:
  workflow_dispatch:
permissions:
  contents: read
  id-token: write
jobs:
  artifact:
    uses: proof-computer/liskov-github-actions/.github/workflows/acurast-app.yml@v1
    with:
      app-id: encrypted-worker
      authored-manifest-path: .liskov/encrypted-worker.json
      entrypoint: encrypted.cjs
      encryption-mode: aes-256-gcm-payload-v1
      encryption-secret-id: application-code-key
      ipfs-gateway-url: "https://ipfs.io/ipfs/{cid}"
    secrets:
      LISKOV_CODE_ENCRYPTION_KEY: ${{ secrets.APPLICATION_CODE_KEY }}
```

The workflow runs the caller's typecheck, tests and build. It encrypts with a
fresh AES-256-GCM nonce, verifies the uploaded bytes through the specified
gateway, and attests the artifact through GitHub OIDC. It does not publish the
policy, configure Lockbox, or spend Service Credits.

Download the run's build manifest. Record `scriptIpfs`, `scriptHash`, the
`encryptedCode` descriptor, exact source commit, source-binding revision and
revocation epoch. The **Attest artifact pin** step reports the `source-...`
artifact version. The outer ZIP digest, plaintext digest and ciphertext digest
identify different bytes; never substitute one for another.

## Publish paused, then configure the key

Using those exact values, preview the registered source publication:

```bash
proof liskov application policy publish encrypted-worker \
  --file .liskov/encrypted-worker.json \
  --artifact-digest sha256:YOUR_ZIP_DIGEST \
  --binding-revision 1 --revocation-epoch 0 \
  --source-ref refs/heads/main --source-commit YOUR_SOURCE_COMMIT \
  --workflow-identity OWNER/REPOSITORY/.github/workflows/encrypted-code.yml@refs/heads/main \
  --expected-pointer-version 0 \
  --paused --reason "Configure application code key before execution" --dry-run
```

Replace the example identity, revisions, pointer and digest with the readback
for your Application. Review the proposed policy and artifact. Repeat the
same command with `--yes` in place of `--dry-run` to commit the policy and
pause atomically. Check that the Application reads **paused** with the expected
policy version, digest and artifact. A stale pointer refuses publication;
read and review the new state before confirming again.

Open the Application's **Secrets** settings and set `application-code-key`
to the same base64 value used by the build. Verify that the required secret is
configured for this policy. Pause must cover this setup: a required missing key
blocks runtime readiness after deployment, and is not a pre-launch spend hold.

When the key and spend authority are ready, resume deliberately:

```bash
proof liskov application resume encrypted-worker \
  --reason "Start the reviewed encrypted application" --yes
```

## Verify the processor result

Require the signed runtime diagnostic `application.encrypted_code.loaded`,
status `succeeded`, code `encrypted_code_verified`, with the expected plaintext
and ciphertext digests. Also verify an application-specific completion or
health event. Loader success proves authenticated loading; it does not prove
your application's business result. For a one-shot run, record terminal job
state and the settled Service Credit amount.

The loader accepts only a key installed from the matching authenticated
Lockbox grant. Setting an environment variable alone is insufficient. It
loads a private local module and removes the temporary plaintext file after
`start(runtime)` completes; it does not use a shared plaintext cache.

If startup reports `encrypted_code_start_failed`, keep the Application paused
while comparing the attested digests, secret ID and configured key version.
Do not print the key or decrypted module to diagnose it. See
[build and publication troubleshooting](../troubleshooting/build-publish.md).
