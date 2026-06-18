---
title: Concepts
description: The ideas behind Liskov deployments.
---

# Concepts

Liskov is a managed deploy that keeps confidential-compute properties intact.
These pages explain the model so the CLI output and policy fields make sense.

- [Replacement custody](./replacement-custody.md): why deployments are replaced
  rather than kept alive forever, and the states they move through.
- [Deployment lifecycle](./deployment-lifecycle.md): the stages a launch crosses,
  from local policy to validated, settled traffic.
- [Trust model](./trust-model.md): who holds which keys and what each actor can
  and cannot do.
- [Policy and versioning](./policy-and-versioning.md): how drafts become
  immutable, signed policy versions.
