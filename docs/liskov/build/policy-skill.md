---
title: Draft a V5 manifest with the policy skill
description: Install the liskov-policy skill in Claude Code or Codex, draft a local retained V5 manifest, and validate it without publishing or spending.
---

# Draft a V5 manifest with the policy skill

Release `1.0.0` of the `liskov-policy` skill, git tag `v1.0.0` in
[proof-computer/liskov-skills](https://github.com/proof-computer/liskov-skills),
drafts one local Application manifest and validates it. PROOF Computer
maintains that repository and this release.

The skill writes a file. It does not publish, deploy, reserve, or charge.
Creating an Application, binding a GitHub source, and
`proof liskov application policy publish` stay separate steps. Follow
[Deploy from GitHub](../get-started/github.md) when you are ready to publish.

The only manifest the skill writes is `proof.liskov.application-manifest`
at `schemaVersion` `5`. That is the retained V5 pair described in
[Author a retained Application Manifest V5](./manifest-v5.md). Manifest V4
is outside the skill. A document with `schemaVersion` `6` can be accepted by
local validation and still be outside this skill: version 6 is not a released
customer manifest. The skill will not turn a V4 or V6 file into a V5 draft
unless you ask for a new V5 draft and supply the requirements yourself.

`firstPublicReady: true` from local validation is not approval to launch, not
a spend consent, and not proof that the job can be admitted.

## Prerequisites

Checked with this release:

- `@proof-computer/proof-cli-liskov` `0.16.0`, installed as a `proof` plugin
- Claude Code `2.1.283`
- Codex CLI `0.157.1`

The drafting command is local and read-only:

```bash
proof liskov application manifest validate --file PATH --json --no-analytics
```

`--no-analytics` skips the CLI invocation report. The command reads the JSON
file you name. It does not accept YAML. It does not create an Application.

You supply the application id, the spend cap, and any artifact digest. The
skill does not invent them. A secret in the file is a `secretId` reference,
never the secret value.

## Install

Both tools use the same `skills/liskov-policy/` source. The install does not
need any private repository.

Claude Code:

```bash
claude plugin marketplace add proof-computer/liskov-skills
claude plugin install liskov-policy@liskov-skills --scope user
```

Codex, pinned to this release:

```bash
codex plugin marketplace add proof-computer/liskov-skills --ref v1.0.0
codex plugin add liskov-policy@liskov-skills
```

To load the tagged source in one Claude Code session without installing it,
check out tag `v1.0.0` and start Claude with `--plugin-dir` pointed at that
checkout.

## Validate the retained starter

Copy the [retained V5 starter](../get-started/github.md) into your repository
so `.liskov/application-manifest.json` is the starter file. In a new Claude
Code or Codex conversation, ask:

```text
Use the liskov-policy skill. Validate .liskov/application-manifest.json.
Do not publish, deploy, reserve, or charge, and do not change the file.
```

The skill should run only the validate command above. For the unchanged
starter, plugin `0.16.0` returns exit `0` and:

```json
{
  "ok": true,
  "manifestValid": true,
  "schemaVersion": 5,
  "authoredDigest": "f70cbce1bcd00d84241d022f654e5f49f000e0cb214296c93c5e3b1b9c084873",
  "releaseIntentDigest": "854fa5568c55b627b85d3cdc79ff56bf798d12a8450a96245edb7d76ecb3315b",
  "firstPublicReady": true,
  "errors": [],
  "capabilityDiagnostics": [],
  "deprecationDiagnostics": []
}
```

Those digests belong to that file and that plugin. Quote a digest only from
the command that printed it. A different digest means the file or the plugin
is not the pair above.

The starter's `hello-liskov` id and `perJob` of `"50000"` are the sample's
values. They are not defaults for your Application. To draft your own
manifest, give the skill your application id, runtime, schedule, and spend
cap. Leave unknown required fields empty. An incomplete draft is not ready.

## Troubleshooting

| What you see | What it means |
| --- | --- |
| `proof` is not on `PATH`, or the command exits before JSON | The draft is not validated. Do not treat it as contract-valid. Install plugin `0.16.0` and run the command again. |
| `schemaVersion` is `4` | Outside this skill. No V4 manifest is produced. |
| `schemaVersion` is `6` and `manifestValid` is `true` | The CLI accepted a version this skill does not support. Do not use that file as a V5 draft. |
| `unknown_policy_schema` | The declared schema pair is not a version this skill can draft. |
| `invalid_manifest` at `/deployment/schedule/duration` for a bare number such as `"60"` | Add the unit you mean, for example `"60s"`. The skill should not guess the unit. |
| `unknown_field` at a secret `value` | Remove the value. Keep `secretId`. Do not paste the secret into the chat. |
| `jobs` is `0` | Invalid. `0` is not the same as omitting the field. A spend cap of `"0"` is a real zero cap and is not a missing price. |
| `firstPublicReady` is `true` for an interval schedule or for more than two jobs | The document can be schema-valid while launch is still gated. Interval Applications are not launched yet. The first public admission maximum is two jobs. |
| Codex says `plugin requires --marketplace` | Remove the plugin with `codex plugin remove liskov-policy@liskov-skills`. |

## Remove this release

```bash
claude plugin uninstall liskov-policy@liskov-skills
codex plugin remove liskov-policy@liskov-skills
```

Removal deletes the installed skill. It does not delete an unrelated plugin
or a manifest file already on disk. `1.0.0` is the first skill tag, so there
is no older skill release to install in its place. A manifest the skill
wrote is still only a local file.

The skill was checked in Claude Code `2.1.283` and Codex CLI `0.157.1`
against the corpus in the skills repository before this tag. Local validation
of the starter matched the JSON above.
