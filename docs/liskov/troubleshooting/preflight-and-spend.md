---
title: Preflight And Spend
description: When preflight fails, a quote is refused, or a launch will not fund.
---

# Preflight And Spend

Most launch problems surface in preflight — before any money moves. Run it and
read the output:

```fish
proof liskov custody preflight my-app
```

## Missing Secrets

If preflight reports a `required` secret without a grant, the launch cannot
proceed. Grant the missing secrets and preflight again. See
[Sealed secrets](../guides/sealed-secrets.md).

## Quote Exceeds A Cap

If the signed quote is higher than a policy cap
(`budgetCaps.maxRewardPerLaunch` or `maxNativeFeePerLaunch`), the launch is
refused before spend. Either:

- raise the cap in `liskov.json` and publish a new version, or
- wait for cheaper capacity and re-quote.

See [Budgets and spend](../guides/budgets-and-spend.md).

## Ingress Not Satisfiable

With `ingress.mode: "required"`, a route that cannot be opened blocks the launch.
Check the `port`, `healthPath`, and that your app terminates HTTPS with its
job-owned certificate. See [Baran ingress](../guides/baran-ingress.md).

## Launch Will Not Fund

`custody execution run-one` only funds with `--yes-spend`. If a launch seems to
do nothing, confirm you passed `--yes-spend` — a plain run validates but does not
spend.

## Retrying Safely

Use an idempotency key so a retried launch is not double-funded:

```fish
proof liskov custody execution run-one my-app \
  --yes-spend --idempotency-key my-app-2026-06-18-a
```

## Related

- [Reconcile states](../reference/reconcile-states.md)
- [Recovery](./recovery.md)
