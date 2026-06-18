---
title: DNS And ACME Failures
description: Diagnose DNS, ACME, and SNI route problems.
---

# DNS And ACME Failures

DNS and certificate failures are usually either authority problems, propagation
problems, or hostname/SNI probe mistakes.

## Start With Status

```fish
proof baran hostname status app.example.com --json
proof baran status --json
```

For deploy-level diagnosis:

```fish
proof baran deploy doctor --report <report.json> --probe
```

## Canonical DNS Not Ready

The canonical Baran endpoint uses PROOF-managed DNS and ACME authority.
Builders should not configure Cloudflare or other PROOF zone credentials in
their local context.

If the canonical endpoint is not resolving or the job-owned certificate is not
progressing, run read-only diagnostics and share the report with PROOF support:

```fish
proof baran preflight --quote --json
proof baran deploy doctor --report <report.json> --probe
```

## Customer CNAME Not Validated

Check that your traffic CNAME points at the canonical endpoint Baran
printed. Then check status:

```fish
proof baran hostname status app.example.com
```

The CLI may show DNS control-panel hints from NS records. Those hints are not
authority; the relay's validation result is.

## ACME Challenge Pending

Default customer hostname mode uses `_acme-challenge` CNAME delegation. Make
sure the record is exactly under:

```text
_acme-challenge.<your hostname>
```

If you used `--manual-dns01`, `hostname status` prints the transient TXT value
you need to create. Manual values can change between attempts, so re-read
status before editing DNS.

## Certificate Pending After Registration

The job registered but has not completed job-owned ACME issuance. Check:

- canonical DNS exists
- `_acme-challenge` DNS is delegated or the manual TXT exists
- the job can reach the relay/control plane
- the job runtime has the certificate request config it needs

Application TLS terminates inside the Acurast job. The gateway does not hold
the application private key.

## Raw IP HTTPS Probe Looks Broken

Do not diagnose certificates with a raw IP HTTPS request. The gateway and job
expect the real hostname/SNI path. Raw-IP probes can produce confusing TLS
errors even when the hostname route is healthy.

Use the hostname:

```fish
curl -v https://app.example.com/
```

For SNI route diagnosis:

```fish
proof baran deploy doctor --report <report.json> --probe
```

## BYO TLS

With `--byo-tls`, Baran configures routing only. Your Acurast job must
serve a valid certificate for the customer hostname. PROOF does not request,
renew, or install the certificate for that hostname.
