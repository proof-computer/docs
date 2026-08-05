---
title: Roles and access
description: Choose among the assignable v1 organization roles and understand ownership as a separate safeguard.
---

# Roles and access

Use the narrowest role that supports a person's work. Organization roles apply
across Applications, secrets, spend, team, and settings according to the
current Liskov permission model.

## Assignable roles

| Role | Intended use |
| --- | --- |
| **Viewer** | Inspect permitted organization and Application state without making changes. |
| **Developer** | Work with Application source, drafts, releases, and configuration within granted boundaries. |
| **Maintainer** | Manage broader Application configuration and lifecycle decisions. |
| **Operator** | Monitor and perform supported operational actions. |
| **Spender** | Confirm permitted actions that create a customer financial commitment. |
| **Admin** | Manage organization settings and members; plan and funding controls remain release-gated. |

The Console is authoritative about the exact action enabled for the current
role. A label describes responsibility; it is not a guarantee that every future
feature or every Application is available. Disabled controls and a server
authorization failure are boundaries, not instructions to find an internal
command.

## Owner is separate

Each organization has one **Owner**. Ownership is not another everyday role:
the owner is an admin with safeguards around removal, demotion, admin
invitations, and ownership transfer. Transfer ownership before the current
owner leaves.

## Practical separation

For a team, separate source review, operational observation, and spending
confirmation where possible. A GitHub workflow can build and attest an artifact
without a spend credential. Publication, deployment authority, and Service
Credit controls remain Liskov decisions.

Do not share a personal session, invitation link, or managed secret to avoid
role setup.

## Verify

After changing a role, ask the member to sign in again if needed and confirm
the intended read and mutation surfaces. Review Team and Activity. Do not test
access with a real deployment when a read-only or preview action can verify it.
