---
title: Troubleshooting
description: Diagnose stuck Liskov launches and replacements.
---

# Troubleshooting

Start every diagnosis with read-only commands — they never spend:

```fish
proof liskov application status my-app
proof liskov application plans my-app
```

Then jump to the matching page:

- [Replacement holds](./replacement-holds.md): a deployment is blocked from
  resuming or replacing.
- [Preflight and spend](./preflight-and-spend.md): preflight fails, a quote is
  refused, or a launch will not fund.
- [Recovery](./recovery.md): a launch is wedged mid-flight and needs to be
  released or retried safely.

Map symptoms to lifecycle stages using the
[deployment lifecycle](../concepts/deployment-lifecycle.md) and the
[reconcile states](../reference/reconcile-states.md).
