# F4 — the jsdoc states the sink bound, against the sdk's wider prose

**rework** clean · **status** ✅ promoted to a done-when

## .verdict

**a done-when.** case 8's sharp edge rests on it for its fail-safe. the jsdoc states three bounds:

1. a frozen **object** passes into a mutable object sink — typescript ignores `readonly` in
   structural assignability. only an array in the shape refuses a mutable sink.
2. a write **through `any`** compiles.
3. `.push` compiles again after **`Array.isArray`** — the guard's `any[]` restores the mutators.

no `Map`/`Set` line: F3's verdict closes the method reach.

## .the fork

the sdk's jsdoc says `FrozenDeep<TInput>` *"makes `event` unassignable to every mutable parameter
a handler forwards it to."* measured, that holds only where an array sits in the shape.

| option | what type-fns' jsdoc says |
|--------|---------------------------|
| **A — state the bound** | writes refused everywhere; a mutable sink refused only via an array |
| **B — inherit the prose** | carry the sdk's sentence across |
| **C — silent on sinks** | document the write refusal only |

## .taken, and why

**A.** B is false as a general claim — variance rows A, B, C, F, G all compile. C leaves the name
to suggest the wrong model with no place to correct it.

the sdk's sentence is accurate for its shapes: every envelope it freezes holds
`records: FrozenDeep<TShapes['record'][]>`, and one nested array refuses the whole object (row E).

## .rework — clean

a jsdoc edit. case 5 `[t1]` clamps the bound so doc and behavior cannot drift.

## .ripple

once shipped, the sdk's jsdoc is the wider of the two.
`dreams/v2026_09_27.reseed.sdk-aws-lambda-sink-prose-is-wider-than-measured.md`

## .where

`src/types/FrozenDeep.ts` — the jsdoc · case 5 `[t1]` · case 8
