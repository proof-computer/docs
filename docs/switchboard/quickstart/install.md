---
title: Install And Configure
description: Installation and first context setup for Switchboard.
---

# Install And Configure

Install Switchboard on a developer or operator machine that can hold local
signing material. A Switchboard app repository should contain app code and
project config, not live credentials.

## Requirements

- Node.js 22 or newer for the CLI.
- Private-beta access from PROOF.
- A funded Acurast mainnet account for deployment fees.
- A funded Polkadot Hub account with an accepted quote asset.
- A small Hub native balance for payment transactions.
- A PROOF beta operator ID or admitted gateway capacity.
- DNS authority for the current private-beta DNS path, unless you use BYO TLS
  for every hostname.

## Install The PROOF CLI

```fish
npm install --global @proof-computer/proof-cli
proof plugins install @proof-computer/proof-cli-switchboard
proof switchboard --help
```

The PROOF CLI owns the `proof` binary and loads product plugins. Switchboard is
the first public plugin. Blackbox is also public, while Slipway and Lockbox
plugins remain private until intentionally exposed.

## Install The Standalone Switchboard CLI

Use this path when instructions, scripts, or support output refer to the
standalone compatibility binary:

```fish
npm install --global @proof-computer/switchboard-cli
switchboard help
```

Both surfaces call the same Switchboard command implementations for native
commands. In these docs, `switchboard deploy` means the standalone binary or
`proof switchboard deploy`.

## Configure Secrets

Switchboard contexts store environment variable names. You provide the values
through your shell or a local secret manager:

```fish
set -gx ACURAST_NETWORK mainnet
set -gx ACURAST_MAINNET_SEED '<funded acurast mnemonic>'
set -gx ACURAST_MAINNET_ADDRESS '<expected acurast ss58 address>'

set -gx POLKADOT_ADDRESS '<funded polkadot ss58 address>'
set -gx POLKADOT_SEED '<funded polkadot seed uri or mnemonic>'

set -gx OPERATOR_ID '<proof beta operator id>'
set -gx CLOUDFLARE_API_TOKEN '<proof beta dns token>'
```

The default network manifest is discovered from:

```text
https://control.switchboard.proof.computer/v1/network-manifest
```

Only override it when PROOF gives you an alternate beta manifest:

```fish
set -gx PROOF_NETWORK_MANIFEST_URL 'https://control.switchboard.proof.computer/v1/network-manifest'
```

## Create A Context

```fish
switchboard context add mainnet
```

The wizard prompts for:

- operator ID
- Acurast seed environment variable
- expected Acurast address environment variable
- Polkadot payment address and signer
- optional Ledger payment signer settings
- soft balance checks

The wizard refuses to overwrite an existing context. Edit an existing context
with `context set`:

```fish
switchboard context set mainnet \
  --use \
  --operator-id $OPERATOR_ID \
  --acurast-seed-env ACURAST_MAINNET_SEED \
  --acurast-address-env ACURAST_MAINNET_ADDRESS \
  --polkadot-address-env POLKADOT_ADDRESS \
  --polkadot-seed-env POLKADOT_SEED
```

Attach DNS credentials as a separate step:

```fish
switchboard context dns set cloudflare --token-env CLOUDFLARE_API_TOKEN
```

Skip DNS provider configuration only when you plan to use BYO TLS for every
hostname.

## Ledger Payment Signing

Ledger signing is scoped to Hub funding, claim, and refund transactions. It
does not replace Acurast deployment signing.

```fish
switchboard context set ledger \
  --use \
  --operator-id $OPERATOR_ID \
  --polkadot-signer ledger \
  --polkadot-address '<ledger polkadot address>' \
  --ledger-account 0 \
  --ledger-address-index 0 \
  --ledger-metadata-chain-id '<zondax chain id>' \
  --acurast-seed-env ACURAST_MAINNET_SEED \
  --acurast-address-env ACURAST_MAINNET_ADDRESS
```

Use `--ledger-mode generic` for the Polkadot Generic app. The legacy Statemint
path is available with `--ledger-mode legacy --ledger-chain statemint`.

## Check The Active Context

```fish
switchboard context current
switchboard context list
switchboard preflight --quote
```

Run preflight after changing credentials, funding accounts, DNS authority, or
the selected context.
