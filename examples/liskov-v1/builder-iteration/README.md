# Builder iteration exercise fixture

This fixture is the checked input for the builder edit / diagnose / recover
exercise. It is an internal exercise input, not a public recipe. Copy its
contents to a repository root, moving `liskov.yml` to
`.github/workflows/liskov.yml`.

It pins the same versions as the retained V5 starter:

- `@proof-computer/liskov-runtime` `v0.3.32`;
- pnpm `10.33.0`; and
- the `liskov-github-actions` `v1` interface verified at `v1.2.4`.

Verify it locally without creating an Application or spending Service Credit:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
test -s dist/bundle.js
```

## Variants

`src/variant.ts` is the one file that changes between commits. As committed it
is variant A. `variants/` holds the exact replacement bytes:

| Variant | `MARKER` | `CONTROLLED_FAULT` |
| --- | --- | --- |
| A | `builder-iteration-a` | `false` |
| B | `builder-iteration-b` | `false` |
| C | `builder-iteration-c` | `true` |

To move to the next variant, replace the file, commit, and push:

```sh
cp variants/b.ts src/variant.ts
git commit -am "Builder iteration variant B"
git push origin main
```

A and B log one `iteration.completed` event with the variant, marker, greeting
and whether the secret is configured. C raises one controlled application
fault, reported with diagnostic code `iteration_controlled_fault`. The worker
makes no outbound request, so an upstream failure cannot be mistaken for it.

## Configuration

The manifest declares:

- the literal variable `ITERATION_GREETING`, value
  `hello-from-a-literal-variable`; and
- the required managed secret `iteration-token`, delivered as the environment
  variable `ITERATION_TOKEN`.

Set the `iteration-token` value for your Application in the Console before the
exercise. The worker reports only whether the secret is configured; the value
and its length never reach a log or an error.

The fixture is deliberately once-mode. It does not claim ingress, durable
state, a custom image, or a manual rerun path.
