---
title: Trust Model
description: Switchboard trust boundary content target.
---

# Trust Model

This page will document Switchboard's user-facing trust boundary.

## Core Claims

- The gateway does not terminate application TLS in the default path.
- TLS private keys are generated and kept inside the Acurast job.
- The relay can submit job-signed registration but cannot forge job authority.
- Funding uses signed Hub quotes and registry-bound checks.
- Validation evidence must precede paid activation and settlement.

The final content should call out beta caveats separately from durable
security invariants.
