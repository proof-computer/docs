# AGENTS.md — PROOF public documentation

This repository owns the public Liskov and Baran documentation. When this
checkout is used through the Liskov orchestrator, the root `AGENTS.md` also
applies. This file governs documentation-specific work.

## Public documentation is part of the release

A customer-facing feature is not publicly complete merely because code merged,
a route exists, a type was exported, or a feature flag was added. Its
documentation is current only after the intended customer can use the feature
and the corresponding docs are validated and deployed.

When a feature becomes available, changes availability, or is withdrawn, update
the public docs in the same logical release. Do not wait for a later cleanup
pass.

## Confirm availability before changing claims

Before promoting a capability:

1. Identify the authoritative owner implementation and accepted product
   decision.
2. Verify the exact released artifact, package version, tag, schema, flag,
   entitlement, Marketplace descriptor, or production route that makes the
   capability usable by its intended audience.
3. Confirm the support boundary: public v1, Preview with a named cohort,
   internal, release-gated, or outside v1.
4. Check the complete customer path, not only the API or UI control. A feature
   is not live if a required package, workflow tag, account path, funding path,
   or production gate is still unavailable.

Do not infer availability from source code alone. If authorities disagree,
leave the public claim gated, record the conflict in the orchestrator
documentation system, and ask the owner. Never use an archived implementation
as the current specification.

## Required update when a feature goes live

Update every affected layer:

- `docs/liskov/reference/capabilities.md` — change the canonical public
  classification and remove the exact release-gate note.
- The first-use journey or task page — add the smallest complete supported path
  with prerequisites, cost or mutation effects, verification, common failure,
  and next step.
- Concepts — update only when the feature changes a durable mental model,
  responsibility, trust boundary, lifecycle, or non-effect.
- Reference — update literal commands, flags, fields, schemas, versions,
  defaults, bounds, units, statuses, errors, and precedence.
- Troubleshooting — add symptoms and safe customer actions; never expose
  platform repair commands.
- Navigation and landing pages — expose the feature only when it belongs in the
  normal customer journey. Preview must remain isolated from the default path.
- Redirects — preserve useful replaced URLs without retaining a public legacy
  archive.
- Fixtures and `scripts/check-liskov-docs.mjs` — pin the released contract and
  add a regression assertion for the availability transition.
- The orchestrator content contract/source map and a dated release work note —
  record the owner commit, package/tag/schema/descriptor, rollout evidence,
  docs commit, and production deployment.

Remove temporary caution text once the gate is genuinely gone. Do not leave a
page saying “release-gated” after the supported path is live, and do not remove
the notice before then.

## Downgrades, withdrawals, and emergency changes

When a capability is paused, narrowed, deprecated, or withdrawn:

- update its classification and affected task pages immediately;
- state the customer impact and safe alternative without exposing incident or
  operator internals;
- remove it from recommended navigation when it is no longer a supported path;
- preserve redirects where an existing URL still has a useful destination; and
- verify the deployed site after the emergency product change.

An emergency rollback may precede the docs commit, but the docs correction is
part of closing the rollback.

## Source and writing rules

- Research owner paths; existing public prose is not product authority.
- Keep Liskov, Acurast, and Baran responsibilities distinct.
- Write for readers who may not know Acurast, blockchains, confidential
  computing, or software delivery.
- Use progressive disclosure: first success, routine operation, concepts, then
  exact reference.
- Make every mutation and spend effect explicit and every task verifiable.
- Use the calm, friendly, direct vocabulary already established in the v1
  docs. Preserve canonical meanings for Application, manifest, effective
  policy, artifact version, deployment, job, processor, runtime instance,
  Service Credit, reserve, replacement, and retirement.
- Keep internal, compatibility, and post-v1 workflows out of customer recipes.

## Validation and delivery

For Liskov changes, run:

```sh
pnpm check:liskov
pnpm typecheck:liskov-examples
pnpm typecheck
pnpm build
```

Also run the owner-backed checks relevant to the feature:

- strict Rust validation for Manifest V4 examples;
- packaged oclif comparison for CLI commands and flags;
- pinned-package typechecking for runtime SDK examples;
- reusable-workflow comparison for GitHub Actions;
- descriptor and acceptance-evidence comparison for Marketplace offerings; and
- exported schema/fixture comparison for statuses, errors, fields, defaults,
  units, and limits.

Review both affected fresh-user journeys and the agent-retrieval questions.
Commit and push this repository separately from implementation repositories.
The normal Vercel integration owns deployment. Verify the commit status and the
affected production routes at `https://docs.proof.computer`.

Do not declare the feature's public release complete until the documentation
deployment succeeds. If documentation cannot safely describe the behavior,
the public release still has an unresolved contract.
