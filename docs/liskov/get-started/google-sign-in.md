---
unlisted: true
title: Sign in with Google
description: Sign in to Liskov with a Google account, understand which account you reach, and accept an organization invitation with the address it was sent to.
---

# Sign in with Google

:::danger[Not released]

Signing in with Google is not released. Nobody can sign in with Google yet:
until the release is verified, the Console shows Google as unavailable.
[Capabilities and limits](../reference/capabilities.md) owns what is
available, and [Set up Liskov](./set-up-liskov.md) describes signing in as it
works today, with GitHub or an email sign-in link.

This page is written as though final so that the contract can be reviewed
before the release. Read it as a design, not as a surface you can reach.

:::

Google is a third way to sign in to Liskov, beside GitHub and an email sign-in
link. It proves one thing: that you control an email address. Liskov uses that
address as your account, so a Google sign-in and an email sign-in link reach
**the same account**. A GitHub sign-in reaches a **separate** account.

Signing in never spends Service Credits. It starts a session, and — only for
an address Liskov has admitted but has not seen before — creates the account.

## One address, one account

Your Liskov account is your email address. Google and the email sign-in link
are two ways to prove you control it:

- If you have signed in with an email link before and now choose Google with
  the same address, you arrive in the account you already had, with the same
  organizations, memberships, and roles. Anything that account can use only
  once is already used.
- The address is compared **without regard to capital letters**, and nothing
  else. `Casey@example.com` and `casey@example.com` are the same account.
  Liskov does not apply Gmail's own routing rules: `casey.smith@gmail.com`,
  `caseysmith@gmail.com`, and `casey+liskov@gmail.com` are **three different
  accounts** here, even though Gmail delivers them to one inbox.
- Google must have **confirmed** the address. If Google returns no address, or
  one it has not verified, Liskov does not sign you in.
- If you change the address on your Google account, the next Google sign-in
  reaches the account for the new address, not the old one. To reach your
  existing account, sign in with an email link sent to the old address.

## GitHub stays a separate account

A GitHub account in Liskov has no email address, and Liskov does not look for
one. If you sign in with GitHub and also with Google, you have **two separate
accounts**, each with its own organizations and memberships, in the same way GitHub
and an email link give you two accounts today.

- Liskov never merges or links the two, and never tells you that another
  account exists. There is no way to join them yet.
- **A Google sign-in grants no GitHub repository access.** Liskov reaches your
  repositories through the Liskov GitHub App your organization installs, never
  through your sign-in.
- The CLI's browser login (`proof liskov login`) and a few application actions
  still need a GitHub sign-in, exactly as they do for an email sign-in today.
  Signing in with Google does not change which actions need GitHub.

## Sign in

1. Open the [Liskov Console](https://console.liskov.proof.computer).
2. Choose **Continue with Google**.
3. Choose the Google account whose address you want to use, and approve the
   request. Liskov asks Google only for your identity and email address.
4. Liskov returns you to the page you were going to, signed in.

**Verify:** the Console opens signed in. If you have used an email link with
the same address before, your organizations are listed as before.

Finish within 10 minutes, in the same browser you started in. A sign-in that
takes longer, or that you finish in another browser, does not complete; start
again from the Console.

If the button reads **Google login not configured** or **Google login
unavailable** instead, this Console cannot offer Google right now. Use
**Continue with GitHub** or an email sign-in link.

### When Google sign-in does not complete

If you cancel at Google, or the sign-in fails for any other reason, the
sign-in page says:

> We couldn't sign you in. Try again, or use another way to sign in.

The message is the same whatever went wrong, so it never says whether an
account exists. Nothing was created or changed.

If Google did not confirm an email address for your Google account, the page
says:

> Google didn't confirm an email address for this account. Use the magic link instead.

Use an email sign-in link to the address you want to use, or confirm the
address with Google and try again.

## New accounts are invitation-only

A Google sign-in is admitted exactly as an email sign-in is. While new
accounts are invitation-only, Liskov signs you in when:

- an account already exists for that address; or
- you have a wait-list invitation sent to that address, compared without
  regard to capital letters.

Otherwise Liskov shows **Liskov is invitation-only right now**: your sign-in
worked, and this visit did not create an account. Request an invitation
through the [wait-list form](https://form.typeform.com/to/pNe4ot4a).

If you already have an account from an email sign-in link, you do not need a
new invitation to use Google with the same address: the account is already
there.

## Accept an organization invitation

An organization invitation is sent either to an **email address** or to a
**GitHub account**, and only that address or account can accept it. The
invitation page says which: **This invitation is for** the address, and **we
match on your verified email**.

- **An invitation sent to an email address** is accepted by signing in as that
  address — with **Accept with Google** or an email sign-in link. A GitHub
  sign-in proves no email address, so it cannot accept an invitation sent to
  one.
- **An invitation sent to a GitHub account** is accepted with GitHub, signed in
  as the invited GitHub account. Google and email links cannot accept it.

After you sign in, the page returns to the same invitation. Choose **Accept
invitation**. You join the organization with the role shown on the
invitation, and nothing else: no other organization and no GitHub repository
access. Accepting spends no Service Credits.

**Verify:** the organization appears in your organization list with the
invited role.

### When the invitation is not accepted

| The invitation page says | What it means | What to do |
| --- | --- | --- |
| **This invitation was sent to** an address. **Sign in as that address to accept it.** | You are signed in as a different address, or with GitHub. Nothing changed; the invitation still works for the address it was sent to. | Choose **Sign in as someone else** and sign in as the invited address. |
| **This invitation was sent to a GitHub account.** | You are not signed in as the invited GitHub account. | Sign in with that GitHub account. |
| **This invitation has already been used, so it cannot seat anyone again.** | Someone accepted it. | If that was not you, ask the person who invited you. |
| **This invitation has expired.** | The link is past its expiry. | Ask the person who invited you to send a new one. The new one has a new link. |
| **Invitation unavailable** | The link does not match any invitation, for example because it was replaced by a newer one. | Open the most recent invitation email, or ask for a new one. |

A forwarded invitation link does not let someone else join: whoever opens it
sees that it was sent to another address, and the invitation stays usable by
the person it was sent to. Do not forward your invitation link.

## Troubleshooting

| Symptom | Safe action |
| --- | --- |
| After a Google sign-in you see different organizations from the ones you expected | You may have reached a different account. Check which address you chose at Google; dots, `+` suffixes, and a GitHub sign-in each reach a different account. |
| You signed in with Google, but `proof liskov login` or an application action still asks for GitHub | That action needs a GitHub sign-in. Use GitHub for it. |
| An invitation keeps saying it was sent to another address | Sign out with **Sign in as someone else**, then sign in with Google or an email link as the invited address. |

For other sign-in and invitation problems, see
[Sign-in, organization, and Service Credit reads](../troubleshooting/account-funding.md).
