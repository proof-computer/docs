---
title: Quickstart
description: The first path from install to public HTTPS endpoint.
---

# Quickstart

This is the shortest private-beta path from a local machine to a public
Switchboard HTTPS endpoint.

Use the bundled demo first. It exercises the real deploy path, spends only
when you pass `--yes-spend`, and renders a proof page showing route, Acurast
job, Hub registration, job-owned TLS, challenge traffic, and observability
state.

## 1. Install

```fish
npm install --global @proof-computer/proof-cli
proof plugins install @proof-computer/proof-cli-switchboard
proof switchboard --help
```

Or install the standalone binary:

```fish
npm install --global @proof-computer/switchboard-cli
switchboard help
```

Switchboard CLI packages currently require Node.js 22 or newer.

## 2. Configure Local Secrets

Use the private-beta values PROOF gives you. Keep them in your shell, password
manager, or a local secret file. Do not commit them.

```fish
set -gx ACURAST_NETWORK mainnet
set -gx ACURAST_MAINNET_SEED '<funded acurast mnemonic>'
set -gx ACURAST_MAINNET_ADDRESS '<expected acurast ss58 address>'

set -gx POLKADOT_ADDRESS '<funded polkadot ss58 address>'
set -gx POLKADOT_SEED '<funded polkadot seed uri or mnemonic>'

set -gx OPERATOR_ID '<proof beta operator id>'
set -gx CLOUDFLARE_API_TOKEN '<proof beta dns token>'
```

Do not put PROOF relayer keys, recorder keys, validator signing seeds,
operator gateway secrets, ACME account keys, or control-plane bearer tokens in
developer app repos.

## 3. Create A Context

Contexts store non-secret metadata and environment variable names under
`~/.switchboard/contexts.json`.

```fish
switchboard context add mainnet
switchboard context dns set cloudflare --token-env CLOUDFLARE_API_TOKEN
switchboard context current
```

`context add` is interactive. It prompts for Acurast and Polkadot identities,
derives addresses from configured seeds, and runs soft balance checks for ACU,
Hub native token, and the default accepted Hub asset.

For scripted setup, use `context set`:

```fish
switchboard context set mainnet \
  --use \
  --operator-id $OPERATOR_ID \
  --acurast-seed-env ACURAST_MAINNET_SEED \
  --acurast-address-env ACURAST_MAINNET_ADDRESS \
  --polkadot-address-env POLKADOT_ADDRESS \
  --polkadot-seed-env POLKADOT_SEED \
  --cloudflare-api-token-env CLOUDFLARE_API_TOKEN
```

## 4. Run Preflight

```fish
switchboard preflight --quote
```

Preflight checks the signed network manifest, control-plane health, Hub RPCs,
Acurast identity, Polkadot payment identity, accepted assets, DNS authority,
and local deploy runner availability.

Use JSON for automation or support tickets:

```fish
switchboard preflight --quote --json
```

## 5. Launch The Demo

Inspect the plan without spending:

```fish
switchboard launch-demo --dry-run
```

Launch when you are ready to spend ACU and the configured Hub payment asset:

```fish
switchboard launch-demo --yes-spend
```

The CLI selects live capacity, creates a temporary project using
`@proofcomputer/switchboard-express-demo`, deploys it to Acurast, funds the
Switchboard quote, waits for registration and route readiness, then prints the
public URL.

## 6. Deploy Your Own Project

From your app directory:

```fish
switchboard init \
  --project hello-api \
  --endpoint hello-<name>.ingress.works \
  --context mainnet \
  --quote \
  --activate

switchboard preflight --quote
switchboard deploy --yes --dry-run --json
switchboard deploy --yes --duration-minutes 60
switchboard status
```

`switchboard init` writes `switchboard.json` and `.switchboard/`. Deployment
state, reports, and workflow snapshots stay under `.switchboard/` in the
project directory.

## Next Steps

- [Install And Configure](./install.md) for detail on contexts and secrets.
- [Launch The Demo](./launch-demo.md) for demo-specific behavior.
- [Deployment Lifecycle](../concepts/deployment-lifecycle.md) for what happens
  after you run `deploy`.
- [Deployment Failures](../troubleshooting/deploy.md) if a run stops before a
  public URL is ready.
