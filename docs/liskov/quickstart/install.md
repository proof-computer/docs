---
title: Install
description: Install the proof CLI, add the Liskov plugin, and open a session.
---

# Install

Liskov is driven by the `proof` CLI plus the Liskov plugin.

## Install The CLI

```fish
npm install --global @proof-computer/proof-cli
proof plugins install @proof-computer/proof-cli-liskov
```

Verify the plugin is available:

```fish
proof liskov --help
```

## Sign In

Liskov uses a browser-confirmed CLI session. Signing in writes a local session
file and a bearer token used only in the `Authorization` header of control-plane
requests.

```fish
proof liskov login
proof liskov whoami
```

`whoami` reads the saved session, calls the control plane, and prints your
session identity. To clear local session state:

```fish
proof liskov logout
```

## Session File

The session is stored XDG-style and written owner-only (`0600`). Override its
location when you need to:

```fish
proof liskov whoami --config /path/to/session.json
# or
set -gx PROOF_LISKOV_SESSION_FILE /path/to/session.json
```

The bearer token is never printed by `--json` output. Treat the session file as
a credential.

## Next

You are ready to declare an app. Continue to [First deploy](./first-deploy.md).
