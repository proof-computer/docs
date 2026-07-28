# Liskov v1 documentation fixtures

These files are the executable source for the public Manifest V4, runtime SDK,
and reusable-workflow examples. The docs content check verifies their stable
contract values. Release validation additionally:

- runs the JSON fixture through `slipway-application-policy::validate_manifest`;
- typechecks the TypeScript fixture against
  `@proof-computer/liskov-runtime` `v0.3.26`; and
- compares the workflow with the `liskov-github-actions` `v1` contract.

The `v1` workflow reference is intentionally release-gated until the tag
exists.
