# PROOF Docs

Public documentation site for PROOF products.

Switchboard is the first published product area. Slipway, Blackbox, and
Lockbox are reserved as future product areas, but this site should not expose
placeholder navigation for them until their public docs are ready.

## Development

```fish
pnpm install
pnpm typecheck
pnpm build
pnpm start
```

The site is a Docusaurus TypeScript project. Switchboard docs live under
`docs/switchboard` and are served at `/switchboard`.

## Content Rules

- Keep user-facing docs aligned with public package surfaces, not internal
  monorepo paths.
- Mark unfinished pages as content targets instead of publishing stale
  operational instructions.
- Keep Switchboard's v1 scope narrow: production HTTPS ingress for supported
  long-running Acurast Node.js jobs, not generic hosting.
- Do not add Slipway, Blackbox, or Lockbox navigation until their public docs
  are ready.
