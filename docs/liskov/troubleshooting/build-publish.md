---
title: Build, attestation, import, and publication
description: Diagnose GitHub workflow, OIDC, retained Manifest V5 source evidence, V4 refusal, capability, entitlement, and stale-publication failures.
---

# Build, attestation, import, and publication

:::note Manifest V4 import and publication are closed
`liskov-github-actions@v2` is released. New imports, publication preflight, and
publish are refused for a Manifest V4 with `v4_publication_disabled`; that refusal
is not a repository build bug. Existing V4 Applications keep running until
they are retired. To publish, author a
[retained Application Manifest V5](../build/manifest-v5.md) and follow the
[GitHub path](../get-started/github.md).
:::

## Build or test fails

Reproduce the workflow working directory locally:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

Confirm the lockfile path and final `dist/` entrypoint. Fix the first failing
command; later artifact steps have no valid input.

## Pin fails

Check that the entrypoint and every `extra-files` item exists under `dist/`.
The default Liskov upload needs no repository credential, but it needs
`organization-id` and `permissions: id-token: write`. `organization-id is
required for Liskov uploads` means the input is missing; a caller written for
an earlier `v2` release must add it. `artifact_too_large` means the artifact is
over 8 MiB. If you set `ipfs-endpoint` to use the Acurast proxy, verify its
URL/key at that provider without printing the key. Pinning does not spend.

## OIDC attestation is rejected

Compare exact values—not display names:

- `owner/repository`;
- triggering `refs/heads/...` or allowed ref;
- manifest `workflowRef` including path and ref;
- manifest path;
- Application ID; and
- OIDC audience expected by the action.

A workflow from a pull-request ref or renamed repository may be correctly
outside authority. Review the retained V5 manifest and source binding with an
organization admin rather than broadening authority casually. Validate the
corrected document, rebuild from the bound source, then review publication.

## Artifact version is missing

Open **Attest artifact pin** in the workflow. A successful IPFS upload alone is
not an accepted Liskov artifact. When attestation succeeds, inspect:

```bash
proof liskov application artifact-pin list APPLICATION_ID --json
```

Match commit, CID, digest, authored digest, and release-intent digest.

## Manifest validation fails

- `unknown_field`: remove or correct the property; manifests are strict.
- `invalid_policy`: inspect the field path, type/bound, and cross-field rule.
- wrong schema/version: use `proof.liskov.application-manifest` and `5` for
  new publications.

Do not copy a typed internal field into a recipe to “test” availability.

## Import or publication fails

- `v4_publication_disabled`: the input or stored draft is a Manifest V4, and
  new V4 imports and publications are refused. Author a retained Manifest V5,
  create the Application and bind its source, then publish it with
  `application policy publish`; the V4 draft itself is not broken. A
  confirmed `application set-repository --yes` on such an Application returns
  the same code and leaves its repository unchanged.
- `application_identity_mismatch`: stop; verify organization, ID, and
  server-issued UID.
- `application_already_exists`: inspect the existing Application; do not
  overwrite by changing identifiers randomly.
- `unsupported_policy_feature`: select a value marked v1.
- `entitlement_exceeded`: reduce authority or change the organization's
  entitlement.
- stale source evidence or pointer version: read the current source binding
  and publication state, rerun preflight, and review the new diff.

Retained V5 preflight (`application policy publish --dry-run`) is read-only.
Run it after the last document or artifact change and publish once with the
exact reviewed artifact digest, source evidence, and expected pointer version.

## Encrypted payload cannot start

For the release-gated [encrypted JavaScript path](../build/encrypted-javascript.md),
`encrypted_code_start_failed` means the loader refused startup. SDK `0.3.30`
also reports `encrypted_code_failure_detail` with a bounded `phase`, including
`directory`, `module_load` or `application_start`. Exception text, keys,
plaintext and local paths are omitted. Let an existing one-shot occurrence
settle, then retire it or pause future launches before retrying.
Compare the attested ZIP, plaintext and ciphertext digests,
`encryption-secret-id`, required `LISKOV_CODE_KEY` declaration and configured
managed key version. The key must arrive through the authenticated secret
grant; an environment value alone does not prove that delivery.

For `directory`, use Actions `v1.3.2` or later: its bootstrap keeps runtime
files inside the processor job directory. For `module_load` or `entrypoint`,
check the self-contained CommonJS bundle and exported `start(runtime)`.
`application_start` means the verified application itself failed during startup.

A wrong key, modified ciphertext, mismatched descriptor or missing `start(runtime)`
export must be corrected before another paid attempt. Rebuild and attest when
artifact bytes change. Never log a key or decrypted module. Loader success
(`encrypted_code_verified`) needs a separate application outcome and final
job/spend readback before treating a one-shot run as successful.

`lockbox_response_key_missing` occurs earlier, during runtime bootstrap. It
identifies the processor's P-256 public key for receiving encrypted grants.
The managed AES application code key has a separate role: successfully saving
it does not establish that the processor can receive the grant. Keep the
Application paused and provide the job ID, runtime failure code and policy
digest to support. Do not substitute an arbitrary public key or rotate the
application code key to hide this failure.
