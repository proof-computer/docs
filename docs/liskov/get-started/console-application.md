---
unlisted: true
title: Create an Application in the Console
description: Choose a GitHub repository, branch, and committed retained V5 policy in the Liskov Console, review Liskov's validated summary at one exact commit, and create the Application identity without publishing or spending.
---

# Create an Application in the Console

:::danger[Not released]

The Console's **New application** flow is not released. Until the release is
verified, [Deploy from GitHub](./github.md) — the CLI and GitHub Actions — is
the supported way to take your own repository to a Liskov Application, and
[Capabilities and limits](../reference/capabilities.md) owns what is
available.

This page is written as though final so that the contract can be reviewed
before the release. Read it as a design, not as a surface you can reach.

:::

**New application** turns one retained Manifest V5 policy that is already
committed to your GitHub repository into one Liskov Application identity. It
has three steps: **Repository**, **Policy**, and **Confirm**. Liskov only
reads your repository; nothing on these pages changes it.

Creating an Application is not publishing it. **Creating spends nothing**: it
publishes no policy, starts no build or job, resumes nothing, and reserves or
spends no Service Credits. The Application cannot deploy until you publish the
reviewed policy, which is a separate step on the
[GitHub path](#next-publish-the-reviewed-policy).

## Before you begin

You need:

- a Liskov organization — see [Set up Liskov](./set-up-liskov.md);
- the Liskov GitHub App installed for that organization, reaching the
  repository you want to use — see
  [What the GitHub App covers](../operate/integrations.md#what-the-github-app-covers);
- a retained Manifest V5 policy committed and pushed to a branch of that
  repository, with the `applicationId` you want. If you have none yet, the
  flow shows you how to add one;
- a role that can preview policy source and import an Application. The
  Console's **Team** page shows which roles can; see
  [Roles and access](../organizations/roles.md); and
- a free application slot on your organization's plan.

## Open New application

1. Open the [Liskov Console](https://console.liskov.proof.computer) in the
   organization the Application belongs to.
2. On the Dashboard, under **Your first application**, choose **New
   application**. An organization that already has Applications does not show
   that panel; open `https://console.liskov.proof.computer/applications/new`
   instead.

If the panel offers **Connect GitHub** instead, the GitHub App is not
installed for this organization yet. Install it, then come back.

The address bar carries your choices — the organization, repository, branch,
and policy file — so back and forward keep them. Switching to another
organization clears them.

## 1. Choose a repository and base branch

The page is **Choose a repository**. Under **Your repositories** it lists the
repositories your GitHub installation reaches.

1. Choose one repository. Use **Find a repository** to search by
   `owner/name`. If the list ends with **Show more repositories**, choose it
   to read the next page.
2. Under **Base branch**, check **Branch name**. Liskov fills in the
   repository's default branch; change it to the branch that holds the policy
   you want. If GitHub names no default branch, the field starts empty. There
   is no branch list: type the name exactly.
3. Choose **Continue to policies →**. It stays disabled until you have chosen
   a repository and entered a branch.

Choosing a different repository resets the branch to that repository's
default, and changing the branch clears any policy you chose on the old one.

| The page says | What it means | What to do |
| --- | --- | --- |
| The GitHub App is not installed for this organisation, so there are no repositories to choose from yet. | No installation for this organization. | Choose **Connect GitHub →** and install the GitHub App. |
| Your GitHub installation does not reach any repositories yet. | The installation exists but reaches no repository. | Choose **Manage the GitHub integration →** and give it access to the repository. |
| Your role in this organisation cannot read its GitHub repositories. | Your role cannot read the installation's repositories. | Ask an organization admin for a role that can. |
| Your repository is not in the list | The installation does not reach it. | Choose **Can't see your repository? Manage the GitHub integration →**. |

## 2. Choose one policy

The page is **Choose one policy**. Liskov resolves the branch to **one
commit** and scans that commit for application policy files. Under
**Policies on this branch**, each file shows its `applicationId` (or its file
name when it declares none), its path as found in GitHub, and a note:

| Note | Meaning |
| --- | --- |
| **V5 · available** | You can choose this file. Confirm validates it before anything is created. |
| **Already imported** | An Application in this organization with this `applicationId` already reads from this repository. It cannot be created again. |
| **V4 · not supported**, **Schema not supported** | Liskov cannot create an Application from this schema. |
| **Not valid JSON**, **No policy schema**, **No applicationId**, **Too large to read** | The file cannot be used as it stands. Fix it, commit, and scan again. |

1. Choose exactly one available file. The first available file is chosen for
   you.
2. Inspect it under **Policy JSON**, which shows the chosen file as read at
   the scanned commit. Expand it to read the whole file.
3. Choose **Review this application →**. It stays disabled until the chosen
   file's JSON has been shown.

If a file cannot be chosen, its note says why. If none can, the page says
**None of the policy files on this branch can be used for a new
application.**

The scan is bounded. When it could not read the whole branch, the page says
**This list may not be every policy on the branch.** and names the limit it
reached. JSON files it could not read are listed with the reason. Every visit
to this step scans the branch again, so a file you have pushed since appears
the next time you open it.

### When the branch has no policy

If the scan finds no policy file, the page shows **No application policy
found** and the Policy step is marked **No policy file on this branch yet**.

1. Choose **How to add a policy →**. The page is **Add a policy in your
   repository**. It reads and writes nothing.
2. Open the repository on the chosen branch in Claude Code or Codex, and use
   the [liskov-policy skill](../build/policy-skill.md) to draft and validate a
   retained V5 policy.
3. Review the JSON, then commit and push it to the chosen branch.
4. Choose **I've added a policy — scan again →** and continue from step 2.

## 3. Review, then create

The page is **Review before creating**. Under **One application**, Liskov
shows what the chosen policy asks it to run. Liskov's validator produces this
summary on the server; the Console does not compute it.

| Row | What it shows |
| --- | --- |
| **Application ID** | The `applicationId` the policy declares. This is the Application you create. |
| **Execution** | How often it runs, how long each job lasts, and, when the policy names them, the number of jobs and the end time. |
| **Runtime** | The runtime and entrypoint. |
| **Spend limit** | The authored cap on one job, **per job**. It is a limit, not a price. |
| **Managed logs** | **Enabled** or **Disabled**. |
| **Policy** | For example `Manifest V5 · source release · validated`. |
| **GitHub source** | The repository, the policy path, the branch, and the short commit. Hover the commit to see all of it. |

**Policy JSON** shows the same file again. Everything on this page — the
summary, the verdict, and the JSON — comes from the **exact commit** step 2
scanned, so the summary and the file can never describe two different
revisions of a moving branch.

1. Check the summary and the JSON.
2. Choose **Create this application**. The button reads **Creating…** while
   Liskov answers. A second click sends nothing: one request is made.

When the Application is created, the Confirm step is marked **Application
created**, and the page says that your Application **now has an identity.
Publish the reviewed policy before deploying.**

**Verify:** choose **View applications →**. The Application is listed under
its `applicationId`. It has no published policy and no deployment yet.

### When the policy is not valid

The summary is shown only for a policy Liskov validates as retained V5. For
any other policy, the page shows Liskov's reasons instead — each with its
code, the JSON pointer it concerns, and a message — and **Create this
application** stays disabled:

- **This policy is not valid, so it cannot create an application.** The
  document fails V5 validation.
- **Liskov cannot create an application from this policy's schema**, with the
  declared version, for example `(V4)`. Only retained V5 creates an
  Application here.

Fix the file on the branch, commit and push it, then follow **choose it
again** to scan the branch and review the new commit.

### When the branch has moved

If someone pushes to the branch after you chose the policy, the page says the
branch **has changed since you chose this policy. Review it again before
creating the application.** Nothing was created. Choose **Review the policy
again** to scan the new commit and review it.

### When creation is refused

If Liskov refuses, the page says **The application was not created.** with
Liskov's reason, and keeps every choice you made. Common reasons:

- an Application with that `applicationId` already exists in this
  organization — choose a different policy, or change the policy's
  `applicationId`, commit, and review again;
- every application slot on your organization's plan is in use; or
- your role cannot import an Application.

If the page says **Liskov's answer could not be read. Check Applications
before trying again.**, the Application may have been created. Look for it
under **Applications** before you choose **Create this application** again.

## What creating does and does not do

| Creating does | Creating does not |
| --- | --- |
| Records one Application identity in this organization, named by the policy's `applicationId`. | Publish the policy or commit an effective policy. |
| Records the chosen repository as the repository backing the Application. | Bind release source: the allowed refs, the workflow identity, and the manifest path. |
| Uses one of your plan's application slots. | Build, upload, or attest anything, or start a job or deployment. |
| | Reserve or spend Service Credits, or resume anything. |
| | Change any file in your repository. |

## Next: publish the reviewed policy

The Application exists, but nothing runs until its policy is published from an
attested build. Continue with [Deploy from GitHub](./github.md) at
[step 4](./github.md#4-create-the-application-and-bind-its-source): skip
`proof liskov application create`, which the Console has done, and bind the
source with your repository, the branch as the allowed ref, and your policy's
path as the manifest path. Then push, let the workflow build, and publish.
**Publishing is the step that spends.**
