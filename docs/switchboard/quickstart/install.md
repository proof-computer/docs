---
title: Install And Configure
description: Installation and first context setup for Switchboard.
---

# Install And Configure

Install Switchboard on a machine that can hold local signing material. A
Switchboard app repository should contain app code and project config, not
live credentials.

## Requirements

- Node.js 22 or newer for the CLI.
- Access values from PROOF for your deployment environment.
- A funded Acurast mainnet account for deployment fees.
- A funded Polkadot Hub account with an accepted quote asset.
- A small Hub native balance for payment transactions.
- Permission to create DNS records for any customer hostname you attach.

## Install The PROOF CLI

```fish
npm install --global @proof-computer/proof-cli
proof plugins install @proof-computer/proof-cli-switchboard
proof switchboard --help
```

All public examples use the `proof switchboard ...` command group.

## Use The Wizard

Switchboard contexts store environment variable names, not secret values. Keep
the values in your shell, password manager, or local secret file.

```fish
proof switchboard context add mainnet
```

The wizard prompts for:

- Acurast seed environment variable
- expected Acurast address environment variable
- Polkadot payment address and signer
- optional Ledger payment signer settings
- soft balance checks

The wizard refuses to overwrite an existing context. Edit an existing context
with `context set`:

```fish
proof switchboard context set mainnet \
  --use \
  --acurast-seed-env ACURAST_MAINNET_SEED \
  --acurast-address-env ACURAST_MAINNET_ADDRESS \
  --polkadot-address-env POLKADOT_ADDRESS \
  --polkadot-seed-env POLKADOT_SEED
```

## Ledger Payment Signing

Ledger signing is scoped to Hub funding, claim, and refund transactions. It
does not replace Acurast deployment signing.

```fish
proof switchboard context set ledger \
  --use \
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
proof switchboard context current
proof switchboard context list
proof switchboard preflight --quote
```

Run preflight after changing credentials, funding accounts, or the selected
context.
