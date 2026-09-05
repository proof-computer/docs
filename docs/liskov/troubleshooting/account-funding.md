---
title: Sign-in, organization, and Service Credit reads
description: Resolve GitHub session, organization selection, invitation, and read-only Service Credit problems safely.
---

# Sign-in, organization, and Service Credit reads

:::caution Release boundary
Plan selection, terms acceptance, Stripe checkout, and issuance of new Service
Credits are release-gated. Writing a plan id does not activate a paid plan.
Production paid billing is not enabled. There is no supported customer checkout
troubleshooting procedure yet. Do not submit payment details, retry a disabled
control, or call an internal funding endpoint.
:::

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

## A commercial or funding control is unavailable

This is the expected customer posture while the commercial gate remains. You
can read **Account**, **Billing & funding**, and **Ledger**, and you can open
the **Plans** surface, but production paid billing is not enabled. A visible
plan, checkout, or Stripe portal control does not override this boundary. Do
not submit payment details, retry a disabled control, or call an internal
funding endpoint.

A configured Stripe supplier/VAT profile and a deployed Checkout implementation
also do not change this release boundary. Customer payment starts only after the
commercial enablement gate and the documented production journey pass.

## A subscription request reports a conflict

`subscription_intent_conflict` means the request key already identifies a
subscription action with different plan, interval, cancellation, or trial
inputs. The conflicting request is refused before a provider mutation.
Do not change the inputs under that key or create another request to work
around an uncertain payment. Contact support with the organization ID, UTC
time, and error code; do not include payment links or credentials.

An unknown action reports `subscription_action_invalid`; an unsupported
interval reports `subscription_interval_invalid`. These errors do not enable
paid billing or provide a supported route around the release gate above.

## Service Credit reads disagree

1. Confirm the active organization ID in the Console and CLI.
2. Refresh the authoritative Service Credit and transaction reads.
3. Compare exact available, reserved, and used values rather than rounded
   browser values.
4. Match reservations to the Application or deployment that owns them.

```bash
proof liskov organization service-credits ORGANIZATION_ID --json
proof liskov organization billing transactions ORGANIZATION_ID --limit 25 --json
```

If the reads still disagree, contact support with the organization ID, UTC
timestamp, expected record, and redacted CLI output. Never send a card number,
security code, session token, or a screenshot containing them.

## Available credit is below the displayed balance

Check **Reserved**. Available credit excludes active holds. Match each reserve
to a deployment or financial review. Do not infer a ledger error by subtracting
rounded browser values; use transactions.
