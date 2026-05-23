---
title: Troubleshooting
description: Switchboard troubleshooting map.
---

# Troubleshooting

Troubleshooting pages should start from the exact failing stage and then point
to the narrowest safe command.

## First Rule

Do not retry a spend command until you know whether the previous attempt
created an Acurast deployment, funded a Hub session, registered a job, or
activated a route.

Start read-only:

```fish
switchboard preflight --quote --json
switchboard deploy status
switchboard deploy doctor --report <report.json>
switchboard status --json
```

## Pages

- [Deployment Failures](./deploy.md): preflight, upload, funding, Acurast,
  registration, timeout, and resume diagnosis.
- [DNS And ACME Failures](./dns-acme.md): canonical DNS, customer CNAME,
  challenge delegation, certificate authorization, and SNI probes.

## Redaction

Do not paste decrypted logs, full private workflow snapshots, local secret
files, private keys, seeds, bearer tokens, DNS tokens, or raw runtime env into
public issues.
