---
title: Get support
description: Collect a useful non-secret Liskov support bundle and know what never to include.
---

# Get support

Start from the organization Action Plan. If its supported action does not
resolve the issue or no customer action exists, collect one precise,
non-secret bundle.

## Include

- organization ID and name;
- Application UID and readable ID/name;
- effective policy version and digest;
- artifact-version ID, CID, and digest;
- deployment ID, job ID, processor ID, and runtime-instance ID where relevant;
- current posture category/reason and Action Plan decision ID;
- condition class, disposition, next action, and exact error code;
- retirement/transaction/reserve IDs when relevant;
- UTC timestamps and the last known-good time;
- GitHub run URL, commit SHA, and workflow reference for build issues; and
- redacted `--json` output or screenshots with the surrounding labels.

Useful reads:

```bash
proof liskov whoami --json
proof liskov application status APPLICATION_ID --json
proof liskov application action-plan APPLICATION_ID --json
proof liskov application deployment status APPLICATION_ID --json
proof liskov application activity APPLICATION_ID --limit 50 --json
```

Remove unrelated user identity and billing details before attaching them.

## Never include

- CLI session/bearer tokens or local session files;
- managed secret plaintext, encrypted grant payloads, or private keys;
- GitHub, Telegram, IPFS, Stripe, or external API credentials;
- card number, security code, or full payment instrument;
- full credential-bearing URLs;
- raw environment dumps; or
- unredacted application logs merely because they are encrypted at rest.

## Describe the problem

State the expected outcome, observed outcome, exact first failing stage, and
one reproduction. Mention actions already taken and whether any action could
spend. Do not keep retrying while waiting for support.

Support should answer with a customer-supported next action or an explicit
platform investigation. It should not ask you to run internal repair commands.
