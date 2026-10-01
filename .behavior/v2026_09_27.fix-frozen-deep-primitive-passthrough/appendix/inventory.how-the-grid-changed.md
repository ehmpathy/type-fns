# appendix — how the inventory grid changed, per peer round

## .what

the round-by-round account of `1.vision.experience.case=_.md`. the inventory states the current
grid; this file holds the path to it, so a citation written against an older grid resolves here
rather than by guesswork (`rule.forbid.chronological-accretion`, `rule.always.yield-the-output-not-the-archaeology`).

## .peer round 1 → round 2: the `write` split

the round-1 `write` value was split into `write-slot` and `write-property`, which made
`operation ⟂ depth` true. under the fused value, A60 (`frozen.x = {…}`) sat as
`object-plain × write × top`, verdicted `itemized`, with case 3 `[t1]` as its demo — the
inconsistency r1.nitpick.3 caught. `frozen.x = {…}` targets a **slot inside** the frozen root, so it
is `write-slot × nested`, and it is `demoed`. the split fixed the miscount at its root.

B06 once read *"their handler compiles, or it does not — that IS case 1 from their pov."* that is
box-A cell A14, counted a second time, which broke the disjointness the two-box split rests on. its
content is now the consumer's release-path experience, which has no box-A cell.

## .peer round 2 → round 3: the `write-property` / `write-method` split

`write-property` was split into `write-property` (a property reach) and `write-method` (a
mutator-method reach), on a measured pair where one shape at one depth gave opposite answers on the
reach alone — `frozenMap.size = 1` ⛔ against `frozenMap.set('a',1)` ✅
(`groundwork.probe.peer-round-2.md`). box A went 80 → 100 cells and every cell was renumbered.

what it changed in the register:

- **I3 grew from 6 to 8** — A75/A76 (`frozenMap.size = 1`) joined it. under the fused axis they
  were lumped with `map.set` and read as permitted, so two real rejection invariants were absent
- **I4 was cut out of I5** — an indexed write and a mutator call became separate invariants

what it changed in the honest bound: the second row once read as a collision — *"`arr.push` is an
invariant and `map.set` is not, and both are `write-property`."* after the split `arr.push` is
`write-method × array` and `map.set` is `write-method × object-exotic`.

four cells were re-verdicted `demoed`, each a cell demonstrated in a `case=N` file and verdicted
`itemized` anyway — the class r2.nitpick.5 named:

| cell | its demo | how it was caught |
|------|----------|-------------------|
| A53, A54 | case 5 `[t1]` | r2.nitpick.5 |
| A41 | case 10 `[t0]` | a tally recount, after the concede |
| A77 | case 9 `[t2]` | a tally recount — it had hidden behind the retired `forbidden-adjacent` label |

⇒ a verdict column and a case-file index are two claims about one fact. the inventory now names the
case-file index as the cross-check.

### the renumber map — round 1 → round 2

| round 1 | round 2 | note |
|---------|---------|------|
| A01–A06 | A01–A06 | unchanged |
| A07, A08 | A09, A10 | `write-slot` shifted by the two new `write-method` slots |
| A09–A14 | A11–A16 | |
| A15, A16 | A19, A20 | |
| A17–A22 | A21–A26 | |
| A23, A24 | A29, A30 | |
| A25–A28 | A31–A34 | |
| **A29, A30** | **A37, A38** | 🔴 `.push` is a **mutator method** — it moved to `write-method`, not `write-property` |
| A31, A32 | A39, A40 | |
| A33–A36 | A41–A44 | |
| **A37, A38** | **A47, A48** | 🔴 `.push` on a tuple — same move |
| A39, A40 | A49, A50 | |
| A41–A46 | A51–A56 | |
| A47, A48 | A59, A60 | |
| A49–A54 | A61–A66 | |
| A55, A56 | A69, A70 | |
| A57–A60 | A71–A74 | |
| **A61, A62** | **A77, A78** | 🔴 `map.set` is a **mutator method** — its round-1 coordinates now hold the *property* reach (A75/A76), which is **forbidden** |
| A63, A64 | A79, A80 | |
| A65–A70 | A81–A86 | |
| A71, A72 | A89, A90 | |
| A73–A78 | A91–A96 | |
| A79, A80 | A99, A100 | |

⚠️ the three bold rows are the ones a mechanical renumber gets wrong: `.push`, `map.set`, and their
depth twins changed *operation*, not offset.

## .peer round 4: `special` split into `opaque` + `any`

r4.nitpick.1 claimed `special` spanned two concepts. measured (`groundwork.probe.peer-round-4.md`):
`any` permits every write, at the top and through a readonly slot; `unknown` / `never` / `void`
refuse. `special` became `opaque` (A91–A100, same numbers) and `any` was appended as A101–A110, so
**no cell was renumbered**. box A went 100 → 110.

the same round:

- **the tally was re-based on one verdict per cell.** a suffix `· itemized` / `· demoed` on a
  `forbidden` cell is demo status, never a second verdict (r4.nitpick.2). the old tally counted six
  `forbidden · demoed` cells under both labels and deducted an overlap; the new tally counts each cell
  once and reports demo coverage as its own line
- **A41/A42 went `happy` → `sharp`** under one feel rule for compiles-but-misleads cells (r4.nitpick.3)
- **I1 / I2 were re-scoped to a clean partition** on the slot's value type (r4.nitpick.4)
- **a fourth honest-bound row**: `Array.isArray` hands `.push` back to a frozen array — measured
  while r4.nitpick.6 was probed
