---
title: Cargo SSH Jobs
description: Cargo SSH and Script runtime documentation target.
---

# Cargo SSH Jobs

Cargo SSH is an advanced Switchboard workflow for inspectable Script runtime
jobs.

Use the normal Node.js webserver path first. Cargo SSH is useful when you want
an Acurast Shell job that exposes Dropbear through Switchboard's public
SNI route and uses the Acurast Cargo bridge signer for privileged registration
and certificate requests.

## Scaffold

```fish
mkdir -p switchboard-ssh-demo
switchboard init \
  --template ssh \
  --distro ubuntu \
  --project-dir ./switchboard-ssh-demo \
  --context mainnet
```

The template generates an inspectable Script/Cargo project. Its bootstrap uses
Dropbear for SSH and the Cargo bridge signer for:

- deployment-intent claim
- job-signed ingress registration
- job-ACME certificate request signing

It does not fall back to `JOB_SIGNER_PRIVATE_KEY` inside the job.

## Deploy

```fish
cd switchboard-ssh-demo
switchboard preflight --quote
switchboard deploy --yes --dry-run --json
switchboard deploy --yes
```

Script runtime deploys require Acurast processors that advertise the Shell
module. Switchboard filters capacity for that runtime, but live availability
can still change between preflight, quote, and submit.

## Connect Through SNI

After deployment, use the hostname from the deploy report. The public route is
TLS/SNI passthrough to the job, which then exposes the SSH banner.

If you are diagnosing the route, start with:

```fish
switchboard deploy doctor --report <report.json> --probe
```

`--probe` is read-only. It performs public TLS/SNI and SSH banner checks. It
does not spend, deploy, mutate DNS, mutate routes, or record settlement.

## Bridge Diagnostics

Generated jobs include:

```text
switchboard-cargo-bridge-doctor
```

Run it from an SSH login shell when PROOF support asks you to prove the job's
Cargo bridge shape. It signs a fixed diagnostic challenge and avoids printing
the bridge socket, private key, token, seed, bearer token, or full reusable
signature material.

## Common Issues

- No Shell processor available: try later or ask PROOF for supported capacity.
- Public probe resets: check whether the job advertised the processor LAN
  address and whether gateway route-state points at the job TLS port.
- Login shell lacks `BRIDGE_SOCKET`: this can be normal. Original job
  processes may still retain bridge access; use the bridge doctor helper.
- Late local timeout: run `deploy status` and `deploy doctor` before spending
  again.
