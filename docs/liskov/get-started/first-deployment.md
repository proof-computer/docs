---
title: Follow your first deployment
description: Recognize normal deployment stages, know when action is required, and verify the result and proof chain.
---

# Follow your first deployment

An Acurast deployment crosses an external network and normally spends time in
several waiting stages. The Application overview is the customer summary; the
deployment timeline contains the exact evidence.

## What you should see

| Stage | Meaning | What to do |
| --- | --- | --- |
| **Preparing** | Liskov is validating policy, configuration, funds, and launch authority. | Wait unless the Action Plan asks for input. |
| **Submitted** | The Acurast registration was accepted. | Wait. Resubmitting can create ambiguity or duplicate spend. |
| **Processor assigned** | An Acurast phone accepted the job. This is chain assignment, not proof that your process is ready. | Wait for bootstrap/runtime contact. |
| **Bootstrapping** | Liskov is delivering job-bound configuration and the runtime is starting. | Check the Action Plan only if this becomes blocked. |
| **Runtime ready** | Signed runtime evidence says required capabilities are ready. | Verify the application's own output. |

Names in the detailed timeline may be more precise than these reader-facing
stages. Use [Statuses, actions, and errors](../reference/statuses-actions-errors.md)
when a literal token matters.

## Read Application posture

- **Ready** — the desired Application has healthy current runtime evidence.
- **In progress** — Liskov is advancing a normal stage or waiting for an
  expected external fact.
- **Needs action** — a typed blocker requires your input or offers a supported
  bounded action.
- **Inactive** — the Application is paused, retiring, retired, or otherwise not
  admitting new execution.

Do not infer readiness from processor assignment alone. A phone can accept a
job before it has fetched configuration, decrypted required secrets, or
reported runtime readiness.

## Verify customer value

First verify the application-specific output or diagnostic that your GitHub
repository defines. Marketplace and Uptime Prober remain release-gated and are
not part of this customer first-deployment path.

Then open **Proof** or the relevant deployment evidence and confirm:

1. the GitHub repo/ref/commit/workflow;
2. the artifact content identifier (CID) and digest;
3. the effective policy digest and version;
4. the Acurast job and processor identifiers; and
5. signed runtime contact for the current runtime instance.

These facts connect the release you selected to the job that contacted Liskov.
They do not prove every property of application behavior; see
[Attestation and the proof chain](../concepts/attestation.md).

## When to act

Use only the action offered by the Application's Action Plan. Updating a value,
adding funds, or correcting a manifest does not necessarily retry by itself.
The Action Plan tells you when a bounded retry is available.

If status remains **In progress**, do not repeatedly launch. Use
[Deployment waiting or needs action](../troubleshooting/deployment.md) to
distinguish a normal wait from a support boundary.

Next, learn how to [operate the Application](../operate/index.md).
