---
title: Build & release
description: Prepare a workload, use the runtime SDK, author Manifest V4, and publish verifiable artifacts.
---

# Build & release

This section is for developers bringing their own repository to Liskov.

Start with [workload requirements](./workload-requirements.md), then add the
[Liskov runtime SDK](./runtime-sdk.md). Describe the desired Application in an
[Application Manifest V4](./manifest-v4.md). The reusable
[GitHub Actions workflow](./github-actions.md) builds and pins the artifact and
records GitHub identity without a spend-capable CI credential.

Before you publish, understand [artifact provenance](./artifacts-provenance.md)
and the separate [validate, import, and publish](./validate-import-publish.md)
steps. Importing a draft and recording an artifact never deploy or spend by
themselves.
