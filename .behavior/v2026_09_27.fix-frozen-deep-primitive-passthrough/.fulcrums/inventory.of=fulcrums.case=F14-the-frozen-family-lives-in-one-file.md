# F14 — the `Frozen*` family lives in one file

## .the fork

| option | effect |
|--------|--------|
| **one file** — `src/types/FrozenDeep.ts` exports `FrozenDeep`, `FrozenMap`, `FrozenSet` | no import cycle; three exports in one file |
| one file per type | matches one-export-per-file; `FrozenDeep` ↔ `FrozenMap` import each other |

## .taken — one file

- **the types recurse through each other.** `FrozenDeep<Map<K, V>>` yields `FrozenMap<K, V>`, and
  `FrozenMap` is defined via `FrozenDeep<K>` / `FrozenDeep<V>`. split files form a cycle.
- **this repo removes cycles on purpose.** `b432694 fix(deps): upgrade devDeps to eliminate cycles`;
  a type-only cycle may still trip the cycle check.
- **one concept, one home.** the family is one definition seen from three names.

## .rework — clean

a split is a file move plus one `index.ts` edit.

## .confidence — 88%

the residual: `rule.require.single-responsibility` asks one export per file. the exception is a
family whose members are defined in terms of each other; unverified whether the cycle check flags
a type-only import. execution can measure it.

## .where

`src/types/FrozenDeep.ts`.
