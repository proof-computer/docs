---
title: GitHub Launches
description: Reviewable, repeatable, OIDC-pinned V4 builds with no key files.
---

# GitHub Launches

V4 separates GitHub build authority from the immutable artifact it produces.
The policy lives in your repository and names the workflow identity allowed to
publish build evidence. Artifact publication remains a separate
server-authorized action; policy JSON does not contain an auto-publish switch.

## Declare Build Authority

```json title="liskov.json (excerpt)"
{
  "artifact": {
    "kind": "ipfs",
    "cid": "bafy-replace-with-your-cid",
    "digest": "sha256:replace-with-your-digest",
    "encryption": {
      "mode": "aes256_gcm"
    }
  },
  "build": {
    "github": {
      "repository": "my-org/my-app",
      "allowedRefs": [
        "refs/heads/main",
        "refs/tags/v*"
      ],
      "workflowRef": "my-org/my-app/.github/workflows/liskov.yml@refs/heads/main",
      "path": "liskov.json"
    }
  }
}
```

| Field | Meaning |
| --- | --- |
| `repository` | GitHub repository authorized to build the workload. |
| `allowedRefs` | Branches or tags the build authority accepts. |
| `workflowRef` | Exact GitHub OIDC workflow identity. |
| `path` | Policy path inside the repository. |

The workflow builds and, when requested, encrypts the artifact, then publishes
an OIDC-authenticated artifact pin. The resulting CID and digest are immutable
policy intent.

## Import And Publish

```fish
proof liskov application import --github my-org/my-app --publish
```

Review both the authored and effective policy. A workflow can publish an
artifact pin only through its separately authorized server endpoint; possessing
a matching repository name is not enough.

## Related

- [Policy and versioning](../concepts/policy-and-versioning.md)
- [Policy schema: artifact and build](../reference/policy-schema.md#artifact)
- [Sealed secrets](./sealed-secrets.md)
