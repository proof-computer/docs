---
title: Costs and custody model
description: Understand managed custody, USD Service Credits, bounded network settlement, and the separate status of self-custody.
---

# Costs and custody model

Managed custody is the v1 default. Liskov holds and operates the service-side
authority needed to register Acurast jobs and settle network costs within the
Application's effective policy and the organization's customer controls.

## Customer money model

You fund USD Service Credits through Stripe. Liskov shows available, reserved,
used, and transaction history in USD. It quotes work, reserves bounded credit,
settles a final charge from evidence, and releases unused reserve.

You do not:

- deposit USDC or ACU;
- manage a customer Acurast wallet;
- approve a token swap;
- monitor a crypto balance; or
- withdraw network settlement assets.

Liskov's treasury mechanics are not a second customer balance.

## Layers of authority

A deployment must fit all relevant boundaries:

1. manifest/effective-policy caps;
2. enabled product capability and organization entitlement;
3. current quote and reserve;
4. available USD Service Credits;
5. explicit customer confirmation where required; and
6. network acceptance.

No single cap promises that the work will be available or cost exactly that
amount.

## Managed custody does not erase chain ownership

Once a job is registered, Acurast owns its schedule. Pause and retirement stop
new Liskov work but cannot force the chain to end an existing job. Retirement
therefore waits for execution and financial closure.

## Self-custody

A separate signer design exists as Preview work, not as the default v1 path.
It changes key and funding responsibility and has its own pairing/liveness
boundary. Until an explicit Preview is available and documented, do not follow
internal signer or custody commands.

See [Plans and USD Service Credits](../organizations/service-credits.md) and
[Quotes, reserves, and final charges](../organizations/charges.md) for tasks.
