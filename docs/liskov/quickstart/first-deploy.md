---
title: First Deploy
description: Write a liskov.json, preflight, and run your first custody execution.
---

# First Deploy

This page takes a GitHub Node.js webserver from a policy file to a running,
sealed deployment on an Acurast phone.

## 1. Declare The App

Liskov reads a `liskov.json` application policy. A minimal Node.js web app looks
like this:

```json title="liskov.json"
{
  "domain": "proof.slipway.application-policy.v3",
  "applicationId": "my-app",
  "displayName": "My App",
  "replicas": 1,
  "source": {
    "provider": "github",
    "repository": "my-org/my-app",
    "branch": "main",
    "path": "liskov.json"
  },
  "runtime": {
    "role": "web",
    "runtime": "NodeJSWithBundle",
    "durationMs": 900000,
    "resources": { "memory": 256, "storage": 128, "networkRequests": 0 },
    "replacementRunwayMs": 600000,
    "desiredCount": 1
  },
  "acurast": {
    "verifiedOnly": false,
    "maxStartDelayMs": 300000,
    "budgetCaps": {
      "maxRewardPerLaunch": 50000000000,
      "maxNativeFeePerLaunch": 10000000000
    },
    "quote": { "required": true }
  },
  "ingress": {
    "mode": "required",
    "implementor": "baran",
    "port": 3000,
    "protocol": "https",
    "tlsMode": "job-owned",
    "healthPath": "/health"
  }
}
```

Every field is documented in the [policy schema reference](../reference/policy-schema.md).
The `domain` string is a stable contract identifier and does not change with the
brand.

## 2. Import And Publish

Register the app from GitHub. `--publish` cuts an immutable, signed policy
version from the current draft:

```fish
proof liskov application import --github my-org/my-app --publish
```

You can inspect what you registered at any time:

```fish
proof liskov application list
proof liskov application status my-app
proof liskov application plans my-app
```

## 3. Preflight

Preflight validates budget, secrets, and ingress, and returns a signed quote. It
does **not** spend:

```fish
proof liskov custody preflight my-app
```

Read the quote before you continue. If preflight reports missing secrets, grant
them first — see [Sealed secrets](../guides/sealed-secrets.md).

## 4. Launch

Run exactly one custody execution. Spend is gated behind `--yes-spend`, which is
stricter than a plain `--yes`:

```fish
proof liskov custody execution run-one my-app --yes-spend
```

Liskov submits the Acurast job, funds the quote in USDC, waits for the job to
sign its registration, wires [Baran ingress](../guides/baran-ingress.md), and
prints the public URL.

## 5. Watch It Settle

```fish
proof liskov application status my-app
```

Your deployment moves through `candidate → active` as the job registers and the
route opens. The full sequence is in the
[deployment lifecycle](../concepts/deployment-lifecycle.md).

## Next

- Understand what just happened: [Replacement custody](../concepts/replacement-custody.md).
- Keep it running across job expiry: [Schedules and replicas](../guides/schedules-and-replicas.md).
- If launch stalls: [Troubleshooting](../troubleshooting/index.md).
