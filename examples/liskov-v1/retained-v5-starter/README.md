# Retained V5 JavaScript starter

This fixture is the checked source for the public retained-V5 guide. Copy its
contents to a repository root, moving `liskov.yml` to
`.github/workflows/liskov.yml`.

It pins:

- `@proof-computer/liskov-runtime` `v0.3.38`;
- pnpm `10.33.0`; and
- the moving `liskov-github-actions` `v2` workflow tag, verified at `v2.3.1`.

Verify it locally without creating an Application or spending Service Credit:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
test -s dist/bundle.js
proof liskov application manifest validate \
  --file .liskov/application-manifest.json \
  --json
```

Use `@proof-computer/proof-cli-liskov` `0.18.1` for the `proof` commands. When
using the GitHub workflow, create the Application and set its source binding
before the first push to `main` that contains the workflow. The public guide
contains that exact command order.

The starter is deliberately once-mode and makes one harmless request to
`example.com`. It logs only the host, success flag, and HTTP status through
managed logs. It does not claim ingress, durable state, a custom image, or a
manual rerun path.

The build emits CommonJS for Acurast's `require()` entry loader and parses the
finished artifact as a script before upload. Keep asynchronous startup inside
`main`; an ESM entrypoint with top-level await cannot be loaded by that loader.
