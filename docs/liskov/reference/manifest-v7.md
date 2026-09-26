---
unlisted: true
title: Application Manifest V7 reference
description: The exact V7 delta over V6 — public HTTP ingress through Acurast Tunnel or Cloudflare Tunnel, authored endpoint protection, and the Cloudflare integration.
---

# Application Manifest V7 reference

:::danger[Not released]

V7 is not released. No Application can publish a V7 manifest: no production
handler generation lists the V7 schema pair, so a document declaring
`schemaVersion: 7` is refused at publication.
[Capabilities and limits](./capabilities.md) owns what is available.
V7 is written as a delta over
[Application Manifest V6](./manifest-v6.md), which is not released either, and
[Retained Application Manifest V5](./manifest-v5.md) is the current version of
the Application manifest.

This page is written as though final so that the contract can be reviewed
before the release. Read it as a design, not as a surface you can reach.

:::

V7 is V6 with public HTTP ingress added and nothing removed:

- `integrations.cloudflare_tunnel`, an organization's own Cloudflare
  integration, declared once beside `tailscale`;
- two public endpoint providers, `acurast_tunnel` and `cloudflare_tunnel`,
  beside V6's private `tailscale`; and
- `protection` on those two public endpoints, stating what stands between
  someone who reaches the endpoint and the application behind it.

V7 is HTTP only. Every other field, default, bound, and convention is V6's,
unchanged. This page states only the delta;
[Application Manifest V6](./manifest-v6.md) documents private ingress, health
probes, SSH providers, placement filters, and spend units, and
[Retained Application Manifest V5](./manifest-v5.md) documents everything
older. Its *Conventions* section — unknown fields fail closed, closed tagged
unions, exact duration and byte-size spellings, money as decimal strings —
applies here in full.

## Contract identity

V7 is installed but authorized by no production handler generation, and nothing
is released or immutable until a generation lists the schema pair. Its
artifacts are regenerated from the current handler and corpus, so this page
names no digest.

| Artifact | Status |
| --- | --- |
| RC digest | Pinned when V7 is released |
| Manifest schema digest | Pinned when V7 is released |
| Effective-policy schema digest | Pinned when V7 is released |
| Corpus pin | Pinned when V7 is released |
| Production registration | Pinned when V7 is released |

## Root document

The root is V6's. Only the version changes:

| Field | Required | Type and rule |
| --- | --- | --- |
| `schema` | yes | `proof.liskov.application-manifest` |
| `schemaVersion` | yes | integer `7` |

`integrations` and `ingress` gain the arms below. `applicationId`, `metadata`,
`release`, `runtime`, `execution`, `deployment`, `access`, `configuration`,
`observability`, `state`, and `debug` keep their V6 meanings and bounds.

## `integrations`

Optional. It has two keys, each an organization-owned integration id: `int_`
followed by exactly 32 lowercase hexadecimal characters.

| Key | Consumed by |
| --- | --- |
| `tailscale` | V6's private endpoints and Tailscale SSH, unchanged |
| `cloudflare_tunnel` | Cloudflare Tunnel endpoints |

```yaml
integrations:
  tailscale: int_00000000000000000000000000000000
  cloudflare_tunnel: int_11111111111111111111111111111111
```

`acurast_tunnel` is not a key. Acurast Tunnel is not an integration the
organization owns: it is the processor's own tunnel, so declaring it is an
unknown field and fails closed.

## `ingress`

Optional. It still has one key, `http`, holding 1–8 services with 1–4
endpoints each. Service names, endpoint names, `localPort`, and `health` are
V6's, unchanged. A `tcp` or `udp` key is an unknown field.

### Endpoints

| Field | Required | Rule |
| --- | --- | --- |
| `name` | yes | V6's pattern; unique within its service |
| `provider` | yes | exactly one of three arms |
| `protection` | on a public provider | see [Protection](#protection) |

Several endpoints on one service mean several attachments wanted at the same
time, never a fallback chain. One service may mix private and public
endpoints.

### Providers

| `kind` | Reach | Authored fields |
| --- | --- | --- |
| `tailscale` | Private: the organization's own tailnet | optional `integrationId`, as in V6 |
| `acurast_tunnel` | Public: the internet, through the processor's Acurast Tunnel | none |
| `cloudflare_tunnel` | Public: the internet, through the organization's Cloudflare Tunnel | `hostname`, and an optional `integrationId` |

`acurast_tunnel` has no authored fields. Its hostname is derived by the
platform when the endpoint is attached, and it is not stable: V7 does not
promise a public URL that stays the same from one job to the next. Authoring a
`hostname` or a domain suffix on it is an unknown field.

```yaml
provider:
  kind: acurast_tunnel
```

`cloudflare_tunnel` needs a Cloudflare integration and a hostname. The hostname
is the public host the endpoint is served at: lowercase, 1–253 bytes, with no
control character, no `/`, and no `://`. It names a host, never a URL.

```yaml
provider:
  kind: cloudflare_tunnel
  hostname: dashboard.example.com
  # integrationId: int_… — optional override, see Provider resolution
```

Acurast or Cloudflare carries the public traffic. Liskov does not operate a
gateway or a tunnel of its own, and a Liskov-operated tunnel arm is refused as
an unknown provider kind.

## Protection

A tunnel makes an endpoint reachable. It does not decide who may use it. So a
public endpoint states its protection, and a document whose public endpoint
states none is refused at that endpoint's `protection` pointer.

| `protection` | Meaning |
| --- | --- |
| `provider_gated` | Cloudflare Access sits in front of the hostname and decides who gets through |
| `application_managed` | The application checks its own callers |
| `sidecar_gated` | An authenticating sidecar, supervised inside the job, sits in front of the application |
| `public_unauthenticated` | Anyone who reaches the endpoint reaches the application. Stated on purpose, never assumed |

Which values an endpoint may author depends on its provider:

| Provider | `protection` |
| --- | --- |
| `tailscale` | Not authored. Derived as `network_gated`, exactly as in V6; authoring it is an unknown field |
| `acurast_tunnel` | Required: `application_managed`, `sidecar_gated`, or `public_unauthenticated` |
| `cloudflare_tunnel` | Required: `provider_gated`, `application_managed`, `sidecar_gated`, or `public_unauthenticated` |

`provider_gated` is Cloudflare-only. Acurast Tunnel has no identity gate that
Liskov can verify, so `acurast_tunnel` with `provider_gated` is refused.
Liskov treats `provider_gated` as a claim to confirm, not to trust: publication
fails closed unless Cloudflare Access is verified to protect the hostname. That
verification has not yet been run against a live Cloudflare account.

## Provider resolution

V6's rule, now over two integration kinds. Every site that names a
`tailscale` or `cloudflare_tunnel` provider must resolve to an integration of
that kind: either `integrations.<kind>` is declared, or the site carries its
own `integrationId`, which overrides the declaration for that site alone.

A site that resolves to neither makes the document invalid, reported at that
site's own pointer, `/ingress/SERVICE/ENDPOINT/provider`. A job serves one
integration of each kind, so every site of one kind must resolve to the same
integration. `acurast_tunnel` names no integration and never needs one.

## `access.ssh`

`provider` keeps V6's two arms, `liskov_managed` and `tailscale`.
`acurast_tunnel` SSH remains refused.

As in V6, `liskov_managed` SSH cannot sit beside a private `tailscale`
endpoint: a job carries one access block. A public endpoint carries no tailnet
access block, so `liskov_managed` SSH beside only public endpoints is
accepted.

## Runtime requirement

Some capabilities need an out-of-process supervisor inside the job, which only
`runtime.kind: native_image` has. On `javascript`, each is refused at its own
pointer rather than accepted and left inert.

| Capability | `native_image` | `javascript` |
| --- | --- | --- |
| `tailscale` endpoint | yes | refused at the provider |
| `cloudflare_tunnel` endpoint | yes | refused at the provider |
| `acurast_tunnel` endpoint | yes | yes |
| `sidecar_gated` protection | yes | refused at the protection |
| `application_managed` or `public_unauthenticated` protection | yes | yes |
| `health` | yes | refused, as in V6 |
| any SSH provider | yes | refused, as in V6 |

`acurast_tunnel` is the one provider a JavaScript Application can publish
through, because it needs no supervised connector.

## Worked fragments

A JavaScript site served to anyone through the processor's Acurast Tunnel:

```yaml
runtime:
  kind: javascript
  engine: nodejs
  entrypoint:
    file: bundle.js

ingress:
  http:
    - name: http
      localPort: 8080
      endpoints:
        - name: public
          provider:
            kind: acurast_tunnel
          protection: public_unauthenticated
```

A native-image dashboard behind Cloudflare Access, at a hostname the
organization controls. The integration id is a placeholder, never a live id:

```yaml
integrations:
  cloudflare_tunnel: int_11111111111111111111111111111111

runtime:
  kind: native_image

ingress:
  http:
    - name: http
      localPort: 8080
      health:
        ready:
          http: /healthz
      endpoints:
        - name: edge
          provider:
            kind: cloudflare_tunnel
            hostname: dashboard.example.com
          protection: provider_gated
```

## Not in V7

The following remain absent from the exact V7 schema and are rejected as
unknown fields or closed-union arms:

- TCP and UDP ingress, including anonymous public raw TCP, which Liskov
  continues to decline;
- Acurast Tunnel SSH;
- a stable public URL across jobs, and an authored Acurast hostname or domain
  suffix;
- a Liskov-operated tunnel or gateway;
- `clientAccess` on an endpoint;
- `acurast_tunnel` as an integration; and
- every other item V6 defers, including cohort membership, join and drain
  hooks, durable state, and placement spread.
