---
title: GitHub Launches
description: Reviewable, repeatable, OIDC-pinned launches with no key files.
---

# GitHub Launches

Liskov is GitHub-first. Your application policy lives in your repository, and the
encrypted artifact is built and published by a GitHub Actions workflow that
authenticates with OIDC — so there are no long-lived key files to manage.

## Why GitHub-First

- **Reviewable** — the policy is a file in your repo, changed through pull
  requests.
- **Repeatable** — the same policy produces the same launch from CI.
- **OIDC-pinned** — the artifact publish is authorized by a pinned workflow
  identity, not a stored secret.

## Declaring The Source

Point the policy at the repository, branch, and policy path:

```json title="liskov.json (excerpt)"
{
  "source": {
    "provider": "github",
    "repository": "my-org/my-app",
    "branch": "main",
    "path": "liskov.json"
  },
  "artifact": {
    "mode": "planned-ipfs",
    "requiredEncryptionMode": "aes-256-gcm-loader-v1"
  },
  "artifactAutomation": {
    "github": {
      "autoPublish": true,
      "repository": "my-org/my-app",
      "branch": "main",
      "workflowRef": "my-org/my-app/.github/workflows/liskov-artifact.yml@refs/heads/main"
    }
  }
}
```

With `artifactAutomation.github.autoPublish` set, the workflow builds the bundle,
encrypts it (`aes-256-gcm-loader-v1`), and publishes a content-addressed
`ipfs://` artifact pinned to the policy version.

## Importing And Publishing

From your machine, register the app and cut a signed policy version from the
draft:

```fish
proof liskov application import --github my-org/my-app --publish
```

The `workflowRef` in the policy is what the OIDC trust is pinned to: only that
workflow, on that ref, can publish artifacts for the application.

## Related

- [Policy and versioning](../concepts/policy-and-versioning.md)
- [Sealed secrets](./sealed-secrets.md) for the secrets the workflow seals
