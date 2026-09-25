---
title: Variables
description: Declare non-secret configuration, set managed values, understand precedence, and verify what a runtime receives.
---

# Variables

Variables are named, non-secret strings delivered to your process. Put their
contract in Manifest V5; manage environment-specific values in the Console.
Do not use a variable for a password, token, private key, or connection string
that contains credentials.

## Declare the contract

```json
{
  "configuration": {
    "variables": [
      {
        "name": "API_ENDPOINT",
        "required": true,
        "default": "https://example.com/api",
        "source": "managed"
      },
      {
        "name": "FEATURE_MODE",
        "source": "literal",
        "value": "safe"
      }
    ]
  }
}
```

`source: "literal"` delivers the exact authored `value`. Use
`source: "managed"` for a value saved in the Application's settings. A managed
variable may declare `required` and a public `default`; a missing required value
blocks configuration delivery. Empty strings and the string `"0"` are values.

## Set a managed value

Open the Application's configuration, choose **Variables**, and set a value for
each managed name. The Console shows names and presence to authorized members.
Review the change and its target Application before saving.

The CLI offers the same operations beside the Console. Each one works on the
managed variables that the Application's active policy declares:

```bash
proof liskov application vars list APP_REF
proof liskov application vars set APP_REF API_ENDPOINT https://example.com/api --yes
proof liskov application vars unset APP_REF API_ENDPOINT --yes
```

- `vars list` shows every declared managed variable with its status (`set`,
  `default`, or `unset`), its value, and its default. Add `--json` to get the
  server's response unchanged.
- `vars set APP_REF NAME VALUE` shows the current value and the value it would
  save, then exits without writing. Add `--yes` to save it. An empty string is
  a value; to pass a value that starts with a dash, put `--` before it.
- `vars unset APP_REF NAME` shows what clearing would leave: the declared
  default, or no value. Add `--yes` to clear the saved value.

Without `--yes`, `set` and `unset` are dry runs and change nothing. Values are
shown in the clear because a managed variable is not secret. Put credentials
in [Secrets](./secrets.md).

The commands set and clear values only. Declaring, renaming, or removing a
variable is a manifest change. A write is refused for a name the active policy
does not declare (`undeclared_variable`), a Liskov built-in name
(`reserved_builtin_name`), or a value over 4096 bytes
(`variable_value_too_large`). Key automation on the `reason` code, not the
message.

The `vars` commands are in CLI source
`497899feccd466ae10a819c4c86f55303d9bfe88`, which is not a released package.
Set values in the Console until a later plugin release contains that commit.

Keep environment-specific values out of the repository. Set them as managed
values rather than committing them into the manifest as literals.

## Precedence

For a managed variable, the effective runtime value is:

1. the current Application-managed value, when one is set;
2. otherwise the manifest `default`, when present; or
3. missing.

If `required` is true, the missing case blocks the affected deployment.
Liskov-supplied identity and bootstrap variables are separate built-ins; do not
declare or override them.

A literal uses the value in the job's pinned policy. A managed value is resolved
at the authenticated delivery boundary. Signed runtime-env refreshes see the
current managed value and a changed configuration revision. Acurast encrypted
environment delivery freezes the selected values for that job. Saving a value
does not rewrite an already running process or publish a new policy.

For a V5 JavaScript job using the Liskov runtime SDK, signed bootstrap can
fetch declared **non-secret** variables if Acurast's encrypted environment
handoff was not ready before the process started. Raw JavaScript bundles still
use the Acurast handoff. Customer secrets use their own encrypted grants, not
runtime-env. Both variable paths use the job's pinned policy; a signed
refresh may pick up a newer managed value during a running SDK job.

## Read and verify

Read values after SDK bootstrap:

```ts
const endpoint = runtime.env.require("API_ENDPOINT");
const mode = runtime.env.get("FEATURE_MODE") ?? "safe";
```

Publish only a non-secret confirmation, such as the endpoint hostname or a
configuration revision. Then verify that the successor deployment uses the expected
configuration revision. Never log a full value until you have
classified it as safe.

See [Configuration and environment precedence](../reference/configuration-precedence.md)
for the exact ordering and [Secrets](./secrets.md) for sensitive values.
