# F5 — `provenance` is a column on two rows, not a dimension

**rework** clean · **confidence** 93% · **status** best-guessed

## .verdict

unchanged best-guess.

## .the fork

the decomposition needs the before/after answer — `{before: the sdk's local declaration, after:
the type-fns import}`.

| option | effect on the box |
|--------|-------------------|
| **A — a column** | note before/after on the two rows where it differs — `primitive-branded × assign-back × {top, nested}` (A13, A14). box size unchanged |
| **B — a dimension** | `shape × operation × depth × provenance`. box A doubles |
| **C — drop it** | describe only what ships |

## .taken, and why

**A.** an axis must vary the outcome. `provenance` varies it on two cells only — the defect pair,
already the highest-care cells in the box. every other shape expands identically under old and new.

- B doubles the table to record duplicate rows, and buries the two that matter.
- C loses the clamp: *"remove the primitive check and the assertions go red"* is a claim about the
  before state.

## .why A is safe

measured, premise 17 (`appendix/groundwork.probe.tsc-measured.md`): the old and new shapes agree
on plain primitives, which already fell through the old final `: T` arm. the new arm diverts only
branded intersections — two cells.

## .rework — clean

promotion to an axis rewrites one markdown table. no code, no test.

## .confidence — 93%

the collapse is measured. the 7% is a reviewer who reads "walk the product" as a mandate to
multiply every axis regardless of variance. B is the remedy, at the cost of one table.

## .where

`1.vision.experience.dimensions.md` — the axis considered and rejected · cells A13, A14
