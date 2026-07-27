---
title: GitHub Build Releases
description: Bind GitHub OIDC build evidence to an exact V4 manifest and release intent.
---

# GitHub Build Releases

A build release authorizes one artifact requirement and one exact GitHub
builder. It does not contain the artifact result and it cannot auto-publish.

```json title=".liskov/application-manifest.json (excerpt)"
{
  "release": {
    "mode": "build",
    "artifact": {
      "kind": "ipfs_bundle",
      "encryption": {
        "mode": "aes256_gcm"
      }
    },
    "builder": {
      "kind": "github",
      "repository": "my-org/my-app",
      "allowedRefs": [
        "refs/heads/main",
        "refs/tags/v1"
      ],
      "workflowRef": "my-org/my-app/.github/workflows/liskov.yml@refs/heads/main",
      "manifestPath": ".liskov/application-manifest.json"
    }
  }
}
```

`allowedRefs` must be non-empty. `workflowRef` is exact, and `manifestPath`
must be a safe repository-relative path. A build release rejects CIDs, artifact
digests, image URLs, upload sessions, and publication switches.

## Evidence Flow

1. Import the exact manifest and retain its `authoredDigest` and
   `releaseIntentDigest`.
2. Build and pin the artifact without spend.
3. Submit the resolved artifact, both observed digests, and GitHub OIDC
   repository/ref/SHA/workflow evidence.
4. Retain the returned deterministic `artifactVersionId`.
5. Run publication preflight with that exact artifact version.
6. Publish explicitly with `--yes` only after every phase is ready.

```fish
proof liskov application publish my-app \
  --artifact-version av-... \
  --dry-run
```

Artifact-version identity includes the application UID, release-intent digest,
source commit, and normalized resolved artifact. Identical bytes can therefore
have distinct provenance and manifest bindings.

For an IPFS bundle, the build result contains a canonical CID, SHA-256 digest,
and the exact required encryption. For a runtime image it binds the immutable
image digest and the generated launchable bootstrap CID and digest.

## Related

- [Manifest and policy fundamentals](../policy/fundamentals.md)
- [Validation and versioning](../policy/validation-and-versioning.md)
- [Manifest and effective-policy schema](../reference/policy-schema.md)
