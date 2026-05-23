---
title: SDK & Adapters
description: Runtime package and adapter documentation map.
---

# SDK & Adapters

This section will document the runtime package boundary for Switchboard apps.

## Planned Pages

- Express adapter.
- Fastify adapter.
- Core SDK runtime helpers.
- Deploy workflow primitives for non-CLI callers.
- Challenge endpoint behavior.
- Runtime configuration and secret handling.

Framework adapters should remain thin: mount the Switchboard endpoints, wire
framework request/response objects, and start the app with runtime config
provided at deploy time.
