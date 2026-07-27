---
title: HTTP Ingress
description: Require a public HTTPS route and readiness path for a Liskov deployment.
---

# HTTP Ingress

A V4 policy requests the ingress capability it needs without authoring
provider-owned route, hostname, certificate, or session state.

## Request HTTP Ingress

```json title="liskov.json (excerpt)"
{
  "ingress": {
    "http": {
      "mode": "required",
      "port": 3000,
      "healthPath": "/health"
    }
  }
}
```

| Field | Meaning |
| --- | --- |
| `mode` | `required` makes a working route a launch requirement. `disabled` expresses no route. `optional` is typed but capability-gated. |
| `port` | Port the service listens on inside the job. |
| `healthPath` | Readiness path used to accept the exact successor runtime. |

Provider selection, public hostname, certificate identity, transport, and route
status are dynamic server-owned facts. They do not belong in an authored manifest.

## Readiness Responsibilities

Your service must:

- listen on the declared port;
- return success from `healthPath` only when it can accept real traffic;
- keep runtime diagnostics signed; and
- preserve identity-bound bootstrap and secret handling.

Readiness is lifecycle evidence. The earliest accepted ready event for the exact
successor job advances its stable slot generation.

## SSH

V4 also types SSH ingress:

```json
{
  "ingress": {
    "ssh": {
      "mode": "required",
      "port": 22
    }
  }
}
```

Simultaneous HTTP and SSH and optional ingress require explicit platform
capability.

## Baran

[Baran](/baran) remains the standalone secure-ingress product for supported
Acurast jobs. A Liskov policy does not name Baran as an implementor; product
binding and route state stay outside the immutable application policy.
