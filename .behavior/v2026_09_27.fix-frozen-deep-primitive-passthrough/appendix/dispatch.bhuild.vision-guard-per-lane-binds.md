## .what

bind each `1.vision` peer lane to the artifacts **its own rubric grades**, not the whole
`$route/1.vision.*.md` glob. applies to both `1.vision.guard.light` and `1.vision.guard.heavy`
(`dist/domain.operations/behavior/init/templates/`, lines ~135/142 and ~195/202).

## .why — measured, not guessed

on `ehmpathy/type-fns` route `v2026_09_27.fix-frozen-deep-primitive-passthrough`, both vision peer
lanes died three rounds in a row with `APIConnectionTimeoutError` (brain client bound ≈ 600s):

| round | prompt | tokens | outcome |
|-------|--------|--------|---------|
| 1 | 252K chars | ~63K | ✅ both returned |
| 2 | 380K chars | ~99K | ⚠️ one returned at 574s, one timed out |
| 3 | 459K chars | ~116K | 🔴 both timed out |

not an overflow — 11% of the window. pure latency. and every repair the driver makes to answer a
reviewer grows the artifacts, so the loop diverges: **a driver who does the stone well makes it
unreviewable.**

the shared glob hands BOTH lanes all 13 vision files, though each rubric grades a subset:

| lane | its rubric grades | the glob also sends |
|------|-------------------|---------------------|
| `dimensional-decomposition` | `dimensions.md` + `case=_.md` (the space + its walk) | 10 `case=N` demos + the yield |
| `experience-coverage` | `case=_.md` + every `case=N` demo | `dimensions.md` + the yield |

## .the fix

```yaml
# dimensional-decomposition
--paths-with '$route/1.vision.experience.dimensions.md' --paths-with '$route/1.vision.experience.case=_.md'

# experience-coverage
--paths-with '$route/1.vision.experience.case=*.md'
```

⚠️ repeat the flag; do NOT use a brace (`'…{dimensions,case=_}.md'`). a brace in the extension slot
is silently dropped by `parseReviewArgs` and the lane runs unbounded (see below).

## .proof it works

applied by hand on the route above (human `route.mutate grant allow`), then re-arrived.
`input.args.json` confirms the binds held:

| lane | targets | tokens |
|------|---------|--------|
| dimensional-decomposition | 13 → **2** | 115.7K → **68K** |
| experience-coverage | 13 → **11** | 115.7K → **93K** |

## .note — the yield has no peer lane

`1.vision.yield.md` summarizes the experience artifacts; the self reviews + the human approval
grade it. if a peer lens on the yield is wanted, add a **third** lane bound to it alone, rather
than re-widen either of these.

## .adjacent defect — unverified, check before you fix

the execution / verification templates bind `--paths-with '**/*.{ts,sh,md,snap}'`
(e.g. `5.1.execution.phase0_to_phaseN.guard:167,172`). the bhrain driver brief
`rule.always.diagnose-reviewer-malfunctions` states a brace in the **extension** slot is silently
dropped (tracked there as `.dream/v2026_09_04.fix.review-multi-glob-flags-do-not-comma-split.md`),
so those lanes may run with no bound at all. check an `input.args.json` from one of those lanes;
if `targetFiles` includes paths outside the four extensions, the bind was dropped.

## .related, upstream in rhachet-roles-bhrain (not this repo)

- the `review` prompt sends each target as diff AND full file; for a file new since `main` the diff
  IS the file, so it lands twice. ~2x on every vision stage.
- the brain client request timeout is below what a ~100K-token review takes.

---

dispatched from `ehmpathy/type-fns` route `v2026_09_27.fix-frozen-deep-primitive-passthrough` 🦫
