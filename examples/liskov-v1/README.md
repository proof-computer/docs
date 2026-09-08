# Liskov v1 documentation fixtures

These files are the executable source for the public Manifest V4, runtime SDK,
and reusable-workflow examples. `retained-v5-starter/` is the complete
once-mode JavaScript starter used by the retained V5 guide. The docs content
check verifies their stable contract values. Release validation additionally:

- runs the JSON fixture through `slipway-application-policy::validate_manifest`;
- clean-installs, tests, and bundles the starter against
  `@proof-computer/liskov-runtime` `v0.3.32`; and
- compares the workflow with the `liskov-github-actions` `v1` contract.

The moving `v1` workflow reference was verified at immutable release `v1.2.4`.
