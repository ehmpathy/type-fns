# F3 — `Map` / `Set` keep the object arm

**rework** clean · **status** ✅ overruled 2026-09-28

## .verdict

**overruled by the wisher.** add a `ReadonlyMap` / `ReadonlySet` arm above the object arm;
`map.set()` and `set.add()` are refused. `Date` keeps the object arm. cells A77/A78 flip to
forbidden; case 9 `[t2]` becomes the before half of the clamp.

principle, shared with F6 and F9: **a general type owes its guarantee past the reported shape.**

## .the fork

| option | what it is |
|--------|-----------|
| **A — no exotic arm** | `Date`, `Map`, `Set`, `RegExp` take the object arm |
| **B — a readonly-collection arm** | `Map<K, V>` → `ReadonlyMap<K, FrozenDeep<V>>`, and the `Set` twin, above the object arm |
| **C — an exotic passthrough** | `Date \| RegExp` → `T`, unmapped |

## .what was measured

| reach, on a frozen shape | under the object arm |
|--------------------------|---------------------|
| `Date`, both directions | ✅ round-trips — every member is a method |
| `frozenMap.size = 1` — property | ⛔ refused |
| `frozenMap.set('a', 1)` — method | ✅ compiles |
| `frozenSet.add('a')` — method | ✅ compiles |

⇒ the object arm guards the property reach totally and the method reach not at all.

## .the case for A, as best-guessed

- the type matched the runtime: `Object.freeze(map)` does not block `map.set()`.
- the reported consumer is json; no `Map` or `Set` survives `JSON.parse`.
- one usage, no demand on record (`rule.prefer.wet-over-dry`).

the wisher weighed these against the name "frozen", and B won. B makes the type stricter than the
runtime freeze — a safe direction, which the jsdoc states.

C adds no value: the object arm already round-trips `Date`.

## .rework — clean

an added arm above the object arm. it narrows `Map` and `Set` only; no measured caller holds one.

## .where

`src/types/FrozenDeep.ts` — the arm list and jsdoc · cells A77/A78 · case 9
