---
title: Verify a job's signing key without Liskov
description: Check a job's signing key, artifact, and processor attestation from public Acurast data, with no Liskov account.
---

# Verify a job's signing key without Liskov

A Liskov application can sign its outputs with the job's Ed25519 key. Someone who never logs in to Liskov can still check three public facts: that key was published for this job, the job registered the artifact you expect, and the processor that published the key presented a certificate chain at onboarding.

:::info Preview
This is a public preview recipe, open to anyone. It runs on an Acurast archive node, Google's attestation roots, and an IPFS gateway. Liskov does not operate those, and it does not control Acurast's storage layout. Liskov serves no public endpoint for the facts only Liskov can state. The recipe is not a v1 Liskov service.
:::

## What you need

You need three values, and no Liskov account:

- the job id, which is the origin account plus the job number;
- the Ed25519 public key;
- the artifact digest (`sha256:` and 64 hex characters).

A running job can read its own id and keys. In the runtime SDK, `job.id` is the JSON text of Acurast's `_STD_.job.getId()`. Logged, that text looks like `{"origin":{"kind":"Acurast","source":"0x…"},"id":…}`. The key comes from `_STD_.job.getPublicKeys()`. The application can publish both beside its outputs. The example script takes the origin and the job number separately. Pass the SS58 address, or the `source` value from `job.id`. The check treats them as the same account. The artifact digest is step 2 of [Inspect the proof chain](./proof-chain.md).

## Find the job's blocks

Acurast deletes a job's match, assignment, and registration about an hour after the job ends. Every read is a historical read on an archive node, at a known block. A latest-state node returns nothing once that hour has passed.

You can find the two blocks from the job id alone.

The registration block is the first block whose `Acurast.LocalJobIdSequence` is at least the job number. That sequence only grows, so this is a binary search over block numbers.

The processor is the one `AcurastMarketplace.AssignedProcessors` lists for the job whose match holds the key. The acknowledgement block is the first block at or after the registration block where that processor's match is acknowledged. That is a second binary search.

Both blocks have to sit below the finalized head, and the genesis hash has to be Acurast mainnet:

`0x4b5f95eefedf0d0fb514339edc24d2d411310520f687b4146145bcedb99885b9`

The worked example below uses `wss://archive.mainnet.acurast.com`.

## Step 1: the key belongs to this job on this processor

At the acknowledgement block, read `AcurastMarketplace.StoredMatches` for that processor and job. The match is acknowledged, and its keys contain exactly one `ed25519` entry, equal to the key the application published. The processor is assigned to the job.

The same block contains an extrinsic signed by the processor: `acknowledgeMatch` or `acknowledgeExecutionMatch`, for this job, carrying those keys.

This shows that this job's acknowledgement published the key. It does not show that the key belongs to this job alone. See [one key per application release](#one-key-per-application-release-per-processor).

## Step 2: the job ran the artifact

At the registration block, read `Acurast.StoredJobRegistration` for the job. Its script is `ipfs://` followed by a CIDv0. Fetch those bytes from any IPFS gateway. The SHA-256 of the bytes is the artifact digest.

Recompute the CIDv0 from the same bytes (dag-pb UnixFS, one leaf, the default single chunk). The recomputed CID has to equal the script CID, so you do not have to trust the gateway.

That recompute is exact for one chunk, up to 256 KiB (262,144 bytes). A larger artifact needs the full UnixFS DAG rebuilt with the same chunker. The example script refuses that size instead of guessing a layout.

## Step 3: the processor is attested

`Acurast.StoredAttestation` for the processor is present at the acknowledgement block. Storage holds certificate identifiers, not the certificates. Find the block, at or before the acknowledgement, where that stored value first appeared (a third binary search). In that block, the processor's onboarding extrinsic is `acurastProcessorManager.onboard`, with an `AttestationStoredV2` event. The extrinsic carries the certificate chain, root first, and its serials are the stored certificate ids.

Check all of the following:

- the chain verifies against Google's published hardware attestation root (`https://android.googleapis.com/attestation/root`);
- every certificate is valid at the acknowledgement time;
- no serial is on Google's revocation list (`https://android.googleapis.com/attestation/status`) or on the chain's `StoredRevokedCertificate`;
- the BLAKE2b-256 of the leaf's compressed P-256 key equals the processor's account id.

The attested key is the account that signed the acknowledgement in step 1. The attestation is a one-time onboarding record. It is not refreshed for each job, and it covers the processor's account key, not the job key.

## What this does not prove

| Step | What it proves | What it does not prove |
| --- | --- | --- |
| 1. Key | This job's acknowledgement published this Ed25519 key, and the assigned processor signed that acknowledgement. | The policy digest that governed the deployment. It is not on chain. |
| 2. Artifact | The registered script is the artifact whose digest you were given. | That the launch account belongs to this application. |
| 3. Processor | The processor account presented a certificate chain at onboarding, and that account signed step 1. | Which of an application's keys are current. |

Those three are Liskov's claims. Liskov serves no public endpoint for them. Whether a key is current is Liskov's view, as of a stated time, on a read Liskov has not published here.

The chain cannot show that the job key was created inside a hardware boundary. For the job in the worked example, the honest statement is: signed by the key that attested processor 5FKoK8FcjEouy12D2LcJWxZU7TM6YYh6BRqQLqU8CkyR4MqX published for this job on chain; the key is held by Acurast's processor app, not hardware-attested.

## One key per application release per processor

Liskov registers each job as an immutable Acurast job. Acurast's processor app names an immutable job's keys by its launch account and its script, which is the artifact CID. Each application has its own launch account.

Every consecutive job of the same application release on the same processor therefore publishes the **same** key. One key can appear on many consecutive jobs.

The key changes when the application publishes a new release, because a new artifact is a new CID, or when the job runs on another processor. Keys never expire on the device. The processor keeps the old key, and a later job of the same release on that processor publishes it again.

A signature identifies the application release and the processor, not the individual job.

Anyone holding a leaked key can sign as that application release on that processor, for every job past and future that publishes it. A new release stops new jobs from publishing the leaked key. Moving the application to another processor does not retire it, because any later job of that release on the first processor publishes it again. Nothing on chain revokes it.

While a job runs, its match and registration are present at the finalized head. After the job ends, both are gone. Whether the application still treats a key as current is the application's view and Liskov's view only.

## When the check breaks

- A pruned node, or a latest-state node, returns nothing for a job that has ended. Use an archive node and the block numbers.
- Some public IPFS path gateways refuse the fetch. Another gateway can answer, and the CID recompute checks the bytes.
- The storage reads are the archive node's answers. They are not Merkle proofs against the block state root. Compare two endpoints when the result matters.
- The app-signing digest inside the attestation has no independent published reference. The certificate chain does not tell you that the processor was running an unmodified build.

## Worked example

These are public chain coordinates for Acurast job 409696. A read on 2026-11-21 recorded them.

| Fact | Value |
| --- | --- |
| Origin account | `5CqT7rJekrMPvzfkPb9iyV1XmHrYJ4nuFvn3cKo3P7tF438o` |
| Job number | 409696 |
| Ed25519 key | `81eb8a4001c87f381e100cf7bd1013087e300e9f554c91f090997ad629e585ae` |
| Registration block | 5447854 |
| Acknowledgement block | 5447858, extrinsic 68 |
| Acknowledgement hash | `0xda5cb192c10a8db76b12133f1e2ae32a8034bec40f12aad53ce3ef288547ae00` |
| Script | `ipfs://QmdmouagNWHsxAhVSALYt45Ha3fWuebWmf7H6nwY2hx6f1` |
| Artifact digest | `sha256:6233551c2914e8e20b3894efd52303037caabcf37d6c5a79fbc34fa466b5a245` |
| Artifact size | 42,891 bytes |
| Onboarding | block 1202890, extrinsic 19, on 2026-01-21 |

At the block before registration, `LocalJobIdSequence` was 409691. At block 5447854 it was 409696. At block 5447857 the match was not yet acknowledged. At block 5447858 it was acknowledged and held the Ed25519 key above. The match stayed until block 5448446 and was gone at 5448447.

Acurast Hub is a separate indexer. It can show the same job after the chain has deleted it. It does not show the key or the certificate chain. Use it as a second opinion, not as the proof:

- [Deployment 409696](https://hub.acurast.com/explorer/deployment/409696)
- [Processor address](https://hub.acurast.com/explorer/address/5FKoK8FcjEouy12D2LcJWxZU7TM6YYh6BRqQLqU8CkyR4MqX)
- [Acknowledgement extrinsic](https://hub.acurast.com/explorer/extrinsic/0xda5cb192c10a8db76b12133f1e2ae32a8034bec40f12aad53ce3ef288547ae00)

The example script is `examples/liskov-v1/verify-job-key/`. Its offline command checks the recorded fixture. Its live command repeats this read against an archive node. The directory README has both commands.
