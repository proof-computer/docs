# PROOF Docs

Public documentation site for running services on PROOF's confidential-compute
stack.

Baran docs cover secure HTTP ingress for supported Acurast jobs. Liskov docs
cover the v1 customer path from Marketplace or GitHub through configuration,
operation, proof, billing, reference, and recovery. The two products remain
independent.

## Development

```fish
pnpm install
pnpm check:liskov
pnpm typecheck:liskov-examples
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

The `.slipway/application-policy.json` file declares the docs site with the
strict Liskov application-manifest V4 contract as the `proof-docs` internal
canary Application. Its build release is intentionally no-secret and uses a generated
single-file Node entrypoint for Acurast:

```fish
pnpm acurast:build
pnpm acurast:start
```

The manual `Slipway Artifact` workflow packages the same entrypoint, uploads
or accepts an already-pinned `ipfs://` script, and posts GitHub OIDC artifact
evidence bound to the exact authored and release-intent digests.

## Content Rules

- Keep user-facing docs aligned with accepted product decisions and current
  owner implementations, not internal monorepo paths or temporary rollout
  gates.
- Use the Liskov capability reference as the public availability owner. Label
  an unavailable v1 step with its exact release gate; keep internal and
  post-v1 recipes out of navigation.
- Keep the Marketplace and GitHub paths complete for new readers, and preserve
  exact commands, fields, status tokens, units, and boundaries in Reference.
- Describe Baran as a separate secure HTTPS ingress product for supported
  long-running Acurast jobs. Liskov does not imply hosted ingress.
- Use the Liskov, Baran, managed secrets, Liskov logging, and USD Service Credit
  names in public prose. Keep compatibility codenames only when a reader must
  type or recognize a literal contract.
- Run `pnpm check:liskov`, `pnpm typecheck:liskov-examples`, `pnpm typecheck`,
  and `pnpm build` before publishing Liskov changes.
- The `.slipway/` canary app, `slipway:*` scripts, and the `Slipway Artifact`
  workflow are internal infra and intentionally keep the `slipway` codename.
