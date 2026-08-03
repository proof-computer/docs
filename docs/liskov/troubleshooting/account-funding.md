---
title: Sign-in, organization, and funding
description: Resolve GitHub session, organization selection, invitation, plan, Stripe checkout, and Service Credit problems safely.
---

# Sign-in, organization, and funding

## GitHub sign-in does not complete

1. Confirm you are signing into the intended GitHub account.
2. Allow pop-ups or use the CLI's `--no-browser` verification URL.
3. Complete the displayed verification before its timeout.
4. Run `proof liskov whoami` rather than repeating login blindly.

If the token is expired or belongs to the wrong account, run
`proof liskov logout`, then start one new login. Never share the verification
code or session file.

## Organization is missing or wrong

```bash
proof liskov organization list
proof liskov whoami --organization ORGANIZATION_ID_OR_SLUG
proof liskov organization use ORGANIZATION_ID_OR_SLUG
proof liskov whoami
```

An invitation must be accepted by the invited GitHub identity. A pending,
expired, revoked, or already-used invitation cannot grant access. Ask an admin
to inspect Team; do not forward a private invitation link.

Switching does not move Applications. If an Application is absent, verify both
organization ID and Application UID before creating another.

Use `--organization` when you need a different membership for only one
command; use `organization use` only when you intend to change the session
default. If `LISKOV_ORGANIZATION` is set in your shell, it applies below an
explicit flag and above the session default.

## Organization selector is rejected

- `LISKOV_ORGANIZATION_SELECTOR_INVALID` or
  `invalid_organization_selector`: remove surrounding-only whitespace and use
  a non-empty exact ID or slug no longer than 255 UTF-8 bytes.
- `not_a_member`: run `organization list`, confirm the invitation is accepted
  and active, and copy the exact case-sensitive ID or slug. Do not guess or
  create a replacement Application.
- An unauthorized session error: run ordinary `whoami`. If that also fails,
  log in again. Never print or paste the stored token while diagnosing it.

Use `whoami --organization SELECTOR --json` to compare
`organizationContext.effective` with `organizationContext.sessionDefault`.
The command override must not change the latter.

## Plan or terms block setup

Open **Billing & funding** and read the displayed requirement. Only an admin can
change plan/funding settings. Accept terms for the correct legal organization.
An unavailable plan or disabled control is not a reason to call an internal
endpoint.

## Stripe checkout succeeded but credit is unchanged

1. Return to the same organization's **Billing & funding** page.
2. Refresh the authoritative Service Credit and transaction read.
3. Confirm Stripe says the payment is paid, not pending or failed.
4. Wait for the stated confirmation window; do not submit another payment.

```bash
proof liskov organization service-credits ORGANIZATION_ID --json
proof liskov organization billing transactions ORGANIZATION_ID --limit 25 --json
```

If still missing, contact support with organization ID, checkout/payment
reference, UTC timestamp, amount/currency, and redacted CLI output. Never send
card number, security code, session token, or a screenshot containing them.

## Available credit is below the displayed balance

Check **Reserved**. Available credit excludes active holds. Match each reserve
to a deployment or financial review. Do not infer a ledger error by subtracting
rounded browser values; use transactions.
