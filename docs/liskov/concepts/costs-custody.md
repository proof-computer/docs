---
title: Costs and custody model
description: Understand managed custody, USD Service Credits, bounded network settlement, and the separate status of self-custody.
---

# Costs and custody model

Managed custody is the v1 default. Liskov holds and operates the service-side
authority needed to register Acurast jobs and settle network costs within the
Application's effective policy and the organization's customer controls.

## Customer money model

USD Service Credits are the account unit. Liskov supports read-only views of
available, reserved, used, and transaction history in USD. It quotes work,
reserves bounded credit, settles a final charge from evidence, and releases
unused reserve for eligible, already-funded organizations.

Customer Stripe checkout and issuance of new Service Credits remain
release-gated. Internal first-party acceptance uses an existing pre-funded
organization; it does not prove that customer funding is available.

You do not:

- deposit USDC or ACU;
- manage a customer Acurast wallet;
- approve a token swap;
- monitor a crypto balance; or
- withdraw network settlement assets.

Liskov's treasury mechanics are not a second customer balance.

For managed custody, scanner-proven report absence has a specific closeout.
Once the strict report deadline has passed and the finalized scanner still has
no report, the customer is not billed: the final charge is zero, the whole
linked reserve is released, and no customer action or review amount remains.
The customer-facing reason is `report_absent_not_billed`. Any exact network
reward, refund, processor payout, or deregistration fee remains Liskov treasury
accounting rather than customer exposure.

This rule does not turn an open or unreadable evidence window into zero. A
pending scanner, unavailable reader, outside-coverage result, identity or timing
conflict, or read failure still defers settlement.

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
internal signer or custody commands. The managed no-report rule does not apply
to self-custody: ACU movement remains immutable chain accounting, never an ACU
refund or reversal invented by Liskov.

See [Read USD Service Credits](../organizations/service-credits.md) and
[Quotes, reserves, and final charges](../organizations/charges.md) for tasks.
