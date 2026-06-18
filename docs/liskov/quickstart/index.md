---
title: Quickstart
description: Install, declare, preflight, and run your first Liskov deploy.
---

# Quickstart

Liskov deploys from a single application policy. The path is always the same:

1. [Install the CLI and sign in](./install.md).
2. Declare your app in a `liskov.json` policy.
3. Preflight to validate budget, secrets, and ingress and get a signed quote.
4. Run one custody execution with an explicit spend confirmation.

This quickstart links the two pages you need:

- [Install](./install.md) — install the `proof` CLI, add the Liskov plugin, and
  open a session.
- [First deploy](./first-deploy.md) — write a minimal `liskov.json`, preflight,
  and launch.

## The Shape Of A Deploy

```fish
# 1. sign in
proof liskov login

# 2. validate the policy and get a quote (no spend)
proof liskov custody preflight my-app

# 3. launch one execution (spend gated)
proof liskov custody execution run-one my-app --yes-spend
```

Read-only status commands never spend. Only `custody execution run-one` with
`--yes-spend` moves money, and only after a preflight quote you have seen.

Next: [Install the CLI](./install.md).
