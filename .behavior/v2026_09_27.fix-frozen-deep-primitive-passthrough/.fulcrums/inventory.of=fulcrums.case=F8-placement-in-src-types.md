# F8 — `src/types/FrozenDeep.ts`, per the `HasMaybe` precedent

**rework** clean · **confidence** 97% · **status** settled by convention

## .verdict

unchanged; settled by convention.

## .the fork

| option | where the type lives |
|--------|---------------------|
| **A** | `src/types/FrozenDeep.ts` + one line in `src/index.ts` |
| **B** | `src/wrappers/` or `src/guards/`, beside `withAssure` |
| **C** | a new `src/types/readonly/` sub-directory |

## .taken, and why

**A.** the repo's layout answers it:

| directory | holds |
|-----------|-------|
| `src/types/` | pure types — `DropFirst`, `Empty`, `HasMaybe`, `Literalize`, `PickAny`, `PickOne` |
| `src/checks/` | type predicates |
| `src/guards/` | assertion operations |
| `src/wrappers/` | higher-order functions |

`FrozenDeep` is a pure type (F2). `HasMaybe` walked this same fork
(`.behavior/v2026_07_14.fix-has-maybe/`) and landed on `src/types/`. C is structure for siblings
that do not exist (`rule.prefer.most-common-denominator`).

## .the test file

`src/types/FrozenDeep.test.ts`, colocated, jest `describe`/`it`, bidirectional assignability plus
`@ts-expect-error`. a type-only `it` with zero `expect` is house form (`HasMaybe.test.ts:36-39`),
so no fake `expect(true).toBe(true)` is owed.

## .rework — clean

a file move plus one `index.ts` line. consumers import from the root.

## .confidence — 97%

an in-repo precedent walked the same fork. the 3% is test-file shape detail, left to execution.

## .where

`src/types/FrozenDeep.ts` · `src/types/FrozenDeep.test.ts` · `src/index.ts`
