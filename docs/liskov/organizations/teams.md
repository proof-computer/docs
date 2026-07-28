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
owner and admin, and the new organization becomes active. Complete plan, terms,
and funding setup before launching.

The CLI can list and select an existing organization:

```bash
proof liskov organization list
proof liskov organization use ORGANIZATION_ID
proof liskov whoami
```

`organization use` changes the organization attached to the current session.
It does not move or share an Application. Verify the selected organization
before every publish or lifecycle mutation.

## Invite a member

Open **Team**, enter the person's email, choose the least-privileged supported
role, and send the invitation. Liskov emails a time-limited acceptance link.
You can resend or revoke a pending invitation.

The recipient signs in with GitHub and reviews the organization and role before
accepting. They should not forward the invitation link.

## Manage membership

Admins can change non-owner roles and remove members, subject to safeguards such
as retaining an administrator. A non-owner can leave a team organization.
Removing a member ends their organization access; it does not change deployed
artifacts, rotate external credentials, stop jobs, or transfer repository
ownership.

## Transfer ownership

Only the current owner can transfer ownership to an active member. Review the
target identity carefully. The new owner becomes an admin; the previous owner
remains an admin until their role or membership is changed separately.

## Verify

Confirm active and pending member lists, roles, owner badge, and the intended
organization ID. Review organization activity for invitation and acceptance
events. Rotate shared external credentials separately if a departing member
could access them outside Liskov.

See [Roles and access](./roles.md) before assigning a role.
