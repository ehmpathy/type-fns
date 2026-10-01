# F18 — the doc-drift clamp waits on F15's grant

## .the fork

| option | effect |
|--------|--------|
| **defer** the clamp; sync the readme and the `.bound` by hand in this round | the docs match the runtime list today; a later kind can drift again |
| add an `asFrozenDeep.integration.test.ts` that reads both docs | the clamp lands, and fails in ci on the strict keyrack source |
| read the docs from a unit test | a unit test crosses the filesystem boundary (`rule.forbid.unit.remote-boundaries`) |

## .taken — defer, at 5.1

- **a doc read is the integration grain**, and `jest.integration.env.ts` calls
  `keyrack.source({ env: 'test', owner: 'ehmpath', mode: 'strict' })` — the wall F15 already names.
- **the drift instance is repaired now**: the readme and `FrozenDeep.ts` `.bound` name every kind in
  `kindsWithSlotMutators`, `RegExp` and `ArrayBuffer` included.
- the work lives in `dreams/v2026_09_29.fix.slot-mutator-docs-have-no-drift-clamp.md`.

## .verdict — reversed at 5.3

5.3's buttonup mandate forbids a deferred test, and F15, the wall this deferral leaned on, was
itself reversed at 5.3. so the clamp landed:

- `src/companions/kindsWithSlotMutators.ts` holds the list (not exported from the package root);
  `asFrozenDeep.ts` imports it
- `src/companions/kindsWithSlotMutators.integration.test.ts` slices the one passage in each doc that
  enumerates the kinds — readme, `asFrozenDeep` jsdoc, `FrozenDeep` jsdoc — and asserts each names
  every kind (or, for `FrozenDeep`, gives it a `Frozen*` arm). a moved anchor throws
- bites: `RegExp` dropped from the readme's mutator paragraph → `it names RegExp` red
- ci needs the grant F15 needs; `5.3.verification.handoff.v1.to_foreman.md` names both jobs

## .rework — clean

one new test file plus one export of the list. no caller changes.

## .confidence — 88%

the residual: a reviewer may hold that a unit-grain clamp via an exported string list (no fs) is
enough, which would make the deferral avoidable.

## .where

peer lane `enroll-impl-arch-defects` i005 nitpick.1 · `src/companions/asFrozenDeep.ts` ·
`src/types/FrozenDeep.ts` · `readme.md`.
