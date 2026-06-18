# PROOF Docs

Public documentation site for running services on PROOF's confidential-compute
stack.

Baran docs cover secure HTTP ingress for supported Acurast jobs. Liskov docs
cover managed replacement-custody deployment into TEEs on real Acurast phones.
Blackbox and Lockbox are in progress and stay out of navigation until their
public docs are ready.

## Development

```fish
pnpm install
pnpm typecheck
pnpm build
pnpm start
```

The site is a Docusaurus TypeScript project. Baran docs live under `docs/baran`
(served at `/baran`) and Liskov docs under `docs/liskov` (served at `/liskov`),
registered as two docs instances in `docusaurus.config.ts`. The custom homepage
at `/` (`src/pages/index.tsx`) fronts both products. Legacy `/switchboard/*` URLs
redirect to `/baran/*` via `vercel.json`.

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
- Describe Baran as secure HTTPS ingress for supported long-running Acurast
  Node.js jobs. Explain unsupported hosting cases as requirements, not internal
  release staging.
- Describe Liskov as managed replacement-custody deployment. Commands and
  package names use the Baran/Liskov brand ahead of the CLI rename — keep prose
  consistent with the marketing site, not the current `proof switchboard`/`proof
  slipway` codenames.
- Do not add Blackbox or Lockbox navigation until their public docs are ready.
- The `.slipway/` canary app, `slipway:*` scripts, and the `Slipway Artifact`
  workflow are internal infra and intentionally keep the `slipway` codename.
