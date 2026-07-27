---
title: Validation And Versioning
description: Validate strict V4 policies, understand errors and digests, and evolve immutable versions safely.
---

# Validation And Versioning

V4 validation is deterministic and fail closed. A server never silently drops,
renames, or clamps authored behavior.

## Get The Authoritative JSON Schema

The control plane exposes the generated Draft 2020-12 schema:

```text
GET /api/application-policy/schema
```

Its schema identifier is:

```text
https://schemas.proof.computer/liskov/application-policy-v4.schema.json
```

The JSON Schema describes object shape, required fields, enums, defaults, and
integer types. Server validation additionally enforces semantic, capability,
entitlement, and application-identity rules.

## Validation Layers

| Layer | Examples |
| --- | --- |
| Strict parsing | Unknown field, wrong enum arm, missing required union field |
| Semantic | Invalid application id, zero duration, bad fixed lead, group counts do not sum |
| Capability | Automatic lead or topology requested before enablement |
| Entitlement | `parallelism` exceeds the account maximum |
| Identity | Authored `applicationUid` does not match the target application |

## Error Contract

Errors carry a stable code and JSON Pointer:

```json
{
  "code": "unknown_field",
  "message": "unknown field `renewalWindowMs`",
  "pointer": "/deployment/lifecycle/renewal/renewalWindowMs"
}
```

Stable codes include:

- `invalid_policy`;
- `unknown_field`;
- `unsupported_policy_feature`;
- `entitlement_exceeded`;
- `application_identity_mismatch`.

Treat pointers as the authoritative location. Do not parse human messages to
drive automation.

## Authored And Effective Digests

Publishing stores:

```json
{
  "contractVersion": 2,
  "activePolicy": {
    "envelope": {
      "schema": "proof.liskov.application-policy",
      "schemaVersion": 4,
      "policyVersionId": "customer-api-v7",
      "previousPolicyVersionId": "customer-api-v6",
      "publishedAtMs": 0,
      "authoredDigest": "...",
      "policyDigest": "...",
      "source": {}
    },
    "authored": {},
    "effective": {},
    "diagnostics": []
  },
  "previousPolicy": {},
  "rollout": {}
}
```

`authoredDigest` hashes canonical authored JSON. `policyDigest` hashes the
normalized effective document after defaults. Both are SHA-256 hex digests.
Canonicalization sorts object keys recursively; array order remains meaningful.

The policy digest binds jobs, runtime identity, and identity-bound secret
grants. A launch captures dynamic observations separately so changing market
price or processor availability does not mutate a published policy.

## Publish Immutable Versions

A draft is editable. Publishing freezes an immutable version:

```fish
proof liskov application import --github example/customer-api --publish
```

Before publishing:

1. inspect the exact authored JSON;
2. validate every returned pointer;
3. review the effective document and diagnostics;
4. confirm spend caps and lifecycle authority;
5. confirm the target application UID if the policy pins one; and
6. publish once, then refer to the returned policy version and digest.

Never edit a published version. Publish a successor version and let
`deployment.lifecycle.update` define how it reaches running slots.

## Defaults And Review Discipline

Defaults are part of the effective digest, but experts often author
behavior-bearing defaults explicitly:

- `deployment.parallelism`;
- runtime bootstrap requirements;
- processor-selection safety checks;
- launch retry count;
- signed runtime diagnostics; and
- whether logs are enabled.

Explicit values make review easier. Omission is useful for empty optional
sections such as ingress or secrets.

## Safe Policy Evolution

Classify a change before publishing:

| Change | Typical effect |
| --- | --- |
| Metadata label or description | New digest; no runtime semantic change |
| Artifact, runtime command, resources, configuration | New desired workload |
| Placement requirement | New processor eligibility |
| Spend cap | New maximum authority, even if lower |
| Renewal or update timing | Changes successor scheduling |
| Recovery policy | Changes failure authority and retry budget |

For high-impact changes, use `next_scheduled_renewal` and
`run_until_scheduled_end` first. Move to immediate update or cooperative cease
only when the runtime and operational acceptance criteria are ready.

## Common Mistakes

- Adding server-owned fields such as display name, owner, status, or timestamps.
- Inventing `applicationUid` instead of using the issued value.
- Using JSON numbers for planck caps instead of decimal strings.
- Treating a fixed renewal lead as a readiness guarantee.
- Using parallelism as Acurast-native replicas rather than stable Liskov slots.
- Assuming schema validity means a gated feature is executable.
- Putting secret plaintext in `configuration.variables`; declare a secret id
  and destination instead.
