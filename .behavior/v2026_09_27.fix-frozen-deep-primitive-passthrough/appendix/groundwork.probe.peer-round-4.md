# groundwork — probe for peer round 4 (nitpick.1: does `special` span two concepts?)

## .what

nitpick.1 claimed the four `special` members — `any`, `unknown`, `never`, `void` — do not behave
alike under a write, so one `impossible` verdict mis-grades `any`. fed to `tsc` (repo
`tsconfig.json`, via `rhx git.repo.test --what types`). a line with no `@ts-expect-error` that
compiles proves the write is **permitted**; a directive that goes unused would fail the run.

## .the result — one error, and it was the probe author's own guess

```
src/types/__probe_round4.ts(27,8): error TS2339: Property 'x' does not exist on type 'never'.
```

| member | the write | outcome |
|--------|-----------|---------|
| `any` | `fAny.x = 1` at top | ✅ **compiles** |
| `any` | `fAny.push(1)` at top | ✅ **compiles** |
| `any` | `fAnyNested.a = 1` (the slot) | ⛔ refused — the slot is readonly |
| `any` | `fAnyNested.a.x = 1` (through the slot) | ✅ **compiles** |
| `unknown` | `fUnknown.x = 1` | ⛔ refused |
| `void` | `fVoid.x = 1` | ⛔ refused |
| `never` | `fNever.x = 1` | ⛔ refused — TS2339. the probe guessed "vacuously permitted"; the compiler said no |

## .what it settles

- 🔴 **`special` spans two concepts, measured.** `any` is *permissive* — every write through it
  compiles, at the top and past a readonly slot. `unknown` / `void` / `never` are *opaque* — no
  surface to write to. the reviewer is right, and the split is real.
- **the `any` cells are not `impossible`.** the attempt is possible and it compiles, against a type
  whose name says "frozen" — the same ⚠️ misleads class as `map.set` (A77). `FrozenDeep<any>` is
  `any`, so freeze has no reach there.
- ⚠️ **the one wrong guess was mine, not the reviewer's.** `never` refuses a property access; it is
  not vacuously permissive. that is why this is a probe and not an argument.

## .the second probe (4b) — nitpicks .5 and .6, and one surprise

nitpick.5 asked whether `object-exotic` is closed; nitpick.6 asked whether a `union` verdict depends
on its members. fed to `tsc` the same way. the first run failed on exactly one line — a directive
that went unused — and a follow-up isolated its cause. the final run is green.

| # | the attempt | outcome |
|---|-------------|---------|
| U1 | `FrozenDeep<string \| number[]>`, `.push` with no narrow | ⛔ refused — `string` lacks the member |
| 🔴 U2 | same, after `Array.isArray(x)` | ✅ **compiles** — the probe predicted a refusal; the unused directive caught it |
| U3 | same, after `typeof x !== 'string'` | ⛔ refused — the array row's answer |
| 🔴 U4 | plain `FrozenDeep<number[]>`, after `Array.isArray(x)` | ✅ **compiles** — no union at all, so the guard alone is the cause |
| E1 | `WeakMap` `.set` | ✅ compiles, as `Map` |
| E2 | `Uint8Array` `u[0] = 1` | ⛔ refused |
| E3 | `Uint8Array` `.set([1])` | ✅ compiles, as `Map` |
| E4 | `Error` `.message = 'x'` | ⛔ refused |
| E5 | `Promise` `.then(…)` | ✅ compiles; no mutator exists |
| E6 | class instance, public property write | ⛔ refused |
| E7 | class instance, a method that mutates `#private` state | ✅ compiles |
| E8 | class with `#private` fields, assign back to the class | ⛔ **refused — the round-2 open gap, now measured.** the prediction held |

### what 4b settles

- **`object-exotic` is closed by arm membership**, and its members agree on the property reach. the
  method reach varies by member — the `has-mutator-surface` constraint — never by shape.
- **a union never owns a live `write-method` cell.** un-narrowed, the reach fails for want of a
  member; narrowed, the value has left the union for its member's row.
- 🔴 **`Array.isArray` hands `.push` back to a frozen array.** its `arg is any[]` signature
  intersects the mutable array into the narrowed type, where `typeof` does not. this is
  typescript's lib, not `FrozenDeep`, and no cell of the grid holds it — a narrow is not a shape.
  it is a real hole in the word "frozen" at the most common array guard, so it joins the honest
  bound.

## .see also

- `groundwork.probe.peer-round-2.md` — the prior peer-driven probe, same method
- `groundwork.probes.what-each-changed.md` — the per-probe account
