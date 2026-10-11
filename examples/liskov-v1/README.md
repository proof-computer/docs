# Liskov v1 documentation fixtures

These files are the executable source for the public Manifest V4, runtime SDK,
and reusable-workflow examples. `retained-v5-starter/` is the complete
once-mode JavaScript starter used by the retained V5 guide. The docs content
check verifies their stable contract values. Release validation additionally:

- runs the JSON fixture through `slipway-application-policy::validate_manifest`;
- clean-installs, tests, and bundles the starter against
  `@proof-computer/liskov-runtime` `v0.3.38`; and
- compares the workflow with the `liskov-github-actions` `v1` contract.

The moving `v1` workflow reference was verified at immutable release `v1.2.4`.

`builder-iteration/` is the input for the `453u` builder edit / diagnose / recover
exercise; its own tests, not the docs content check, pin its exact A, B and C
variants.

`runtime-context.schema.json` is the verbatim owner schema shipped in SDK
`v0.3.38` (SHA-256 `006df5281972874dab8a6ebe34517d235af3c2e66baaecc4b7ba79b4a309f97a`).
The checker compares every documented field and type against it.

`runtime-context.mts` is typechecked against SDK `v0.3.38`. It reads stable
keys, uses geography only in the `ready` state, and makes one explicit refresh
without automatic retry or logging. The capability remains release-gated;
this fixture does not establish live-job availability.
