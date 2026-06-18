---
title: Policy And Versioning
description: How Liskov drafts become immutable, signed policy versions.
---

# Policy And Versioning

A `liskov.json` file is the source for an application policy. Liskov separates a
mutable **draft** from the immutable **published versions** it deploys.

## Drafts

A draft is the editable policy for an application. You read and update it with
the CLI and the control plane:

- `proof liskov application status my-app` shows the current state.
- `proof liskov application import --github my-org/my-app` updates the draft from
  your repository.

Drafts are convenient but are never what gets deployed directly.

## Published Versions

Publishing freezes the current draft into an immutable, numbered, signed policy
version:

```fish
proof liskov application import --github my-org/my-app --publish
```

Each published version records:

- `applicationId`, a `policyVersionId`, and the `previousVersionId`
- owner and timestamps
- a `policyDigest` (a content hash the signatures cover)
- the runtime, Acurast placement and cost constraints, secret declarations, and
  ingress requirements

Because versions are immutable and content-addressed by digest, a deployment
always refers to an exact, signed policy — not whatever the draft happens to say
later. `proof liskov application plans my-app` lists the versions and the plan
items derived from them.

## Secrets Are Versioned Separately

Secret material is **not** stored in the policy. Policies reference sealed-secret
records by id and digest; the plaintext is sealed to the enclave and delivered at
deploy time. See [Sealed secrets](../guides/sealed-secrets.md).

## The `domain` Field

Every policy declares `"domain": "proof.slipway.application-policy.v3"`. This is
the stable schema-contract identifier for the policy format. It is an internal
contract string and does not change with the product brand.
