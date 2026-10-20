---
title: Build & release
description: Prepare a workload, use the runtime SDK, author a retained Manifest V5, and publish verifiable artifacts.
---

# Build & release

This section is for developers bringing their own repository to Liskov.

Start with [workload requirements](./workload-requirements.md), then add the
[Liskov runtime SDK](./runtime-sdk.md). Describe the desired Application in
the [retained Application Manifest V5](./manifest-v5.md); existing
[Application Manifest V4](./manifest-v4.md) Applications keep running until
they are retired, but new V4 imports and publications are refused. The
[policy skill](./policy-skill.md) can draft and validate that local V5 file
in Claude Code or Codex. It does not publish or spend. The reusable
[GitHub Actions workflow](./github-actions.md) builds and pins the artifact and
records GitHub identity without a spend-capable CI credential.

Before you publish, understand [artifact provenance](./artifacts-provenance.md)
and the separate [validation and publication](./validate-import-publish.md)
steps. Create the Application with `application create`, bind its source with
`application source-binding set`, then use `application policy publish` for
the exact attested V5 document. Creation, source binding, and recording an
artifact do not deploy or spend; publication can start a deployment and reserve
Service Credits.
