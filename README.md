# PROOF Docs

Public documentation site for running services on PROOF's confidential-compute
stack.

Switchboard docs cover secure HTTP ingress for supported Acurast jobs. Slipway,
Blackbox, and Lockbox are in progress and stay out of navigation until their
public docs are ready.

## Development

```fish
pnpm install
pnpm typecheck
pnpm build
pnpm start
```

The site is a Docusaurus TypeScript project. Switchboard docs live under
`docs/switchboard` and are served at the site root (`/`). Legacy
`/switchboard/*` URLs redirect to `/*` via `vercel.json`.

## Slipway Canary

The `.slipway/application-policy.json` file declares the docs site as the
`proof-docs` internal canary Application. It is intentionally no-secret and
uses a generated single-file Node entrypoint for Acurast:

```fish
pnpm acurast:build
pnpm acurast:start
```

The manual `Slipway Artifact` workflow packages the same entrypoint, uploads
or accepts an already-pinned `ipfs://` script, and posts a GitHub OIDC artifact
pin for Slipway.

## Content Rules

- Keep user-facing docs aligned with public package surfaces, not internal
  monorepo paths.
- Keep unfinished pages short and clear about the user's next useful step.
- Describe Switchboard as secure HTTPS ingress for supported long-running
  Acurast Node.js jobs. Explain unsupported hosting cases as requirements, not
  internal release staging.
- Do not add Slipway, Blackbox, or Lockbox navigation until their public docs
  are ready.
