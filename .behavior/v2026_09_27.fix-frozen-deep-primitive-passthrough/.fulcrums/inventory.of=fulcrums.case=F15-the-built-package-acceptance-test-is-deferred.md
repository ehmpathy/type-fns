# F15 — the acceptance test of the built package root is deferred

## .the fork

| option | effect |
|--------|--------|
| **defer** — a dream, plus a hand check of `dist/` for this release | the patch stays one type + one companion; ci config untouched |
| add `src/index.acceptance.test.ts` now | a clamp on the built root; the repo's first acceptance suite, and with it the keyrack `strict` source in `jest.acceptance.env.ts` enters ci |

## .taken — defer, at 5.1

- **the harm is real, and checked once by hand.** `npm run build`; `dist/index.d.ts` carries all
  three new exports; `dist/companions/asFrozenDeep.js` requires only `helpful-errors`;
  `dist/companions/asFrozenDeep.d.ts` imports `'../types/FrozenDeep'`, the alias rewritten.
- **the add ripples past the diff, and ci holds no key for it.** `jest.acceptance.env.ts` calls
  `keyrack.source({ env: 'test', owner: 'ehmpath', mode: 'strict' })`. `.agent/keyrack.yml` sets
  `env.test: null` but extends the mechanic manifest, whose `env.test` lists `FIREWORKS_API_KEY`.
  `.github/workflows/.test.yml` job `test-shards-acceptance` passes no secret. today the setup
  never runs — `--passWithNoTests` exits before it. the first acceptance test runs it, and a strict
  source with an absent key fails the required check `suite / test-acceptance-locally`.
- **so the close is not the driver's to make.** it needs a ci secret, or a change to the shared
  acceptance env that declapract owns. both are grants, not diffs.
- **the unit grain now carries what it can.** `FrozenDeep.test.ts` snaps the root's runtime export
  names; `asFrozenDeep.test.ts` snaps every refusal message. the residual gap is `dist/` alone.
- **no export in this repo has one.** the gap predates the route; the dream owns it.

## .rework — clean

one new test file, plus whatever keyrack setup ci needs. no caller depends on its absence.

## .confidence — 85%

the residual: `rule.require.test-coverage-by-grain` grades an absent contract acceptance test a
blocker. a reviewer who reads the package root as that contract would be right to overrule, and the
keyrack cost may prove zero once measured.

## .where

`.dream/v2026_09_29.fix.type-fns-has-no-acceptance-test-of-its-built-package-root.md` ·
review `role-standards-coverage`.
