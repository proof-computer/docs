---
sidebar_position: 1
title: Liskov
description: Deploy applications to secure Acurast phones, then inspect the evidence from source to running job.
---

# Deploy like a cloud. Verify what actually ran.

Liskov helps you run an application on the Acurast network without managing
the deployment machinery yourself. Acurast supplies phones with trusted
execution environments (TEEs): hardware-isolated places where your code can
run away from a conventional cloud server.

Start with **[Deploy from GitHub](./get-started/github.md)** when you are
bringing your own repository and want a verifiable release trail. Publication
is enabled only for eligible organizations, so check the availability note
before preparing a release.

:::caution Release boundary
Marketplace launch, Uptime Prober, plan and terms acceptance, and Stripe USD
checkout are still release-gated. A paid plan is not activated by writing a
plan id; it becomes usable only after reconciled payment state, and production
paid billing is not enabled. Their current production use is limited to
internal first-party engineering acceptance. Do not enter payment details or
offering secrets until the [capability matrix](./reference/capabilities.md)
classifies the path as supported customer behavior.
:::

A supported launch creates a Liskov **Application**. The Application keeps your desired
configuration, immutable artifact evidence, deployments, logs, billing, and
lifecycle together. Liskov manages the Acurast jobs needed to keep that intent
running over time.

## What v1 gives you

- A proof trail from a GitHub commit to the artifact,
  effective policy, Acurast job, processor, and runtime evidence.
- Managed variables and secrets, with job-bound delivery.
- Read-only visibility into available, reserved, and used USD Service Credits.
  Customer checkout is not yet a supported way to add credit.
- Clear Application status and an Action Plan when your input is required.
- Time-boxed jobs, deliberate updates, pause/resume, bounded retry, and safe
  retirement.

Liskov coordinates execution; Acurast owns the external processor network and
job schedules. Existing Acurast jobs are not ordinary virtual machines that
Liskov can stop instantly. The docs call out this boundary whenever an action
has a delayed or limited effect.

## Find your next step

- New to Liskov: [choose your path](./get-started/choose-your-path.md).
- Evaluating security: [trust and data boundaries](./concepts/trust-boundaries.md).
- Operating an Application: [Deploy & operate](./operate/index.md).
- Looking for an exact field or command: [Reference](./reference/index.md).
- Something is not working: [Troubleshooting](./troubleshooting/index.md).
