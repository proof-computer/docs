---
title: Verify two native peers (V5 candidate)
draft: true
description: A gated two-job check for direct IPv6 discovery, pinned TLS and authenticated record exchange.
---

# Verify two native peers

:::danger[Not released]

This is a reviewable pilot procedure, not a supported customer launch path.
Source merges alone do not identify the immutable helper, runtime image or
Planetarium payload that a job runs. BKLG-20261010-7rez owns their release,
the exact eligible Application, any paid launch or resume, and the live IPv6
readback. Do not start a paid job from this draft.
[Capabilities and limits](../reference/capabilities.md) remains the public
availability owner.

:::

The [native v2 contract](../reference/service-discovery-native.md) works with
a retained `schemaVersion: 5` Application. It adds runtime metadata, not a
new policy field. These steps use two **native/Cargo** jobs in one Application
and one application service, `swarm`. JavaScript and older images are outside
this candidate.

## Before an owner-authorized pilot

Record the exact released helper, runtime image and application payload
identities; the serving Liskov revision; the Application UID and published V5
policy digest; both job IDs and runtime-instance IDs; two stable processor
slots with even phasing so the jobs overlap; and the expected cost and
schedule. A source commit or passing offline test is not a released identity.
Confirm the owner has
authorized the deployment and its spend.

Each job needs outbound access to the other job's **global-unicast IPv6** and
an application bearer shared by these two peers. Direct mode uses a separate
IPv6-only HTTPS listener (Planetarium's default is `[::]:8841`); the normal
website/admin API stays on loopback port 8840. Configure `direct_peer: true`
in the native application's own candidate payload. Do not put an IP, peer URL,
helper path, runtime ID, `ingress` field or Tailscale integration into the
retained V5 policy to make this work. Placement does not promise reachability:
the two processors and their network path must be observed in the pilot.

Preparing files and reading status has no Liskov charge. Publishing or
starting another scheduled job can reserve and spend Service Credits; only
the separately authorized owner release session performs that step.

## 1. Wait for each listener and advertisement

On **both** jobs, read the existing bearer-protected
`GET /api/v4/status` from that job's normal admin origin. The
`direct_peer.enabled` and `direct_peer.listener_ready` fields must be
`true`; record `direct_peer.listener_port` and
`direct_peer.tls_fingerprint`. The public `/healthz` alone shows only that a
listener process is alive. It does not prove authentication or peer exchange.

The application writes its one-service advertisement only after the listener
and ephemeral TLS identity are ready. The helper then reads the private
`LISKOV_PEER_ADVERTISEMENT_FILE` on a signed health beat. Confirm there is
no `direct_peer.advertisement_error` or
`direct_peer.rotation_error`. A model may still be loading while the
listener is ready; do not infer peer failure from pending inference startup.

## 2. Check both complete directories

Read each job's private `LISKOV_PEER_DIRECTORY_FILE` or its authenticated
status projection after the first successful health response. On A, the
directory's `self` must be A and a peer must identify B's exact job and
runtime incarnation; on B, the converse must hold. Both must name the same
`applicationUid` and `swarm` service. The peer URL must be HTTPS with an
IPv6 literal and port 8841; the `tlsFingerprint` must match that listener's
reported leaf-DER hash. Each `validUntilMs` must still be in the future.

In `GET /api/v4/status`, `discovery.outcome` should become `complete`
and `discovery.targets` should show the other job's expected runtime-derived
peer ID and expiry. `complete_empty` is a valid directory with no peers;
`unavailable`, `absent` and `expired` are different outcomes. An IPv6
address in a directory is an observation, not proof of a TCP connection.
Inspect both jobs: one-sided discovery is not a two-peer result.

## 3. Prove authenticated exchange in both directions

Use each peer's normal **bearer-protected admin origin**, never its direct
IPv6 listener, to create a distinct `save_note` action through
`POST /api/v4/actions`. Give the actions distinct operation IDs and record
the returned record IDs as A and B. The request's application action has this
shape; keep the bearer out of logs and shared evidence:

```json
{
  "operation_id": "pilot-note-a-unique",
  "action": {
    "tool": "save_note",
    "arguments": {
      "text": "Peer A pilot record",
      "evidence_ids": []
    }
  }
}
```

Each note mutates the application store and can consume its write allowance.
Use one bounded note per side for this check.

After at least one application sync cadence, read **both**
`GET /api/v4/status` responses. Each `peers` map must show a recent
`last_success_ms` for the other runtime and `error: null`. Then read
`GET /api/v4/research/{id}` for **both returned record IDs from both
admin origins**. A successful pilot has matching A and B record IDs on both
sides, with the same record contents. A signed health beat, a ready SSH
attachment, or matching directory entries alone cannot substitute for these
four record reads.

The TLS client must pin each endpoint's exact certificate, and the exchange
reply must match the expected runtime-derived peer ID, run ID, protocol and
application bearer. The app reports `peerSyncLastSuccessAtMs` after a
completed exchange; that summary is application-reported evidence, not an
independent platform connectivity test. Preserve the authenticated status
and record readbacks for the owner gate.

## 4. Exercise withdrawal or replacement

At the owner-selected point, stop or replace one job. Its old advertisement
cannot renew after the child exits. Do not attempt its endpoint after the
original `validUntilMs` (at most 90 seconds after its last accepted health
beat, or earlier at scheduled end). A replacement has a new runtime-instance
ID and ephemeral certificate pin; clients must discard the prior connection
and sync cursor for that endpoint. During a valid overlap, predecessor and
successor may both appear. This procedure does not promise complete membership
or survival of a record that neither peer retained.

If any check fails, use the
[direct-peer troubleshooting matrix](../troubleshooting/peer-connectivity.md)
and report the exact stage and bounded code. Do not publish a new policy,
change spend, or add a proxy to hide a missing IPv6 path.

## Promotion handoff for BKLG-20261010-7rez

The owner release session must fill in the immutable helper/runtime image and
payload digests, serving API revision, eligible Application and support
audience, authorized spend, actual IPv6 reachability for each pair, the four
record readbacks, and expiry/replacement refusal. Only then remove the
`draft` and **Not released** notices, change the
[capability row](../reference/capabilities.md), add normal navigation, and
deploy/read back these exact routes:

- `/liskov/reference/service-discovery-native`;
- `/liskov/guides/native-peer-discovery`;
- `/liskov/troubleshooting/peer-connectivity`.

The JavaScript and V6 Tailscale support boundaries stay separate.
