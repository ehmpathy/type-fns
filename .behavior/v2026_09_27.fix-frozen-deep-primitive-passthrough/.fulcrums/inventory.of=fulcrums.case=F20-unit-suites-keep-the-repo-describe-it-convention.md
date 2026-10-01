# F20 — unit suites keep the repo's describe/it convention

## .the fork

`rule.require.given-when-then` requires given/when/then for integration and acceptance tests, and
*recommends* it for unit tests. peer lane r7 raised the new unit suites (`asFrozenDeep.test.ts`,
`FrozenDeep.test.ts`) as a nitpick.

| option | cost |
|--------|------|
| **a — keep describe/it in unit suites** (taken) | the new unit suites read like 17 of the 19 extant ones |
| b — rewrite the two new unit suites to given/when/then | ~1000 lines restructured, no behavior change |
| c — rewrite every unit suite | a corpus-wide rewrite smuggled into a `fix` — forbidden (`rule.prefer.scouts-honor`) |

## .taken, and why at the time

17 of the 19 extant unit suites in `src/` use describe/it; two (`ArrayWith.test.ts`,
`isPresent.test.ts`) use given/when/then. the rule marks unit-grain given/when/then as recommended,
not required. the two new files match the majority of their neighbors. the grains where the rule is required —
`src/index.acceptance.test.ts` and `kindsWithSlotMutators.integration.test.ts` — use given/when/then.

## .rework

**clean** — a mechanical restructure of two files, no behavior change. a repo-wide move is a
separate pr.

## .confidence — 88%, and why not higher

the repo already holds both conventions, so option b adds no new split — it only costs the rewrite.
a wisher may prefer the new files lead toward given/when/then.

## .where

- `src/companions/asFrozenDeep.test.ts`, `src/types/FrozenDeep.test.ts`
- peer lane r7, nitpick.1

## .verdict

awaits the council.
