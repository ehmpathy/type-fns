# F9 — the array arm degrades a tuple; keep tuples?

**rework** clean · **status** ✅ ruled 2026-09-28

## .verdict

**ruled by the wisher: keep tuples as tuples.** the shipped type preserves a tuple's arity,
labels, and positions. case 10's `[t0-t2]` become clamp assertions: red against #48's array arm,
green against the shipped type.

principle, shared with F3 and F6: **a general type owes its guarantee past the reported shape.**

## .the fork

| option | what it is |
|--------|-----------|
| **A — keep #48's array arm** | `ReadonlyArray<infer TItem>`. a tuple becomes a readonly array of its slot union |
| **B — drop the array arm** | the homomorphic object arm maps arrays and tuples natively. a tuple stays a readonly tuple |

## .what was measured

`appendix/groundwork.probe.tuple-arm.md`, 12 premises:

| input | A | B |
|-------|---|---|
| `[since: string, until: string]` | `readonly string[]` — length and labels lost | `readonly [since: string, until: string]` |
| `[string, number]` | `readonly (string \| number)[]` — positions lost | `readonly [string, number]` |
| `number[]`, `Stamp[]` | readonly array | identical |
| `.push`; a write on an item prop | ⛔ refused | identical |

⇒ A and B differ on tuples alone.

## .why it matters

a tuple that comes out an array *stops to be what it was* — the failure a branded primitive
suffers, one shape over. #48's array arm judges a general type against one repo's json payloads,
the same bias that produced the primitive defect.

the sharp edge has no fail-safe: the arity is gone before tsc complains, the message (*"target
requires 2 element(s)"*) points at the author's own declaration, and `t[0]` reads
`string | undefined` under `noUncheckedIndexedAccess`. no author-side edit restores it.

## .safe for the one consumer

the sdk's only array slot is `records: FrozenDeep<TShapes['record'][]>` — a plain array. B maps it
identically (P9, P11). zero sdk slots change.

## .rework — clean

delete the array arm, add one test. #48's clamp passes unchanged.

## .where

`src/types/FrozenDeep.ts` — the arm list · cells A41–A50 · case 10

## .see also

- `1.vision.experience.case=10.a-tuple-loses-its-shape.md`
- `…case=F1-ship-the-wishs-type-verbatim.md` — the row this narrows
