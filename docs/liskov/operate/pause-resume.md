---
title: Pause and resume
description: Stop or restart future Liskov planning while respecting existing Acurast jobs and explicit confirmation.
---

# Pause and resume

Pause is an admission control for new Liskov work. It does not force-stop an
Acurast job, revoke a managed secret grant, drain an endpoint, or undo money
already committed on chain.

## Preview and pause

In the Console, open Application settings and review the pause preview. With
the CLI, omit `--yes` for the read-only response:

```bash
proof liskov application pause APPLICATION_ID \
  --reason "planned maintenance"
```

If the preview is correct:

```bash
proof liskov application pause APPLICATION_ID \
  --reason "planned maintenance" \
  --yes
```

The Application becomes **Inactive** for new planning. Existing jobs continue
to their scheduled end and may continue logging or using already delivered
configuration.

## Resume

Review resume without `--yes`, then confirm:

```bash
proof liskov application resume APPLICATION_ID \
  --reason "maintenance complete" \
  --yes
```

Resume allows Liskov to evaluate desired state again. It can create a new
successor and reserve new Service Credits; it does not revive an ended job.
Resolve Action Plan blockers before repeating resume.

## Verify

After pause, verify inactive posture and the absence of newly admitted work;
separately observe any existing job through scheduled end. After resume,
verify a new plan/deployment only when policy requires one, then follow it to
runtime contact.

Pause is reversible. If you want permanent removal, use
[Retire an Application](./retire.md).
