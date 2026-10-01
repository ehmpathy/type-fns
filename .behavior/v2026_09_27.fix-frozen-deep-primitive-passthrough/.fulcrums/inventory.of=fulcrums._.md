# inventory of fulcrums — `1.vision`

the calls made on the way through the vision stone. each row has an entry file.

**rework** = clean (a rename, a default, a re-scoped boundary that does not ripple) / dirty
(callers hardened against it, so reversal is a teardown).

| case | title | rework | status | confidence |
|------|-------|--------|--------|-----------|
| F1 | keep #48's primitive arm and arm order | clean | ✅ **upheld** 2026-09-30 — works + boundaries covered is the bar; order is not | — |
| F2 | the runtime freeze stays in sdk-aws-lambda; type-fns ships the type alone | clean | ✅ **overruled** 2026-09-29 — ship `asFrozenDeep` as the companion | — |
| F3 | `Map` / `Set` keep the object arm | clean | ✅ **overruled** 2026-09-28 — add a `ReadonlyMap`/`ReadonlySet` arm | — |
| F4 | the jsdoc states the sink bound | clean | ✅ **promoted to a done-when** — case 8's fail-safe rests on it | — |
| F5 | `provenance` is a column on two rows, not a dimension | clean | best-guessed | 93% |
| F6 | a prop write onto a function stays permitted | clean | ✅ **overruled** 2026-09-28 — close it | — |
| F7 | `ArrayWith` stays unexported in this route | clean | ✅ **overruled** 2026-09-28 — export it here | — |
| F8 | `src/types/FrozenDeep.ts`, per the `HasMaybe` precedent | clean | settled by convention | 97% |
| F9 | the array arm degrades a tuple — keep tuples? | clean | ✅ **ruled** 2026-09-28 — keep tuples | — |
| F10 | a new export under a `fix` bind cuts a patch | clean | ✅ **upheld** 2026-09-28 — `fix` → patch | — |
| F11 | `asFrozenDeep` freezes in place and returns the same reference, never a copy | clean | best-guessed | 90% |
| F12 | a frozen `Map` / `Set` refuses its mutators at runtime via own-prop shadows that throw | clean | best-guessed | 80% |
| F13 | the `Frozen*` family is `FrozenDeep` + `FrozenMap` + `FrozenSet` — no `FrozenArray` | clean | best-guessed | 82% |
| F14 | the family lives in one file, `src/types/FrozenDeep.ts` | clean | best-guessed | 88% |
| F15 | the first acceptance test of the built package root is deferred to a dream, not added here | clean | ⚠️ **reversed at 5.3** — `src/index.acceptance.test.ts` written, passes locally, bites the built `.d.ts`; ci boots via F21's waiver | — |
| F16 | `asFrozenDeep` returns via one documented `as FrozenDeep<T>`; type tests build fixtures via `as` | clean | best-guessed (5.1) | 88% |
| F17 | route docs keep their ⛔ / ✅ / 🔴 verdict glyphs; no swap to nature emojis | clean | best-guessed (5.1) | 90% |
| F18 | the slot-mutator doc-drift clamp waits on F15's grant; the docs are synced by hand here | clean | ⚠️ **reversed at 5.3** — `src/companions/kindsWithSlotMutators.integration.test.ts` written, passes locally, bites on readme drift; ci boots via F21's waiver | — |
| F19 | the out-of-scope `withAssure` skip is removed and its fixture named, not kept (5.3 zero-skips) | clean | ✅ **approved** 2026-09-29 — keep the un-skip | — |
| F20 | new unit suites keep the repo's describe/it convention; given/when/then where the rule requires it | clean | best-guessed (5.3) | 88% |
| F21 | ci waives the unused `FIREWORKS_API_KEY` via `is-optional-if-has: CI` in the repo's own `.agent/keyrack.yml`, not a repo secret | clean | ✅ **approved** 2026-09-29 — keep the waiver, no secret | — |

## .the verdicts, 2026-09-28

the wisher ruled one principle for F3, F6, and F9: **a general type owes its guarantee past the
reported shape.** each of the three had deferred on *"the reported consumer cannot produce one"* —
the argument that let the branded-primitive defect ship. all three close toward the stricter type.
F10 stands on the `HasMaybe` precedent (`fix(types)` → 1.21.4). F7: the wisher ordered the
`ArrayWith` export — commit `7855ac5`, *"expose ArrayWith"*, meant to add it and did not — so this
route adds the one `src/index.ts` line.

## .the verdicts, 2026-09-29

the wisher ordered a runtime companion and a named family: **`asFrozenDeep`** enforces what
**`FrozenDeep`** announces, and **`Frozen*`** names the type set (`FrozenMap`, `FrozenSet`). F2's
type-only scope is overruled — type and freeze now ship from one repo, which closes the seam the
defect grew in. F11–F14 are the calls this opens, each best-guessed.

## .what a fulcrum record owes

three failure species surfaced in this inventory, each with a tell a reviewer can check:

| species | tell |
|---------|------|
| an unchecked fact | *"I could not tell"*, where the answer is one command away |
| an untested input class | a claim proven over a set that never held the input that breaks it |
| a reason that defeats itself | a reason that, applied evenly, would forbid the task in hand |

## .see also

- `1.vision.yield.md` — the type this route ships, with each verdict applied
- `dreams/` — the deferrals these rows account for
