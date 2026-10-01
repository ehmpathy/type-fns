# appendix — what each probe changed, and why it was run

## .what

the per-probe account the yield cites. **six of the eight probes changed the vision**, and each was
run because a claim looked settled rather than measured.

⇒ the yield carries the probe **index** — what each settled, in one row. this file carries the
**account** — why it was run and what moved. `rule.always.yield-the-output-not-the-archaeology`
puts the first in the yield and the second in a peer dir cited by path.

## .the six that changed the vision

- the **second** caught the draft's inherited *"unassignable to every mutable parameter"*. rows B
  and C made a planned critipath demo false; it was replaced by case 5, whose `[t1]` clamps the
  true bound.
- the **third** was run in self review 2, after the boundary-density lens asked what the seven
  isolated demos never test. it found that the fix's promise stops one field short of a common
  shape ⇒ case 8, and the scoped before/after row in the yield.
- 🔴 the **fourth** was run in self review 3, against the guide's question *"could we achieve the
  goal in a simpler way?"* — and the answer was yes. **the wish's own type carries a second
  instance of the defect it fixes**: a tuple goes in and an array comes out, silently, because a
  general type was shaped against one repo's json payloads. ⇒ **F9**, the lowest-confidence row in
  the set, and the only one that asks the council to deviate from the wish's spec.
- 🔴 the **fifth** was run when review 3 listed *"R2's four assertions were read, never
  re-derived"* as a gap it had **not** closed — and then closed it. **the wish's phrase *"the
  first two assertions go red"* is imprecise**: the first *statement* stays green, because the
  defect is one-directional. the true expected result is **two red of five, with line one green**
  ⇒ case 7 now names the lines, so the dogfood has a number to compare against rather than a
  phrase to interpret.
- the **sixth** was run in self review 4, to close review 3's own carry-forward — *"a probe's
  silence is not evidence; write down the input classes a proof did not contain."* ten such
  classes were fed to the type and **all ten held**, so this one changed no decision. ⇒ its value
  is the opposite kind: it converts *"probably fine"* into *"measured fine"* for ten shapes, and
  it found that **the fix reaches branded numbers and booleans too**, where every narrative in
  this vision walks a branded string.
- 🔴 the **seventh** was run against peer round 1, and it is the first probe a *peer* asked for.
  two results changed the vision rather than confirmed it:
  1. the `write` split holds at both depths, so `operation ⟂ depth` is true — under the fused
     value it was not, and that correlation had produced three awkward verdicts
  2. 🔴 **the dense walk's error text is better than the vision claimed.** case 8 had graded its
     own fail-safe ⚠️ partly on the assertion that *"the message does not say what to do"*. the
     message names the field, names the readonly/mutable cause, and prints
     `readonly lastMessageAt: Stamp` — which **refutes the adopter's misdiagnosis in the error's
     own first line**. the grade went up, and the case's "aha" changed with it
- 🔴 the **eighth** was run against peer round 2, and it is the second probe a *peer* asked for. it
  settled a question the vision had answered twice by argument and never by measurement: does
  `write-property` span two acts?
  1. **it does.** `frozenMap.size = 1` is ⛔ refused and `frozenMap.set('a',1)` is ✅ permitted —
     one shape, one depth, opposite outcomes on the reach alone. the operation axis went 4 → 5 and
     `mutation-surface` was promoted from a latent dimension to a real one
  2. 🔴 **and the fused value had hidden two rejection invariants.** A75/A76 — a property write on
     a frozen `Map` — sat in the same cell as `map.set` and read as *permitted*, so the register
     understated what the behavior owes. the split found them, and I3 grew from 6 cells to 8
  ⇒ **the probe's own cited evidence corrected the reviewer's.** nitpick.2 argued from `arr.push`
  against `map.set`, which are *different shapes* — a weaker case than the one the measurement
  produced. the conclusion held; the argument for it did not

- 🔴 the **ninth** was run against peer round 4, the third a *peer* asked for. it split `special`
  into `opaque` and `any` — every write through `any` compiles — and measured the class-with-privates
  gap closed. 🔴 **and it found a hole the grid cannot hold**: `Array.isArray` hands `.push` back to
  a frozen array. the probe predicted a refusal; an unused `@ts-expect-error` caught the error, and
  a follow-up line isolated the guard as the cause
  ⇒ **the probe's author guessed wrong twice in one round** (`never` is not vacuously permissive;
  `Array.isArray` is not neutral). both guesses were written as assertions, so the compiler, not a
  reviewer, caught them

## 🔴 .the pattern the probes make

⇒ the fifth probe's origin is worth its own note: **it came from an honest list of what the review
had not covered.** the guard's `patience, friend` cue fired on the promise; the list was already
written; the cheapest honest response was to close its top item rather than re-assert the review
had been thorough.

⇒ and the sixth is that pattern generalized: **the list of what a proof omits is a ranked queue of
the cheapest work left.** review 3 graded its own top item "low risk" and it turned out to be a
defect; review 4 ran the list rather than grade it.

⇒ the seventh and eighth extend it one step further: **a peer reads the list you wrote and asks the
question you filed under "considered."** both peer-driven probes overturned a claim the vision had
argued twice and measured never — and the eighth corrected the reviewer's own evidence on the way.

## .see also

- `1.vision.yield.md` → `### the eight probes` — the index this file accounts for
- `…probe.peer-round-1.md` · `…probe.peer-round-2.md` — the two a peer asked for
