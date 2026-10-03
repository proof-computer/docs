---
title: Job service discovery (V6 candidate)
draft: true
description: Candidate job-scoped discovery of declared private HTTP services, with runtime file delivery and explicit freshness.
---

# Job service discovery

:::danger[Not released]

This reference describes a release candidate. It is not an available customer
capability. It requires the V6 private endpoint release and a compatible Cargo
runtime helper. JavaScript does not receive the local file/proxy integration.

:::

Liskov supplies addresses of your application's declared private HTTP services
across its jobs. Your application chooses which service to use and supplies its
own API paths, authentication and collaboration protocol.

## Declare a service

Ports come from your policy, not from scanning the workload. This excerpt
assumes a configured Tailscale integration and a Cargo service listening on
loopback port 8840:

```yaml
ingress:
  http:
    - name: swarm
      localPort: 8840
      endpoints:
        - name: private
          provider:
            kind: tailscale
```

The helper publishes the declared port and reports Tailscale's actual assigned
DNS name. Liskov combines that observation with the service declaration to
return a base URL such as `http://liskov-abcd.tailtest.ts.net:8840/`.
Do not reconstruct the hostname from a job ID: names can be suffixed or renamed.

## Read the directory

The helper supplies these process environment variables for Tailscale workloads
with declared endpoints:

| Variable | Meaning |
| --- | --- |
| `LISKOV_DISCOVERY_FILE` | Private JSON file containing the last valid directory. |
| `LISKOV_PEER_PROXY` | Loopback SOCKS5 proxy URL, with `socks5h` for remote DNS. Present after network setup succeeds. |
| `LISKOV_RUNTIME_INSTANCE_ID` | Opaque identity of this runtime instance. |

The file first appears after a successful signed health check-in. Read it again
to receive replacement addresses; environment variables themselves are not a
changing peer list. Configure only your peer HTTP client to use the proxy.

The helper requests discovery with `attrs.discoveryVersion: 1` on signed v4
`runtime.health` diagnostics. The optional response field is `discovery`.
Older requests and applications without a matching private attachment receive
no new field. A failed discovery read does not fail an accepted health check-in.

The file's top-level fields are:

| Field | Meaning |
| --- | --- |
| `schema` | `liskov.discovery.v1` |
| `applicationUid` | The authenticated caller's application. |
| `self.jobId`, `self.runtimeInstanceId` | This caller's authenticated identities. |
| `revision` | Opaque content revision. Compare for equality, not numeric order. |
| `observedAtMs` | Time this directory was assembled, Unix milliseconds. |
| `peers` | Other eligible private attachments in the same application and integration. |

Each peer has `jobId`, an opaque attachment incarnation `instanceId`, and
`services`. Each service has `name`, `protocol` (`http`) and `endpoints`.
Each endpoint has `name`, `provider` (`tailscale`), `url`, `state` and
`observedAtMs` (nullable). URLs are base URLs; append your application route.
A service may have more than one named endpoint.

Pending endpoints have no observed URL. Published, ready and degraded states
retain the owner's observation semantics. Ready does not guarantee the caller's
ACL permits a connection, or that a particular application API request succeeds.
Stopping/stopped attachments and withdrawn endpoints are excluded. During
replacement overlap, both eligible instances can appear.

The response is bounded to 256 peers, 32 endpoints per peer and 512 KiB. It is
refused rather than silently truncated when a limit is exceeded.

## Freshness and failures

The helper validates the application, job and runtime-instance binding before
atomically replacing the file. Missing, failed, malformed and older responses
leave the last valid file intact. Check `observedAtMs`; a successful file read
alone does not mean discovery is current. A valid empty `peers` list is different
from an unavailable refresh.

This is an advisory directory of published services. It does not enumerate jobs
without a private attachment, grant access, establish stable cohort slots,
elect a leader, allocate spending rights, or provide quorum membership.
Your application still authenticates peers and decides how to handle stale views.

## Troubleshooting

- **File absent:** a first valid discovery response has not arrived. Check that
  the workload declares a private endpoint and its network setup succeeded.
- **Old timestamp:** keep the last known peers according to your application's
  stale-view policy, and inspect runtime health/discovery observations.
- **URL present but connection fails:** check publication state, local service
  readiness, tailnet permissions, and the peer client's proxy configuration.
- **New job cannot join:** check that both jobs use the same application,
  compatible private integration, service/endpoint names and application run credentials.
