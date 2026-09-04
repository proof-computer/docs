---
title: Organizations and teams
description: Create or switch an organization, invite members, manage membership, and transfer ownership safely.
---

# Organizations and teams

An organization is the isolation, ownership, and billing boundary for Liskov.
Its Applications, members, plan, Service Credits, records, and settings do not
move when you switch to another organization.

## Create or switch

Create an organization from the Console organization switcher. You become its
owner and admin, and the new organization becomes active. Plan selection, terms
acceptance, Stripe checkout, and new Service Credit issuance remain
release-gated. An eligible deployment therefore requires an organization that
already has enough available Service Credits.

New organizations are business-only. Enter **Country where your business is
established** as a two-letter country code and affirm the separate,
non-pre-ticked **Business use only** statement. You are confirming that the use
is wholly or mainly for a trade, business, craft, or profession, that you are at
least 18, and that you have authority to bind the named organization. Liskov
does not ask for your date of birth for this declaration.

If you cannot make that statement, do not create an organization for personal,
family, or household use. If you believe your use is business use and need
help, contact [hello@proof.computer](mailto:hello@proof.computer). There is no
self-service or manual consumer exception.

The CLI can list and select an existing organization:

```bash
proof liskov organization list
proof liskov organization use ORGANIZATION_ID_OR_SLUG
proof liskov whoami
```

`organization use` changes the organization attached to the current session.
It does not move or share an Application. Verify the selected organization
before every publish or lifecycle mutation.

To select another active membership for only one command, use an exact ID or
slug without changing the session default:

```bash
proof liskov application list --organization ORGANIZATION_ID_OR_SLUG
LISKOV_ORGANIZATION=ORGANIZATION_ID_OR_SLUG proof liskov whoami
```

The flag takes precedence over the environment. An existing positional
organization selector takes precedence over both. Slugs are exact and
case-sensitive. `whoami` distinguishes the effective organization for the
command from the persistent session organization.

## Invite a member

Open **Team**, enter the person's email, choose the least-privileged supported
role, and send the invitation. Liskov emails a time-limited acceptance link.

The recipient signs in with GitHub and reviews the organization and role before
accepting. They should not forward the invitation link.

Resending an invitation mints a fresh link and **the previous link stops
working**. Liskov stores only a one-way hash of the link, so an existing
invitation's link cannot be shown to you again; resend when you need to hand one
over yourself. Revoking an invitation stops its link immediately.

## Seats

Every plan includes a number of seats. A seat is held by each member of the
organization and by each pending invitation, because an invitation that is
accepted becomes a member. An invitation that would take the organization past
its allowance is refused, and the refusal names the seats in use and the
allowance.

To make room, revoke a pending invitation, remove a member, or move to a plan
with more seats. There is no seat overage: Liskov does not admit the invitation
and bill you for it.

The Team page shows the count beside the members list and again under the
pending invitations, so you can see the seats already promised before you invite
anyone.

:::note[Paid plans are not yet purchasable]

Paid plan activation is release-gated (see
[Capabilities and limits](../reference/capabilities.md)), so every organization
currently resolves to the Free allowance of **one seat**. Until paid activation
is available, contact support if you need to add members.

:::

## Manage membership

Admins can change non-owner roles and remove members, subject to safeguards such
as retaining an administrator. A non-owner can leave a team organization.
Removing a member ends their organization access; it does not change deployed
artifacts, rotate external credentials, stop jobs, or transfer repository
ownership.

A member row also carries a status. `active` is the ordinary state. An admin can
**suspend** a member and **reinstate** them from the Team page. Suspended
members keep their membership, their role, and their seat, but they cannot act
in that organization until they are reinstated. The Owner cannot be suspended,
and you cannot suspend yourself.

Suspending a member does not revoke Runtime SSH operator keys. Those keys are
organization-scoped; revoke them separately from
[Managed SSH](../operate/runtime-ssh.md).

## Transfer ownership

Only the current owner can transfer ownership to an active member. Review the
target identity carefully. The new owner becomes an admin; the previous owner
remains an admin until their role or membership is changed separately.

## Verify

Confirm active and pending member lists, roles, owner badge, the seat count, and
the intended organization ID. Review organization activity for invitation,
acceptance, suspend, and reinstate events. Rotate shared external credentials
separately if a departing member could access them outside Liskov.

See [Roles and access](./roles.md) before assigning a role.
