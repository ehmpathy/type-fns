# F1 — keep #48's primitive arm and arm order

**rework** clean · **status** ✅ upheld 2026-09-30

## .verdict

✅ **upheld** 2026-09-30 by the wisher — arm order is not a concern: *"we only care that it works and
has boundaries covered."* the arms stay as written. the repo holds no multi-arm conditional type to
match; its others (`NotNull`, `IsDefined`, `NotPromise`, `DropFirst`) have one or two arms.

the array arm left this row as F9; the verdicts on F3, F6, F9 replace #48's tuple, `Map`/`Set`, and
function behavior. what stays here: the primitive arm's membership and the order of the other arms.

## .the fork

| option | what it is |
|--------|-----------|
| **A — as written** | #48's primitive arm (explicit seven-member union) and its arm order |
| **B — reorder** | e.g. array above function, or fold the final `: T` into the object arm |
| **C — a `Primitive` alias** | replace the explicit union with a named, reusable alias |

## .taken, and why

**A.**

- the wish names #48 the source of truth, and all 16 groundwork premises measure it correct
  (`appendix/groundwork.probe.tsc-measured.md`).
- B buys no behavior: the arms are mutually exclusive on every measured shape, so order is
  legibility. #48 reads narrowest-first.
- C turns a one-type wish into a two-type wish. `Primitive` already names react-native ui types in
  `ehmpathy/rheuse`, so the alias would overload the word.

## .rework — clean

one file plus its jsdoc. the expanded type is identical under any order; no call site changes.

## .confidence — 84%

the arms are measured. the 16%: ~4% a reviewer wants a reusable alias under another word; ~12%
that the stricter principle behind F3/F6/F9 invites one more read of the other arms.

## .where

`src/types/FrozenDeep.ts`

## .see also

- `…case=F9-the-array-arm-degrades-a-tuple.md` — the fork cut from this row
