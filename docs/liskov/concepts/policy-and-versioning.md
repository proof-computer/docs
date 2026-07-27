---
title: Manifest, Policy, and Versioning
description: How strict V4 manifests become immutable effective policies.
---

# Manifest, Policy, and Versioning

A repository owns an authored application manifest. Liskov owns the immutable
effective policy produced from that manifest and a resolved artifact.

## Contract Identities

```json
{
  "schema": "proof.liskov.application-manifest",
  "schemaVersion": 4,
  "applicationId": "my-app",
  "release": {}
}
```

The materialized document instead uses
`proof.liskov.application-policy` V4 and contains the server-resolved
`applicationUid`, resolved artifact, runtime, deployment, ingress,
observability, and configuration. It contains no metadata, builder authority,
source provenance, mutable URL, upload session, or publication switch.

## Drafts And Artifact Versions

Import stores a manifest draft and returns `authoredDigest` plus
`releaseIntentDigest`:

```fish
proof liskov application import \
  --github my-org/my-app:.liskov/application-manifest.json@main \
  --server-fetch
```

Import never publishes. A build workflow presents exact OIDC commit, ref, and
workflow evidence and receives a deterministic `artifactVersionId`. Pinned
releases materialize their author-declared artifact version transactionally.

## Published Policy Versions

Publication selects the exact manifest and artifact evidence, runs the complete
preflight, and freezes an effective policy:

```fish
proof liskov application publish my-app \
  --artifact-version av-... \
  --dry-run
proof liskov application publish my-app \
  --artifact-version av-... \
  --yes
```

`policyDigest` binds rollout, jobs, runtime registration, and identity-bound
secret grants. Metadata and builder edits do not change it. Processor choice,
market price, availability, and concrete secret versions remain launch facts.

Publishing does not itself deploy or spend. A later lifecycle slice decides
when a changed policy digest creates a successor.

## Secrets

Secret plaintext is never manifest or policy JSON. A manifest declares a
stable secret ID and env or file destination. The actual secret version is
sealed and bound to the exact job and `policyDigest`.

See [Validation and versioning](../policy/validation-and-versioning.md) and
[Sealed secrets](../guides/sealed-secrets.md).
