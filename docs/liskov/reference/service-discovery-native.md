---
title: Native direct peer discovery (V5 candidate)
draft: true
description: The gated native workload contract for a signed direct IPv6 peer directory on retained V5 Applications.
---

# Native direct peer discovery

:::danger[Not released]

This is a candidate contract for upgraded native/Cargo jobs on a retained
`schemaVersion: 5` Application. It is not an available customer capability.
The server producer, immutable helper and application payloads, operator
readback, and live two-peer IPv6 proof must be accepted before release.
[Capabilities and limits](./capabilities.md) owns the support boundary.
JavaScript jobs and older helper images do not have this file integration.

:::

Direct discovery is an advisory directory of **currently observed** peer
endpoints in the same organization and Application. It does not choose
processors, guarantee IPv6 reachability, enumerate a complete cohort, elect a
leader, grant access, or preserve application state across replacement. A
retained V5 policy needs no new `ingress`, `cohort`, placement arm, variable,
or schema version. The existing
[V6 Tailscale discovery candidate](./service-discovery-v6.md) is a separate
`liskov.discovery.v1` path.

## Opt in from one native runtime

Before starting the child, the upgraded helper supplies:

| Environment variable | Meaning |
| --- | --- |
| `LISKOV_RUNTIME_INSTANCE_ID` | Verified identity of this runtime incarnation. The application cannot choose it. |
| `LISKOV_PEER_ADVERTISEMENT_FILE` | Private input path for one local service record. An absent file means no opt-in. |
| `LISKOV_PEER_DIRECTORY_FILE` | Private output path. It appears only after a complete valid v2 response. |

A non-Tailscale job does **not** receive the old `LISKOV_DISCOVERY_FILE`.
The helper keeps v1 for a Tailscale job with declared publications and reports
an attempted simultaneous direct advertisement as `conflict`.

After its HTTPS listener and certificate are ready, the workload atomically
replaces the advertisement input with one regular JSON file of at most 4 KiB.
The helper refuses symlinks, special files, extra fields, unsuitable names,
privileged ports and malformed fingerprints without stopping the workload.
The protocol is HTTPS; the file never accepts an IP, URL, app/job/runtime ID,
token or private key.

<!-- owner-fixture:advertisement -->
```json
{"schema":"liskov.peer-advertisement.v2","service":"swarm","port":8841,"ready":true,"tlsFingerprint":"sha256:a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1","peerSyncLastSuccessAtMs":1789999999000,"peerSyncFailureCode":"none"}
```

| Field | Meaning |
| --- | --- |
| `schema` | Exactly `liskov.peer-advertisement.v2`. |
| `service` | One name, 1–32 lowercase letters, digits or hyphens, starting with a letter. |
| `port` | Local TCP port 1024–65535 on the workload's IPv6-only TLS listener. |
| `ready` | The workload's own readiness statement. `false` withdraws this endpoint. |
| `tlsFingerprint` | `sha256:` followed by 64 lowercase hex characters: SHA-256 of the listener's leaf certificate DER. |
| `peerSyncLastSuccessAtMs`, `peerSyncFailureCode` | Optional application reports. The failure code is `none`, `connect`, `tls`, `auth`, `identity`, `exchange` or `discovery`. They are not platform-certified connectivity evidence. |

The helper clears the input before a supervised child restart and stops
reporting readiness after exit. A prior accepted observation keeps only its
original, at-most-90-second lease; the old process's file cannot renew it.

## Signed health and server authority

On the existing 30-second health cadence, the helper reads the local record
and signs a normal diagnostic-v4 `runtime.health` request with
`discoveryVersion: 2`, `peerService`, `peerPort`,
`peerTlsFingerprint` and `peerReady`. It may add the two application sync
summary fields. Existing freshness attributes include
`discoveryLastSuccessAtMs` (the last accepted server `observedAtMs`, absent
before the first success) and `discoveryRefreshFailed`. Bounded
`peerAdvertisementError` and `discoveryFailureCode` identify local and
response failures; `discoveryValidUntilMs` reports a still-valid snapshot.

Liskov binds the request to the verified org, Application, job and runtime
instance. Only Liskov's trusted ingress-observed **global-unicast IPv6**
address can become the advertised endpoint. A processor's old registry IP or
an address supplied by the workload is not endpoint authority. The server
admits an advertisement only from a newly accepted health sequence and
expires it no later than that accepted beat plus 90 seconds or the job's
scheduled end.

## Read the complete directory

The helper writes a v2 snapshot atomically as a mode-0600 file. This is the
owner's exact complete-directory vector; its address and identities are
examples, not a live target:

<!-- owner-fixture:directory -->
```json
{"schema":"liskov.discovery.v2","applicationUid":"app-0123456789abcdef0123456789abcdef","self":{"jobId":"job-a","runtimeInstanceId":"instance-a"},"revision":"sha256:bf5e498a50d24c02fb324778bf2c2accd47c3cfe59e082080443a58bc40d6da7","observedAtMs":1790000000100,"validUntilMs":1790000080000,"peers":[{"jobId":"job-b","runtimeInstanceId":"instance-b","service":"swarm","provider":"direct_ipv6","url":"https://[2606:4700:4700::1111]:8841/","tlsFingerprint":"sha256:a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1","observedAtMs":1790000000000,"validUntilMs":1790000080000}]}
```

`self.jobId`, `self.runtimeInstanceId` and `applicationUid` must match the
authenticated caller. `revision` is SHA-256 over the typed, ordered `peers`
array; compare it for equality. Each peer has a distinct current job and
runtime instance, one service, `provider: direct_ipv6`, an HTTPS IPv6-literal
base URL, the exact leaf-certificate pin, and its own observation and expiry.
Append only your application's exchange path to the URL. Authenticate the
application request as well as pinning the TLS certificate and checking the
expected runtime-derived peer identity.

At most 256 peers and 512 KiB are returned. The directory excludes self and
expired, terminal, superseded or unready observations; it can contain both
valid predecessor and successor jobs during replacement, even across policy
digests. It does not report total membership. Consumers must stop attempting
an endpoint at `validUntilMs`, even if its bytes remain in the file.

A complete empty snapshot is a successful removal of all peers:

<!-- owner-fixture:complete-empty -->
```json
{"schema":"liskov.discovery.v2","applicationUid":"app-0123456789abcdef0123456789abcdef","self":{"jobId":"job-a","runtimeInstanceId":"instance-a"},"revision":"sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945","observedAtMs":1790000000100,"validUntilMs":1790000080000,"peers":[]}
```

An accepted health beat can instead return an explicit unavailable result:

<!-- owner-fixture:unavailable -->
```json
{"schema":"liskov.discovery.v2","status":"unavailable","reason":"no_ipv6"}
```

Unavailable is not an empty directory. Missing v2 from an older server is
`unsupported`; malformed, stale and oversized snapshots are different
failures. None extends a prior lease or writes a successful empty file. The
helper preserves last-good bytes with their **original** expiry and reports a
bounded failure code on the next signed health beat. Application clients may
keep using only still-valid endpoints from that earlier file.

## Source and promotion boundary

These exact UTF-8 vectors come from `proof-computer/liskov-rs` commit
`417ea4103a9353e6920d8e834cee4f403c228548`. SHA-256 including the
trailing newline: advertisement
`f17b77e8c56512859aaaec8a6684b4e05dbd7d4fedbd83d945bb1d485fe7ce74`,
directory
`f1b51194ba9564e98ae035879598a33d3fe80a2389b5f75888e9a465ec012685`,
complete empty
`b1cfb303e7869e7dfcfc930afc73daa4d61bc3682c9b5052c44878dad3d3be1e`,
and unavailable
`2e751fae689173e15828648c6b54dbd04f08cb94731696ce78671b2a93f1e8d0`.
The application listener and sync implementation is
`proof-computer/liskov-planetarium` commit
`44578e88e213856772b2976dbd35ca649f62f851`; the helper source is
`proof-computer/liskov-runtime-cargo` commit
`fdd25375193aa147eb8548cfabef6a9b52569a50`.

Release gate BKLG-20261010-7rez must pin the immutable helper, runtime image,
application payload and serving producer identities, then record successful
two-way IPv6 exchange and the chosen support boundary. Until that gate
promotes these pages, no public availability follows from these source
commits.
