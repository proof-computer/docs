---
title: Build, attestation, import, and publication
description: Diagnose GitHub workflow, OIDC, artifact evidence, Manifest V4, capability, entitlement, and stale-digest failures.
---

# Build, attestation, import, and publication

:::note Release boundary
`liskov-github-actions@v1` is released. The complete repository path remains
gated until Manifest V4 publication is enabled for your organization. A
publication eligibility failure is not a repository build bug.
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
The default IPFS proxy needs no repository credential. If you configured a
custom proxy, verify its URL/key at that provider without printing the key.
Pinning does not spend.

## OIDC attestation is rejected

Compare exact values—not display names:

- `owner/repository`;
- triggering `refs/heads/...` or allowed ref;
- manifest `workflowRef` including path and ref;
- manifest path;
- Application ID; and
- OIDC audience expected by the action.

A workflow from a pull-request ref or renamed repository may be correctly
outside authority. Update, validate, import, and review the manifest rather
than broadening authority casually.

## Artifact version is missing

Open **Attest artifact pin** in the workflow. A successful IPFS upload alone is
not an accepted Liskov artifact. When attestation succeeds, inspect:

```bash
proof liskov application artifact-pin list APPLICATION_ID --json
```

Match commit, CID, digest, authored digest, and release-intent digest.

## Manifest validation fails

- `unknown_field`: remove or correct the property; V4 is strict.
- `invalid_policy`: inspect the field path, type/bound, and cross-field rule.
- wrong schema/version: use `proof.liskov.application-manifest` and `4`.

Do not copy a typed internal field into a recipe to “test” availability.

## Import or publication fails

- `application_identity_mismatch`: stop; verify organization, ID, and
  server-issued UID.
- `application_already_exists`: inspect the existing Application; do not
  overwrite by changing identifiers randomly.
- `unsupported_policy_feature`: select a value marked v1.
- `entitlement_exceeded`: reduce authority or change the organization's
  entitlement.
- stale authored digest/race fence: read the current draft, rerun preflight, and
  review the new diff.

Preflight is read-only. Run it after the last draft/artifact change and publish
once with the exact reviewed artifact-version ID.

## Encrypted payload cannot start

For the release-gated [encrypted JavaScript path](../build/encrypted-javascript.md),
`encrypted_code_start_failed` means the loader refused startup. Pause future
planning, then compare the attested ZIP, plaintext and ciphertext digests,
`encryption-secret-id`, required `LISKOV_CODE_KEY` declaration and configured
managed key version. The key must arrive through the authenticated Lockbox
grant; an environment value alone does not prove that delivery.

A wrong key, modified ciphertext, mismatched descriptor or missing `start(runtime)`
export must be corrected before another paid attempt. Rebuild and attest when
artifact bytes change. Never log a key or decrypted module. Loader success
(`encrypted_code_verified`) needs a separate application outcome and final
job/spend readback before treating a one-shot run as successful.
