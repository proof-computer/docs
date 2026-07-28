---
title: Variables
description: Declare non-secret configuration, set managed values, understand precedence, and verify what a runtime receives.
---

# Variables

Variables are named, non-secret strings delivered to your process. Put their
contract in Manifest V4; manage environment-specific values in the Console.
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
        "managed": true
      },
      {
        "name": "FEATURE_MODE",
        "required": false,
        "default": "safe",
        "managed": false
      }
    ]
  }
}
```

`name` is the runtime environment name. `required` makes a missing final value
a blocker. `default` is public authored text. `managed: true` says that Liskov
owns the deployment value rather than treating the manifest default as the only
source.

## Set a managed value

Open the Application's configuration, choose **Variables**, and set a value for
each managed name. The Console shows names and presence to authorized members.
Review the change and its target Application before saving.

The active CLI can read Application state but does not provide a public v1
command for writing variable values. Do not put an environment-specific value
into the repository merely to work around that boundary.

## Precedence

For an authored variable, the effective runtime value is:

1. the current Application-managed value, when one is set;
2. otherwise the manifest `default`, when present; or
3. missing.

If `required` is true, the missing case blocks the affected deployment.
Liskov-supplied identity and bootstrap variables are separate built-ins; do not
declare or override them.

A saved change affects a successor deployment according to the Application's
update policy. It does not rewrite the environment of a process that is already
running.

## Read and verify

Read values after SDK bootstrap:

```ts
const endpoint = runtime.env.require("API_ENDPOINT");
const mode = runtime.env.get("FEATURE_MODE") ?? "safe";
```

Publish only a non-secret confirmation, such as the endpoint hostname or a
configuration revision. Then verify that the successor deployment uses the new
policy/configuration generation. Never log a full value until you have
classified it as safe.

See [Configuration and environment precedence](../reference/configuration-precedence.md)
for the exact ordering and [Secrets](./secrets.md) for sensitive values.
