---
title: Native direct peer discovery (V5 candidate)
draft: true
description: The gated native workload contract for a signed direct IPv6 peer directory on retained V5 Applications.
---

# Native direct peer discovery

:::danger[Not released]

This is a candidate contract for upgraded native/Cargo jobs on a retained
`schemaVersion: 5` Application. It is not an available customer capability.
The immutable helper, runtime image/payload, serving producer and operator
readback are delivered to the internal Planetarium pilot. Live two-peer IPv6
and replacement/expiry acceptance remain pending. Customer promotion requires
a separate supported audience and complete customer path; these pages stay
draft and unlisted for the internal pilot.
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

On the existing 30-second health cadence, the helper reads a valid local
record and signs a normal diagnostic-v4 `runtime.health` request with
`discoveryVersion: 2`, `peerService`, `peerPort`,
`peerTlsFingerprint` and `peerReady`. It may add the two application sync
summary fields. Existing freshness attributes include
`discoveryLastSuccessAtMs` (the last accepted server `observedAtMs`, absent
before the first success) and `discoveryRefreshFailed`. Bounded
`peerAdvertisementError` and `discoveryFailureCode` identify local and
response failures; `discoveryValidUntilMs` reports a still-valid snapshot.

If the local file is invalid, oversized or a symlink, the helper instead
signs an **error-only v2** health beat: `discoveryVersion: 2` and the bounded
`peerAdvertisementError` (`invalid`, `oversized` or `symlink`), with no
endpoint, sync or response-freshness fields. The two process ordinals remain
in the ordinary health attrs; existing bounded memory and thermal summaries
may also be present. This exact four-attr owner request vector uses a dummy
`signature` value; a real beat is signed by the runtime bridge:

<!-- owner-fixture:signed-error-health-request -->
```json
{"applicationUid":"app-0123456789abcdef0123456789abcdef","attrs":{"discoveryVersion":2,"peerAdvertisementError":"invalid","processAttempt":1,"restartCount":0},"code":null,"component":"runtime-cargo-supervisor","domain":"proof.liskov.runtime-diagnostic.v4","jobId":"job-a","message":null,"processorId":"processor-a","runtimeInstanceId":"instance-a","sequence":7,"signature":"00","stage":"runtime.health","status":"info","timestampMs":1790000000000}
```

The canonical signing bytes are the same object without `signature`:

<!-- owner-fixture:signed-error-health-canonical -->
```json
{"applicationUid":"app-0123456789abcdef0123456789abcdef","attrs":{"discoveryVersion":2,"peerAdvertisementError":"invalid","processAttempt":1,"restartCount":0},"code":null,"component":"runtime-cargo-supervisor","domain":"proof.liskov.runtime-diagnostic.v4","jobId":"job-a","message":null,"processorId":"processor-a","runtimeInstanceId":"instance-a","sequence":7,"stage":"runtime.health","status":"info","timestampMs":1790000000000}
```

Liskov records the bounded refusal without publishing an endpoint and returns
typed v2 `unavailable`, normally with `reason: invalid`. The helper cannot
write a complete directory from that beat, even if a server sends one by
mistake. Earlier last-good bytes keep only their original expiry. An older
server that omits v2 yields an internal `unsupported` outcome; the local
error-only beat stays narrow. Once the file is valid again, a normal direct
beat can report `discoveryFailureCode: unsupported`. A missing file remains
no opt-in, and a Tailscale conflict keeps the separate v1 form.

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

The base UTF-8 vectors come from `proof-computer/liskov-rs` commit
`417ea4103a9353e6920d8e834cee4f403c228548`. The error-only signed vectors
come from its amendment `6add59728348fc548712441fd3474cce20e83482`,
merged at `8a6341913589a35aaa69a9890a427030aab0ee38`. SHA-256 including the
trailing newline: advertisement
`f17b77e8c56512859aaaec8a6684b4e05dbd7d4fedbd83d945bb1d485fe7ce74`,
directory
`f1b51194ba9564e98ae035879598a33d3fe80a2389b5f75888e9a465ec012685`,
complete empty
`b1cfb303e7869e7dfcfc930afc73daa4d61bc3682c9b5052c44878dad3d3be1e`,
and unavailable
`2e751fae689173e15828648c6b54dbd04f08cb94731696ce78671b2a93f1e8d0`.
The signed error-only request is
`776f442927f3c951f2e134dba19e84a9dbb4ecbe22377645c7052001c4086ac4`;
its canonical bytes are
`59d39043c6c982c3ba4d176451e9fddcd3d942df41df5358219f31654069f0d2`.
The original application listener and sync source is
`proof-computer/liskov-planetarium` commit
`44578e88e213856772b2976dbd35ca649f62f851`; the original helper source is
`proof-computer/liskov-runtime-cargo` commit
`fdd25375193aa147eb8548cfabef6a9b52569a50`, amended by
`99b71fe6a58a719f687a451c3c527916fb969524` and merged at
`7ea72c085495ead23831648540c2f8b1bd64ea0c`.

## Internal pilot release check

The owner chose an **internal Planetarium pilot** on 2026-10-11. This
2026-10-12 check separates verified artifacts, guarded publication and the
partial physical pilot result. Artifact verification alone does not establish
which bytes each running job uses or successful peer exchange.

| Release identity | Recorded value |
| --- | --- |
| Native helper | Immutable [v0.12.2](https://github.com/proof-computer/liskov-runtime-cargo/releases/tag/v0.12.2), source `e2d1e2d8ce1321b18a2cc27c12da0580cdbd8e9a`, published AArch64 binary SHA-256 `bfb3a7d0274d9560d39154d11b9f3c1ea4b4a925c96c99167b43597f9299f6ba`, 5,443,080 bytes; release schema version 2 / contract epoch 1 |
| Application payload | [Payload workflow](https://github.com/proof-computer/liskov-planetarium/actions/runs/38230575462), Planetarium source `e91f955b55aee9f8f487a373922fc68df50743ce`, SHA-256 `58f868535961f3c3cb3c236c8093f3b17d28d472c6a539fd3f2828ce0b412cfc`; all 42,869,398 bytes and 11 gateway parts independently verified |
| Runtime image | [Image workflow](https://github.com/proof-computer/liskov-planetarium/actions/runs/38230579937), digest `sha256:081b64aa28048938475f70962ffa8a9d08ad4276a6cbfef63f7679cb2c9184e7`; downloaded bytes match the workflow, canonical artifact, captured upload session and bootstrap descriptor |
| Pinned runtime artifact/bootstrap | Digest `sha256:e53fd78968d02b2e97245d9108a2522051d2d60b9f08e29fab800ea774a82427`; independent archive extraction matches the actual published helper binary above and the captured source/toolchain tuple |
| Guarded internal publication | `planetarium-v12`, schemaVersion 5, pointer 12 → 13 at 10:48:05 UTC, policy digest `d37fda1a9bb41fcaaba8a275478e4316b9f846dce33647f3670809869501c49f`; pinned-document source [9d9e1d0248fb9d3e8eda61a77849b973940944ff](https://github.com/proof-computer/liskov-planetarium/commit/9d9e1d0248fb9d3e8eda61a77849b973940944ff). The 10:48:30 UTC read confirmed active pointer 13 and artifact `e53fd789…` |
| Latest dated policy | At 12:18:23 UTC, owner pin-list edits had advanced the policy to pointer 15 / `planetarium-v14`, digest `d753e0c15ac98b5e22a7f7e18a8a70ed9a6a303c0b9f89736d3af04c8f24396f`, with the same artifact, 45-minute windows, two evenly phased slots and five processor pins after removal of the Warsaw pin. No four-hour change was made |

The captured upload session records helper version, target, binary digest,
source commit and toolchain. Its exact tuple matches the verified immutable
release; schema version 2 / contract epoch 1 come from that release manifest,
rather than additional fields inferred in the session.

The initial physical collector ran from 10:48:52 to 12:18:52 UTC and ended
without a proven peer pair, advancing reciprocal success or replacement.
Slot 0's London job `281455`, registered at 12:00:39 UTC, had a ready TLS
listener on port 8841 and a valid `complete_empty` v2 directory at 12:14 UTC.
That proves listener/directory readiness for one slot, not authenticated record
exchange between two slots.

Slot 1's FRX job `281445` retained a signed nonzero process exit (`exitCode: 1`)
and ordered application output reporting insufficient available memory after
input/model download and before the inference/peer children started. The
[published artifact's admission guard](https://github.com/proof-computer/liskov-planetarium/blob/e91f955b55aee9f8f487a373922fc68df50743ce/src/deployment.rs#L370-L383)
compares `/proc/meminfo` `MemAvailable` with the payload floor of 7,168 MiB;
the placement minimum is 10 GiB of total memory. Those are different checks.
The exact available-memory value and model peak RSS were not recorded, so this
readback does not establish model fit or the amount of additional headroom
required.

The server's composed signed-health/PostgreSQL proof remains offline evidence.
Actual two-way authenticated IPv6 record exchange, matching imported record
IDs and replacement/expiry refusal remain pending under BKLG-20261010-7rez.
Existing jobs can still use an earlier helper or payload;
check both jobs' exact identities rather than inferring them from the active
policy pointer. The internal support choice keeps these pages draft and
unlisted even after internal live acceptance. No public availability follows
from source, artifact delivery or internal publication.
