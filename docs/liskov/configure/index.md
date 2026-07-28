---
title: Configure
description: Configure runtime values, secrets, resources, schedules, placement, logging, and spend authority.
---

# Configure

Configuration tells Liskov what your Application needs. Some configuration is
authored in Manifest V4; managed values and secrets can be supplied through
the Console without committing them to your repository.

- [Variables](./variables.md) for non-secret values.
- [Secrets](./secrets.md) for credentials and sensitive configuration.
- [Runtime resources and networking](./resources-networking.md).
- [Schedules, renewal, and updates](./schedules-updates.md).
- [Processor placement](./processor-placement.md).
- [Logging and diagnostics](./logging-diagnostics.md).
- [Spend limits](./spend-limits.md).

Configuration normally affects the next deployment or successor. Each page
states whether changing a value affects a running job.
