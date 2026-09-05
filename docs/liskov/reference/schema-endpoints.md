---
title: Schema and discovery endpoints
description: Machine-readable Manifest V4, retained Manifest V5, and effective-policy schema locations and the boundary of public endpoint support.
---

# Schema and discovery endpoints

Liskov serves generated JSON Schema for tooling:

```text
GET /api/application-manifest/schema
GET /api/application-manifest/v5/schema
GET /api/application-policy/schema
```

The first describes customer-authored Manifest V4. The versioned route describes
the exact retained Manifest V5 shape. The policy route describes
server-materialized Policy V4; V5 explanation and effective evidence are read
through the supported Application surfaces rather than inferred from this V4
schema route.

## Use

Download from the same Liskov environment you target, cache by content digest,
and configure your editor or validator to reject unknown fields. Re-fetch when
the published schema digest changes. The authoritative semantic validation is:

```bash
proof liskov application manifest validate --file PATH
```

JSON Schema can validate shape, enums, and many bounds. The Liskov validator
also applies cross-field rules. Publication preflight additionally checks
identity, artifact evidence, enabled capability, entitlement, and current
server facts.

## Compatibility

Do not infer support from a schema property alone. Typed-but-gated fields are
listed in [Capabilities and limits](./capabilities.md). V4 and the exact retained
V5 pair are public authoring contracts; unknown future pairs remain opaque.

These discovery routes do not announce a generally supported public REST API.
Use Console and the public CLI for customer workflows unless another endpoint
is explicitly documented as a stable product contract.
