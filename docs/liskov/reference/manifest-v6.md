---
unlisted: true
title: Application Manifest V6 reference
description: The exact V6 delta over retained V5 — integrations, private HTTP ingress and health, SSH providers, manager placement filters, and self-custody spend.
---

# Application Manifest V6 reference

:::danger[Not released]

V6 is not released. No Application can publish a V6 manifest: no production
handler generation lists the V6 schema pair, so a document declaring
`schemaVersion: 6` is refused at publication.
[Capabilities and limits](./capabilities.md) owns what is available, and
[Retained Application Manifest V5](./manifest-v5.md) is the current version of
the Application manifest.

This page is written as though final so that the contract can be reviewed
before the release. Read it as a design, not as a surface you can reach.

:::

V6 is V5 with five authored arms added and nothing removed:

- `integrations.tailscale`, an organization's own Tailscale integration,
  declared once;
- `ingress.http`, named local services published privately to that tailnet,
  with liveness and readiness probes;
- `access.ssh.provider.kind: tailscale`, beside V5's managed provider;
- `deployment.placement.allow` and `exclude`, over the processor's on-chain
  manager id; and
- `deployment.spend.unit: acu_planck`, beside V5's Service Credits.

Every other field, default, bound, and convention is V5's, unchanged. This
page states only the delta; [Retained Application Manifest V5](./manifest-v5.md)
documents the rest, and its *Conventions* section — unknown fields fail closed,
closed tagged unions, exact duration and byte-size spellings, money as decimal
strings — applies here in full.

## Contract identity

V6 is installed but authorized by no production handler generation, and nothing
is released or immutable until a generation lists the schema pair. Its
artifacts are regenerated from the current handler and corpus, so this page
names no digest.

| Artifact | Status |
| --- | --- |
| RC digest | Pinned when V6 is released |
| Manifest schema digest | Pinned when V6 is released |
| Effective-policy schema digest | Pinned when V6 is released |
| Corpus pin | Pinned when V6 is released |
| Production registration | Pinned when V6 is released |

## Root document

The root is V5's, with two optional keys added:

| Field | Required | Type and rule |
| --- | --- | --- |
| `schema` | yes | `proof.liskov.application-manifest` |
| `schemaVersion` | yes | integer `6` |
| `integrations` | no | organization-owned integrations, keyed by provider kind |
| `ingress` | no | private workload traffic |

`applicationId`, `metadata`, `release`, `runtime`, `execution`, `deployment`,
`access`, `configuration`, `observability`, `state`, and `debug` keep their V5
meanings and bounds.

## `integrations`

Optional. It has one key, `tailscale`, whose value is the organization's own
Tailscale integration id: `int_` followed by exactly 32 lowercase hexadecimal
characters.

```yaml
integrations:
  tailscale: int_00000000000000000000000000000000
```

The integration is declared once and referenced below by provider kind. Stating
it at every use site produces copies that can disagree, and the failure mode is
peers and operators landing on different tailnets. Any other key — a second
provider, for example — is an unknown field and fails closed.

## `ingress`

Optional. It has one key, `http`, holding 1–8 services. A `tcp` key is an
unknown field.

### Services

| Field | Required | Rule |
| --- | --- | --- |
| `name` | yes | matches `[a-z0-9][a-z0-9-]{0,30}`; unique across `ingress` |
| `localPort` | yes | the port the application listens on inside the job, 1–65535 |
| `endpoints` | yes | 1–4 endpoints |
| `health` | no | liveness and readiness for this service |

Names are bounded and unique so that every attachment has one stable pointer
for digests and diagnostics.

### Endpoints

| Field | Required | Rule |
| --- | --- | --- |
| `name` | yes | same pattern as a service name; unique within its service |
| `provider` | yes | exactly one arm |

The provider has one arm, and it is private:

```yaml
provider:
  kind: tailscale
  # integrationId: int_… — optional override, see Provider resolution
```

Several endpoints on one service mean several attachments wanted at the same
time, never an undocumented fallback chain.

There is no `protection` field and no authored hostname. Protection is
**derived**: a V6 endpoint is `network_gated`, reachable only on the
organization's own tailnet and governed by that tailnet's own access rules.
Authoring `protection` is an unknown field.

### `health`

Optional per service. It carries `live`, `ready`, or both; a `health` block
with neither probe is refused at its own pointer.

`live` answers whether the process is up. `ready` answers whether it is serving
correctly, which is a different question.

Each probe is exactly one of three shapes, and the shape is the discriminator —
no `kind` field states the same fact twice:

| Shape | Rule |
| --- | --- |
| `{http: PATH, contains: TEXT}` | `PATH` starts with `/` and is at most 256 characters drawn from ``A-Za-z0-9._~!$&'()*+,;=:@%/?-``. Success is a 2xx response; when `contains` is given, its body must also contain that substring. `contains` is optional. |
| `{tcp: PORT}` | A TCP connect to a local port, 1–65535. |
| `{exec: [ARG, …]}` | Run a command in the job, 1–32 arguments, none of them empty. Healthy on exit status zero. |

Probe timeouts and intervals are platform-owned and are not authored.

## Provider resolution

Every site that names a provider must resolve to an integration. A site
resolves when `integrations.tailscale` is declared, or when the site carries
its own `integrationId`, which overrides the declaration for that site alone —
for the uncommon case of two integrations of one kind.

A site that resolves to neither makes the document invalid, reported at that
site's own pointer: `/ingress/SERVICE/ENDPOINT/provider` for an endpoint, or
`/access/ssh/provider` for SSH.

## `access.ssh`

`provider` has two arms at V6:

| `kind` | Meaning |
| --- | --- |
| `liskov_managed` | Exactly as V5: Liskov brokers the session without being able to read it |
| `tailscale` | The job joins the organization's own tailnet, and Liskov never holds the session. Takes an optional `integrationId` override |

`acurast_tunnel` remains refused.

## Runtime requirement

Any SSH provider, any ingress endpoint, and any `health` block are valid only
with `runtime.kind: native_image`. They need an out-of-process supervisor
inside the job, and the JavaScript runtime has none, so on `javascript` each is
refused at its own pointer rather than accepted and left inert.

## `deployment.placement`

`minimums` and `processorSelection` are V5's, unchanged. V6 adds two optional
eligibility filters:

| Field | Rule |
| --- | --- |
| `allow` | 1–8 rules. A candidate must match to remain eligible |
| `exclude` | 1–8 rules. Any matching rule removes the candidate |

A rule is `{by: manager, values: [...]}` with 1–64 values, each 1–128
characters. `manager` — the processor's on-chain manager id — is the only
dimension V6 admits, so an author can target their own fleet:

```yaml
placement:
  allow:
    - by: manager
      values: ["42"]
```

At most one `allow` rule per dimension, so there is no hidden merge precedence.
One id may not appear in both lists for the same dimension.

`operator`, `country`, and `region` are refused, and filtering by WAN address
is never authorable — it would require an author to enumerate processor
addresses, which they must not.

The filters fail closed. Only a **current** manager id satisfies a filter;
a processor whose manager cannot be established is refused under an `allow`
and under an `exclude` alike, because an unread, unpaired, or invalidated
manager is not evidence that a processor sits outside an excluded fleet.

## `deployment.spend.unit`

| `unit` | Who pays |
| --- | --- |
| `service_credit_micros` | Managed custody, as V5: Liskov's Service Credits pay |
| `acu_planck` | Self-custody: the organization's own ACU pays the chain, through its own paired signer |

`perJob` and `rate.amount` are V5's exact decimal strings and are denominated
in the unit named. `rate` is still required when execution is recurring, and
`rate.window` still defaults to `30d`.

## A worked fragment

From the reference application the V6 delta was designed against — a private
analytical database reached over the customer's own tailnet, with no public
surface. The integration id below is a placeholder, never a live id:

```yaml
integrations:
  tailscale: int_00000000000000000000000000000000

runtime:
  kind: native_image

ingress:
  http:
    - name: http
      localPort: 8123
      health:
        live:
          http: /ping
        ready:
          http: /replicas_status
      endpoints:
        - name: private
          provider:
            kind: tailscale

access:
  ssh:
    provider:
      kind: tailscale
```

## Deferred to a future policy version

The following remain absent from the exact V6 schema and are rejected as
unknown fields or closed-union arms:

- public or provider-owned ingress, including Cloudflare and the Acurast
  tunnel;
- TCP ingress;
- authored endpoint protection;
- integrations other than Tailscale;
- cohort membership and discovery;
- join and drain hooks;
- durable state — `state.mode` still has only `off`;
- placement spread, distribution, and geography; and
- Acurast-tunnel SSH.
