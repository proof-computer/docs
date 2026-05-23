---
title: Guides
description: Task-oriented Switchboard guides.
---

# Guides

Guides cover task-oriented workflows after the first successful deploy.

## Available Guides

- [Customer Domains](./custom-domains.md): attach a hostname you control and
  understand DNS plus ACME validation modes.
- [Cargo SSH Jobs](./cargo-ssh.md): scaffold an inspectable Script/Cargo SSH
  project and diagnose public SNI SSH routing.

## Common Task Pattern

Most Switchboard workflows follow the same pattern:

1. Inspect with a read-only command.
2. Dry run when the command supports it.
3. Run the mutating command with the required confirmation flag.
4. Read back state from the relay, Hub, gateway, or local report.
5. Diagnose the failing stage before retrying spend.

For deploys, use:

```fish
switchboard preflight --quote
switchboard deploy --yes --dry-run --json
switchboard deploy --yes
switchboard status
```

For local recovery, start read-only:

```fish
switchboard deploy status
switchboard deploy doctor --report <report.json>
```

Do not use admin or operator-only recovery commands from old runbooks unless
PROOF support asks you to. Public user workflows should stay on the normal
Switchboard CLI surface.
