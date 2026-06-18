---
title: Replacement Holds
description: Read and clear a replacement hold safely.
---

# Replacement Holds

A **replacement hold** is a safety brake. When a replacement looks risky — for
example a previous attempt failed in a way that could waste spend or strand a
route — Liskov derives a hold that blocks further resume or replacement until you
clear it deliberately.

A hold is not an error. It is Liskov refusing to spend again until a human
confirms it is safe.

## Recognising A Hold

`proof liskov application status my-app` reports the hold and the reason it was
derived (for example, a prior execution that did not complete cleanly). No
replacement will launch while the hold stands.

## Before You Override

Confirm the previous attempt is genuinely resolved:

- Read `application plans my-app` and the latest execution's diagnosis.
- Confirm no replacement is mid-flight and no route is half-open.
- Confirm the budget is intact (a partial spend may have already happened).

If you are unsure, treat the hold as correct and investigate with
[Recovery](./recovery.md) first.

## Clearing It

Override the hold with an explicit reason, and re-confirm spend:

```fish
proof liskov custody execution run-one my-app \
  --override-replacement-hold --reason "prior attempt cancelled before funding" \
  --yes-spend
```

The `--reason` is recorded with the execution. Overriding without `--yes-spend`
still will not spend — both gates are required to launch.

## Related

- [Replacement custody](../concepts/replacement-custody.md)
- [Recovery](./recovery.md)
