# F13 — the `Frozen*` family is `FrozenDeep` + `FrozenMap` + `FrozenSet`

## .verdict (2026-09-29)

the wisher ordered `Frozen*` as the type set. which members it holds is this row's call.

## .the fork

| option | members |
|--------|---------|
| **taken** | `FrozenDeep`, `FrozenMap<K, V>`, `FrozenSet<T>` |
| wider | + `FrozenArray<T>` |
| wider still | + `FrozenObject<T>`, `FrozenFunction<T>` |

## .taken, and why

- **`FrozenMap` / `FrozenSet` earn a name.** each is what `FrozenDeep` yields for its shape, and
  each is stricter than the lib's `ReadonlyMap<K, V>` — its entries are frozen deep. the name makes
  the hover read true.
- **no `FrozenArray`.** `FrozenDeep<T[]>` is `ReadonlyArray<FrozenDeep<T>>`, but `FrozenDeep` of a
  tuple keeps the tuple (F9). a `FrozenArray<T>` would cover arrays and not tuples, and a reader
  would reach for it on a tuple and lose the shape — the F9 defect, re-planted by a name.
- **no `FrozenObject` / `FrozenFunction`.** the mapped type is the whole of each; a name would add
  a second way to say `FrozenDeep<T>` with no difference behind it.

## .rework — clean

an added alias is additive; no caller breaks.

## .confidence — 82%

the residual: symmetry. a reader who sees `FrozenMap` and `FrozenSet` may look for `FrozenArray`.
the jsdoc on `FrozenDeep` names the family and says why arrays have no member.

## .where

`src/types/FrozenDeep.ts` (F14); `src/index.ts` exports all three.
