---
title: DNS And ACME Failures
description: DNS and certificate troubleshooting content target.
---

# DNS And ACME Failures

This page will document DNS and certificate diagnosis.

## Planned Coverage

- Canonical endpoint DNS readiness.
- Customer CNAME and `_acme-challenge` delegation.
- Job-owned ACME certificate requests.
- SNI and hostname probe expectations.
- Why raw-IP HTTPS probes can be misleading.
- `switchboard hostname status`.

The docs should make clear that application TLS terminates in the Acurast job,
not at the gateway.
