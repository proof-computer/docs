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

You can start in either of two ways:

- **[Launch from Marketplace](./get-started/marketplace.md)** when you want a
  curated application and do not need to maintain its source.
- **[Deploy from GitHub](./get-started/github.md)** when you are bringing your
  own repository and want a verifiable release trail.

Both paths create a Liskov **Application**. The Application keeps your desired
configuration, immutable artifact evidence, deployments, logs, billing, and
lifecycle together. Liskov manages the Acurast jobs needed to keep that intent
running over time.

## What v1 gives you

- A proof trail from a Marketplace version or GitHub commit to the artifact,
  effective policy, Acurast job, processor, and runtime evidence.
- Managed variables and secrets, with job-bound delivery.
- Bounded spend through USD Service Credits. You do not manage an ACU wallet.
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
