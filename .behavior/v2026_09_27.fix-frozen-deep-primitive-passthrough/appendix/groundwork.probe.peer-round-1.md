# appendix — the cells peer round 1 demanded

## .what

peer round 1 raised three concerns that each ask for a cell nobody had fed to the compiler:

- **r1.blocker.1** — the `shape` axis omits `tuple`, whose cells are real and carry a defect
- **r1.nitpick.4** — `write` spans two acts (mutate a property vs reassign a slot); split it
- **r2.blocker.1** — cell **A06** is verdicted `demoed → case 3`, and case 3 never demonstrates it

each is a claim about behavior, so each was measured before the artifacts moved. compiled under
this repo's `tsconfig.json` (`@tsconfig/strictest` + `@tsconfig/node20`, typescript 5.4.5) on
2026-09-28, then removed.

## .the result

**all 14 held. `tsc` passed with zero errors.**

### A06 — the assertion r2.blocker.1 asked for (it does error)

| cell | assertion | verdict |
|------|-----------|---------|
| **A06** `primitive-plain × write-slot × nested` | `({} as FrozenDeep<{ s: string }>).s = 'x'` | ⛔ refused ✅ |
| **A12** `primitive-branded × write-slot × nested` | `({} as FrozenDeep<{ at: Stamp }>).at = …` | ⛔ refused ✅ |

⇒ the reviewer's suggested assertion is **correct as written** and now lives in case 3 `[t4]`. the
prior verdict claimed a demo that did not exist; the demo exists.

### the `write` split — both acts, at both depths

| act | at top | at nested |
|-----|--------|-----------|
| **write-property** — mutate a property *of* the frozen value | `f.y = 1` ⛔ | `f.a.y = 1` ⛔ |
| **write-slot** — reassign the slot that *holds* a value | ⛔ **impossible** — the root is a variable, never a slot | `f.a = { y: 1 }` ⛔ |

⇒ the split is real: the two acts are independent of depth, which is exactly what
`rule.require.dimensional-decomposition` requires and what the fused `write` value violated.

⚠️ and it explains an oddity the old grid produced: `write × top` was "impossible" for a primitive
(A05) and "a permitted disagreement" for a function (A17) — two different reasons under one
label, because `write` meant two acts.

### the tuple row — five cells, measured

| cell | assertion | verdict |
|------|-----------|---------|
| `tuple × read × top` | `({} as FrozenDeep<Pair>)[0]` is `string \| undefined` | ✅ an index read survives |
| 🔴 `tuple × assign-back × top` | `const _: readonly [string, string] = {} as FrozenDeep<Pair>` | ⛔ **refused — the degrade** |
| `tuple × write-property × top` | `({} as FrozenDeep<Pair>).push('x')` | ⛔ refused (it is a `ReadonlyArray` now) |
| 🔴 `tuple × assign-back × nested` | `{ readonly range: readonly [string, string] }` | ⛔ **refused — the degrade propagates** |
| `tuple × write-slot × nested` | `({} as FrozenDeep<{ range: Pair }>).range = […]` | ⛔ refused |

⇒ **the tuple is behaviorally distinct from the array on exactly the `assign-back` cells**, at both
depths, and identical to it on read and write. that is the row the box lacked, and it is the row
that carries **F9**.

⚠️ note the read row: `[0]` is `string | undefined` rather than `string`, because the tuple became
a `ReadonlyArray` and `noUncheckedIndexedAccess` is on. **the degrade is visible on a read too**,
one step short of an error — the loss shows up as a widened type rather than a refusal.

### the `special` shapes

| input | verdict |
|-------|---------|
| `never` | `FrozenDeep<never>` is `never` — the conditional distributes over the empty union |
| `unknown` | round-trips; must be narrowed before any operation, as before |

### the collapses the closed-set claim rests on

| input class | collapses into | proof |
|-------------|----------------|-------|
| a literal (`'shredder'`) | `primitive-plain` | assignable back to `'shredder'`, not widened |
| an index signature (`Record<string, number>`) | `object-plain` | the indexed slot refuses a write |
| a symbol key (`{ [sym]: number }`) | `object-plain` | the symbol-keyed slot refuses a write |

⇒ these three are **not axis values** — they are inputs that take an extant value's arm and land on
its verdict. stated here so the `shape` axis can be declared closed rather than implied closed.

## .the probe source, as compiled

```ts
type Stamp = string & { _dglo: 'iso-time.IsoTimeStamp' };
type Pair = [since: string, until: string];

// A06, A12 — write-slot at nested, onto a primitive leaf
// @ts-expect-error
({} as FrozenDeep<{ s: string }>).s = 'x';
// @ts-expect-error
({} as FrozenDeep<{ at: Stamp }>).at = '' as Stamp;

// the write split
// @ts-expect-error
({} as FrozenDeep<{ y: number }>).y = 1;                    // write-property × top
// @ts-expect-error
({} as FrozenDeep<{ a: { y: number } }>).a.y = 1;           // write-property × nested
// @ts-expect-error
({} as FrozenDeep<{ a: { y: number } }>).a = { y: 1 };      // write-slot × nested

// the tuple row
const _tRead: string | undefined = ({} as FrozenDeep<Pair>)[0];
// @ts-expect-error
const _tBack: readonly [string, string] = {} as FrozenDeep<Pair>;
// @ts-expect-error
({} as FrozenDeep<Pair>).push('x');
// @ts-expect-error
const _tNest: { readonly range: readonly [string, string] } =
  {} as FrozenDeep<{ range: Pair }>;
// @ts-expect-error
({} as FrozenDeep<{ range: Pair }>).range = ['a', 'b'];

// special
const _sNever: never = {} as FrozenDeep<never>;
const _sUnknown: unknown = {} as FrozenDeep<unknown>;

// the collapses
const _cLit: 'shredder' = {} as FrozenDeep<'shredder'>;
// @ts-expect-error
({} as FrozenDeep<Record<string, number>>)['k'] = 1;
declare const sym: unique symbol;
// @ts-expect-error
({} as FrozenDeep<{ [sym]: number }>)[sym] = 1;
```

## .round 1b — the three cells the new grid would otherwise have inferred

the 80-cell grid the repairs produce has three cells whose verdict I could have written from the
arm structure alone. **review 3 named an unchecked inference as a species of bad fulcrum**, so each
was fed to the compiler instead. compiled 2026-09-28, then removed.

| cell | assertion | expected | measured |
|------|-----------|----------|----------|
| **A22** `function × write-property × nested` | `frozen.fn.tag = 'x'` | permitted | ✅ **permitted** — the function arm maps no key at depth either |
| **A62** `object-exotic × write-property × nested` | `frozen.index.set('a', 1)` | permitted | ✅ **permitted** — a nested `Map` keeps its mutators, as a top-level one does |
| **A80** `special × write-slot × nested` | `frozen.u = 1` where `u: unknown` | refused | ✅ **refused** — the `readonly` sits on the slot, never on the value type |

⇒ A22 and A62 confirm the two **permits** generalize to depth, which is what makes F6 and F3 bounds
on the type rather than quirks of the top level. A80 confirms the converse: `unknown` weakens the
value, never the slot.

### and the two demos' assertions, verified before they were written into a case file

| demo | assertion | measured |
|------|-----------|----------|
| case 3 `[t4]` | `({} as FrozenDeep<{ s: string }>).s = 'x'` | ⛔ refused ✅ |
| case 3 `[t4]` | `({} as FrozenDeep<{ at: Stamp }>).at = …` | ⛔ refused ✅ |
| case 10 `[t1]` | `const _: readonly [since: string, until: string] = frozenPair` | ⛔ refused ✅ |
| case 10 `[t2]` | the same, one container deep | ⛔ refused ✅ |
| case 10 `[t0]` | `frozenPair[0]` is `string \| undefined` | ✅ widened, not refused |

⚠️ **the `[t0]` row is the one worth a second look.** the degrade's first symptom is not an error —
it is a **widened read**. an author who only reads the tuple sees `string | undefined` where they
declared `string`, blames `noUncheckedIndexedAccess`, and never learns the length and labels are
gone. that is a `misleads` diagnostic one step short of a refusal, and it is F9's strongest
argument.

## .see also

- `1.vision.experience.dimensions.md` — the axes this measurement re-shaped
- `1.vision.experience.case=_.md` — the 89-cell walk it feeds
- `appendix/groundwork.probe.tuple-arm.md` — why the tuple row exists at all (F9)
- `.reviews/peer/…r001….given.by_peer.dimensional-decomposition.report.md` — the concerns
