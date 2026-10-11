---
title: Direct native peers are not connecting (V5 candidate)
draft: true
description: Gated, evidence-first checks for the native direct IPv6 directory and authenticated peer exchange.
---

# Direct native peers are not connecting

:::danger[Not released]

This page describes a native/Cargo V5 pilot contract, not a supported
customer feature. Its immutable helper, image/payload and serving API are
delivered to the internal Planetarium pilot. Live two-peer and
replacement/expiry acceptance remain owned by BKLG-20261010-7rez.
Do not use this draft
to start or retry a paid job. See
[Capabilities and limits](../reference/capabilities.md) for availability.

:::

Start with **both** jobs' bearer-protected `GET /api/v4/status`, their
private `LISKOV_PEER_DIRECTORY_FILE` values if present, and the accepted
runtime health time. Record each job and runtime-instance ID, the
`discovery.outcome`, `validUntilMs`, `direct_peer.listener_ready`,
`direct_peer.advertisement_error`, `direct_peer.rotation_error`, and each
`peers` link's `last_attempt_ms`, `last_success_ms` and bounded `error`.
Keep bearer tokens, private keys and raw signed health bodies out of shared
evidence. An application sync summary is application-reported; it is not
independent proof that TCP, TLS or record exchange succeeded.

| What you observe | Likely boundary | Safe next step |
| --- | --- | --- |
| The model is still loading, but `listener_ready: true` | Inference startup is separate from the peer listener. | Wait for the application's model status; check discovery and exchange independently. A slow model load does not call for another job start. |
| No `LISKOV_PEER_ADVERTISEMENT_FILE` or `LISKOV_PEER_DIRECTORY_FILE` environment variable | The running helper is older or does not supply the native v2 handoff. | Record the exact helper/image identity and use the owner release check. Do not invent the paths in policy variables. |
| Advertisement path exists but its file is absent; `discovery.outcome: absent` | The workload has not opted in, or the TLS listener has not published its record. | Check `direct_peer.enabled`, listener readiness and `advertisement_error`. A missing file is no opt-in, not a successful empty peer set. |
| `peerAdvertisementError: invalid`, `oversized` or `symlink` on signed health | The helper sent an error-only v2 health beat with no endpoint fields. Liskov can retain the refusal and return typed `unavailable`; it is not `complete_empty`. Old directory bytes keep only their original expiry. | Write one bounded regular file atomically with a lowercase service, port 1024–65535 and `sha256:` leaf-DER pin; remove extra fields. Do not extend or reuse an expired old directory. Keep private material out of the file. |
| `peerAdvertisementError: conflict` | A Tailscale v1 publication and direct input were selected together. | Choose the intended transport. Preserve the V1 path for the old workload; do not rename `LISKOV_DISCOVERY_FILE` as a direct output. |
| Health is accepted but no v2 response or directory appears | The serving API or helper did not negotiate `liskov.discovery.v2`. With a valid local file, a later beat may report `discoveryFailureCode: unsupported`; an error-only beat keeps only its local `peerAdvertisementError` and tracks `unsupported` inside the helper. | Record the serving revision and released helper identity for the owner gate. A missing v2 response is not an empty directory. |
| `discovery.outcome: unavailable` or the server reason is `no_ipv6` | The accepted request lacked a suitable current global-unicast IPv6 ingress address. | Check each selected processor's current IPv6 path with the operator. A registry IP, a generic coverage probe or a Tailscale proxy is not this job's endpoint authority. |
| `discovery.outcome: complete_empty` | The server returned a complete valid set with no eligible peers. | Check the other job's current application UID, runtime incarnation, readiness and original lease. This is a valid empty set, not an outage. |
| `discovery.outcome: expired`, `discoveryFailureCode: stale`, or `validUntilMs` is past | No new lease has been accepted. Last-good file bytes may remain. | Stop attempts to expired URLs; wait for a fresh signed health response. Record both original expiry and any replacement runtime ID. Do not extend the timestamp locally. |
| `discoveryFailureCode: invalid` or `oversized` | A response failed binding, schema, revision or size checks. | Keep last-good bytes only until their original expiry. Record the bounded code and serving revision; do not treat an invalid response as an empty set. |
| A current peer URL is present but `peers[otherRuntime].error: connect` | TCP or IPv6 reachability failed before application auth. | Check the other job's IPv6-only listener and declared port, then the observed pairwise network path. Do not expose the website router or add a plaintext/proxy fallback. |
| `error: tls` | The certificate pin, TLS handshake or certificate validity failed. | Compare the directory's `tlsFingerprint` with the other listener's current leaf-DER fingerprint and check for key rotation. Never disable pin or signature verification. |
| `error: auth` | The remote peer rejected the application bearer. | Verify the two jobs use the intended application credential through the owner's secret path. Do not paste or log the bearer. |
| `error: identity` | The exchange reply's peer/run/protocol identity did not match the expected runtime incarnation. | Compare the directory job/runtime IDs, the expected peer ID and both run IDs. Discard old pools and cursors after replacement or pin change. |
| `error: exchange` | TLS and authentication reached the application, but the bounded record exchange failed. | Read each job's sanitized application error and retry only on the normal sync cadence. Verify the actual record IDs on both sides. |

The [native v2 reference](../reference/service-discovery-native.md) gives the
literal field and expiry contract. The
[two-peer verification guide](../guides/native-peer-discovery.md) names the
four record reads needed for a successful pilot. A ready listener, signed
health beat, IPv6 observation or one-sided last-success time alone does not
prove two-way sync.

The operator readback delivered under BKLG-20261011-hllu exposes absent,
not-ready, no-IPv6, refused and expired observations without presenting them
as verified reachability. The owner release session must capture that read
alongside the application receipts for internal acceptance. Public promotion
also requires an explicit customer support boundary; the internal pilot does
not remove these pages' draft or unlisted gates.
