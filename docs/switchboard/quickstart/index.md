---
title: Quickstart
description: The first path from install to public HTTPS endpoint.
---

# Quickstart

This is the fastest path from a local machine to a public Switchboard HTTPS
endpoint.

Use the bundled demo first. It exercises the real deploy path, spends only
when you pass `--yes-spend`, and renders a proof page showing route, Acurast
job, Hub registration, job-owned TLS, challenge traffic, and observability
state.

## 1. Install The PROOF CLI

```fish
npm install --global @proof-computer/proof-cli
proof plugins install @proof-computer/proof-cli-switchboard
proof switchboard --help
```

The PROOF CLI currently requires Node.js 22 or newer.

## 2. Use The Wizard

Contexts store non-secret metadata and environment variable names under
`~/.switchboard/contexts.json`.

```fish
proof switchboard context add mainnet
proof switchboard context current
```

`context add` is interactive. It prompts for Acurast and Polkadot identities,
derives addresses from configured seeds, and runs soft balance checks for ACU,
Hub native token, and the default accepted Hub asset.

Keep secret values in your shell, password manager, or local secret file. Do
not put local signing material or deployment credentials in app repos.

## 3. Run Preflight

```fish
proof switchboard preflight --quote
```

Preflight checks the signed network manifest, control-plane health, Hub RPCs,
Acurast identity, Polkadot payment identity, accepted assets, and local deploy
runner availability.

Use JSON for automation or support tickets:

```fish
proof switchboard preflight --quote --json
```

## 4. Launch The Demo

Inspect the plan without spending:

```fish
proof switchboard launch-demo --dry-run
```

Launch when you are ready to spend ACU and the configured Hub payment asset:

```fish
proof switchboard launch-demo --yes-spend
```

The CLI selects live capacity, creates a temporary project using
`@proofcomputer/switchboard-express-demo`, deploys it to Acurast, funds the
Switchboard quote, waits for registration and route readiness, then prints the
public URL.

## 5. Deploy Your Own Project

From your app directory:

```fish
proof switchboard init \
  --project hello-api \
  --context mainnet \
  --quote \
  --activate

proof switchboard preflight --quote
proof switchboard deploy --yes --dry-run --json
proof switchboard deploy --yes --duration-minutes 60
proof switchboard status
```

`proof switchboard init` writes `switchboard.json` and `.switchboard/`.
Switchboard allocates the public PROOF endpoint during deployment. Deployment
state, reports, and workflow snapshots stay under `.switchboard/` in the
project directory.

## Next Steps

- [Install And Configure](./install.md) for detail on contexts and secrets.
- [Launch The Demo](./launch-demo.md) for demo-specific behavior.
- [Deployment Lifecycle](../concepts/deployment-lifecycle.md) for what happens
  after you run `deploy`.
- [Deployment Failures](../troubleshooting/deploy.md) if a run stops before a
  public URL is ready.
