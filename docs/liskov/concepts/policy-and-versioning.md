---
title: Policy And Versioning
description: How strict V4 drafts become immutable authored and effective policy versions.
---

# Policy And Versioning

A `liskov.json` file is the authored source for one V4 application policy.
Liskov separates an editable **draft** from immutable **published versions** and
from the dynamic facts captured for each launch.

## Contract Identity

Every policy starts with:

```json
{
  "schema": "proof.liskov.application-policy",
  "schemaVersion": 4,
  "applicationId": "my-app"
}
```

`applicationId` is authored. Optional `applicationUid` is an immutable
server-issued identity pin; never invent it. Display name, organization, owner,
status, publication timestamps, and import provenance are server-owned.

## Drafts

A draft is editable and is never deployed directly:

```fish
proof liskov application import --github my-org/my-app
proof liskov application status my-app
```

V4 parsing is strict. Unknown fields and misspelled enum arms fail with a stable
code and JSON Pointer.

## Published Versions

Publishing freezes the draft:

```fish
proof liskov application import --github my-org/my-app --publish
```

Each immutable version records:

- a server-owned envelope with schema identity, policy version, predecessor,
  timestamp, and source;
- exact authored JSON and its `authoredDigest`;
- normalized effective JSON and its `policyDigest`; and
- deterministic diagnostics.

`policyDigest` binds jobs, runtime registration, and identity-bound secret
grants. Processor choice, market price, schedule availability, resolved
profiles, and secret versions are dynamic launch facts stored with the attempt
or grant.

## Policy Updates

Publishing does not rewrite running jobs. When a new version becomes active,
`deployment.lifecycle.update` determines whether it targets the next scheduled
renewal or begins immediately, and whether existing jobs run until schedule end
or receive a cooperative cease request.

See [Validation and versioning](../policy/validation-and-versioning.md) for the
read contract, canonical digests, and review checklist.

## Secrets Are Versioned Separately

Secret plaintext is never policy JSON. A policy declares a stable `secretId`,
whether it is required, and an env or file destination. The actual secret
version is sealed and bound to an exact job and policy digest.

See [Sealed secrets](../guides/sealed-secrets.md).
