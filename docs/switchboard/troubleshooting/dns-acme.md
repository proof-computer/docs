---
title: DNS And ACME Failures
description: DNS and certificate troubleshooting content target.
---

# DNS And ACME Failures

DNS and certificate failures are usually either authority problems, propagation
problems, or hostname/SNI probe mistakes.

## Start With Status

```fish
switchboard hostname status app.example.com --json
switchboard status --json
```

For deploy-level diagnosis:

```fish
switchboard deploy doctor --report <report.json> --probe
```

## DNS Authority Missing

If preflight says DNS authority is missing, confirm:

```fish
set -gx CLOUDFLARE_API_TOKEN '<proof beta dns token>'
switchboard context dns set cloudflare --token-env CLOUDFLARE_API_TOKEN
switchboard preflight --quote
```

`preflight --no-dns` is useful for diagnostics, but the normal job-owned ACME
deploy path expects real DNS.

## Customer CNAME Not Validated

Check that your traffic CNAME points at the canonical endpoint Switchboard
printed. Then check status:

```fish
switchboard hostname status app.example.com
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
switchboard deploy doctor --report <report.json> --probe
```

## BYO TLS

With `--byo-tls`, Switchboard configures routing only. Your Acurast job must
serve a valid certificate for the customer hostname. PROOF does not request,
renew, or install the certificate for that hostname.
