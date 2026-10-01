# appendix — the cells peer round 2 demanded

## .what

peer round 2 (`dimensional-decomposition`, 0 blockers · 7 nitpicks) asked whether
`write-property` spans two concepts. the answer is a claim about behavior, so it was measured
before the axis moved.

compiled under this repo's `tsconfig.json` (`@tsconfig/strictest` + `@tsconfig/node20`,
typescript 5.4.5) on 2026-09-28, then removed.

## .the result

**all 16 assertions held. `tsc` passed with zero errors.**

a green run is a two-sided proof here: `tsc` fails an **unused** `@ts-expect-error`, so every
marked line is proven to error, and every unmarked line is proven to compile.

## 🔴 .the decisive pair — one shape, one depth, opposite outcomes

| assertion | reach | verdict |
|-----------|-------|---------|
| `frozenMap.size = 1` | through a **property** | ⛔ **refused** |
| `frozenMap.set('a', 1)` | through a **method** | ✅ **permitted** |

⇒ **the divergence is intra-cell.** shape, depth, and the author's intent — *"change this value in
place"* — are all held fixed, and the outcome flips on the reach alone. that is the definition of
a value that spans two concepts, and it is what forces the split.

⚠️ **the reviewer's own evidence was the weaker case.** nitpick.2 cited `arr.push` (forbidden) vs
`map.set` (permitted) — but those are *different shapes*, and a shape axis that answers differently
per shape is the axis at work, never a fused value. the pair above is the real case, and it was
absent from the review. the conclusion survives on better evidence than the one offered.

## .the array and tuple rows — the property reach is refused too

| cell (new coords) | assertion | verdict |
|------|-----------|---------|
| **A35** `array × write-property × top` | `fArr[0] = 1` | ⛔ refused ✅ |
| **A35** (second reach) | `fArr.length = 0` | ⛔ refused ✅ |
| **A36** `array × write-property × nested` | `f.xs[0] = 1` | ⛔ refused ✅ |
| **A45** `tuple × write-property × top` | `fTup[0] = 'x'` | ⛔ refused ✅ |
| **A46** `tuple × write-property × nested` | `f.range[0] = 'x'` | ⛔ refused ✅ |

⇒ for an array and a tuple the two reaches **agree** (both refused), so the split costs them no
precision and loses no record. `object-exotic` is the one shape where they disagree — which is
why the split is a real axis rather than a cosmetic one.

## .the method reach, re-confirmed at the new coordinates

| cell | assertion | verdict |
|------|-----------|---------|
| **A37 / A38** `array × write-method` | `fArr.push(1)` · `f.xs.push(1)` | ⛔ refused ✅ (I4) |
| **A47 / A48** `tuple × write-method` | `fTup.push('x')` · `f.range.push('x')` | ⛔ refused ✅ (I4) |
| **A77 / A78** `object-exotic × write-method` | `fMap.set('a',1)` · `f.index.set('a',1)` | ✅ **permitted** (F3) |

## .the cells the split creates as `impossible`

| cell | assertion | why it is void |
|------|-----------|----------------|
| **A57 / A58** `object-plain × write-method` | `fObj.a.push(1)` | ⛔ **no such method exists to call.** the attempt does not typecheck for want of a member, never for want of permission — the same species as A05's *"a primitive has no own assignable property"* |
| **A87 / A88** `union × write-method` | `fUnion.push(1)` | neither member of `string \| { y: number }` carries a mutator |

⚠️ **`impossible` here means "nature, not nurture"** — `tsc` does refuse these lines, but it
refuses them because the member is absent, never because `FrozenDeep` withheld it. they are **not**
rejection invariants: a behavior cannot be graded on a refusal it did not author.

## .F6, re-confirmed at the new coordinates

| cell | assertion | verdict |
|------|-----------|---------|
| **A25 / A26** `function × write-property` | `f.fn.tag = 'x'` | ✅ **permitted** — the function arm maps no key |

⇒ the split leaves F6 exactly where it was. a function carries no own mutator method, so its
`write-method` cells are `impossible` and the whole of F6's bound stays on the property reach.

## .what the split does to the impossible region

it does **not** manufacture a dead column, which was the honest objection to be checked — the same
reviewer's nitpick.7 warns that a whole slice that cannot occur is the signature of correlated
axes.

`write-method` is live for **3 of 10** shapes (array, tuple, object-exotic) and void for 7. that is
a **shape-borne constraint**, not a correlation: it removes cells from the product, and neither
axis predicts the other. the latent property is nameable — `has-mutator-surface` — and it is now
declared in `dimensions.md` beside `authorship` and `mutation-surface`, which is what the rule asks
for.

## .see also

- `…probe.peer-round-1.md` — the round-1 walk, incl. round 1b
- `1.vision.experience.dimensions.md` — the axis this probe moved
- `.fulcrums/…case=F3-exotic-objects-keep-the-object-arm.md` — the bound the decisive pair measures
