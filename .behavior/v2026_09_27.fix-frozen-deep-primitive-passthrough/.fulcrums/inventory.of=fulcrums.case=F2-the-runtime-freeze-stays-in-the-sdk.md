# F2 — the runtime freeze stays in sdk-aws-lambda; type-fns ships the type alone

**rework** clean · **status** ✅ overruled 2026-09-29

## .verdict

the wisher took **B**: type-fns ships `asFrozenDeep` beside `FrozenDeep`. the design questions A
deferred are now F11 (in place, same reference) and F12 (`Map`/`Set` refuse at runtime).
`sdk-aws-lambda`'s `setEventFrozen` can delegate to it, which closes the two-repo duplicate below.
the record beneath is the call as best-guessed.

## .the fork

| option | what it is |
|--------|-----------|
| **A — type only** | type-fns exports `FrozenDeep<T>`; the recursive `Object.freeze` walk stays in the sdk |
| **B — both** | type-fns also exports a runtime `setFrozenDeep` / `asFrozenDeep` |

## .taken, and why

**A.**

1. the wish asks for the type, the clamp, and the release. no runtime function.
2. the sdk's freeze carries envelope semantics — a `WeakSet` for shared sub-objects, in-place
   mutation so `headers === event.headers` holds (`setEventFrozen.ts:7-8`). those are lambda
   concerns.
3. the type has one correct definition for every caller. a general freeze does not: in-place vs
   copy, cycle policy, prototype walks each vary by caller. that is a design question; this wish is
   a defect fix.

## .the cost A keeps

the sdk's `typeof value !== 'object'` early return and type-fns' primitive arm encode one rule in
two repos. if one changes, they disagree — the class of defect this wish fixes. the verdict on F3
widens the gap: the type now refuses `map.set()`, which the freeze permits.

## .rework — clean

a runtime companion later is additive: a new file, a new export, no caller change.

## .confidence — 94%

the wish is explicit and the seam is principled. the 6% is the two-repo duplicate of one rule,
which a reviewer may call the true root cause.

## .deferral

`dreams/v2026_09_27.reseed.sdk-aws-lambda-freeze-and-type-encode-one-rule-twice.md`

## .where

`src/types/FrozenDeep.ts` (lands) · `sdk-aws-lambda/…/setEventFrozen.ts` (stays)
