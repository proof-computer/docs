# Verify a job's signing key

This directory checks three public facts about an Acurast job: the Ed25519 key a processor published for it, the artifact that job registered, and the processor's onboarding attestation. It does not talk to Liskov.

One key serves every consecutive job of the same application release on the same processor. Finding that key on another job is not a failure.

The docs check runs `verify.mjs` on `fixtures/job-409696.json`. That run is offline. `verify.mjs` imports only `node:` modules.

## Offline fixture

From this directory:

```bash
node verify-job-key.mjs --fixture fixtures/job-409696.json
```

The fixture records job 409696's decoded chain values. It does not contain the artifact bytes. The core's SHA-256 and CIDv0 checks for those bytes are covered by a known answer (`hello world` plus a newline). The live command below checks a real artifact.

## Live archive read

Install the pinned client, then give the job's origin account, job number, Ed25519 key, and artifact digest. The origin is the SS58 address, or the `0x` account id in `job.id` (`origin.source`). Add the two block numbers when you already have them; otherwise the script searches an archive node.

```bash
pnpm install --frozen-lockfile
node verify-job-key.mjs \
  --origin 5CqT7rJekrMPvzfkPb9iyV1XmHrYJ4nuFvn3cKo3P7tF438o \
  --job 409696 \
  --key 81eb8a4001c87f381e100cf7bd1013087e300e9f554c91f090997ad629e585ae \
  --artifact sha256:6233551c2914e8e20b3894efd52303037caabcf37d6c5a79fbc34fa466b5a245 \
  --registration-block 5447854 \
  --acknowledgement-block 5447858
```

The default endpoint is `wss://archive.mainnet.acurast.com`. Pass `--endpoint` to use another archive node. The script prints the facts it read as JSON. A pruned or latest-state node returns nothing for a job that has ended.
