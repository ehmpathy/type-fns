# appendix — the tuple probe: does the array arm earn its place?

## .what

review.self 3/5 challenges the requirement *"ship issue #48's type verbatim"*. one of the guide's
questions is **"could we achieve the goal in a simpler way?"** — so the wish's five arms were tested
against a four-arm alternative that drops the array arm entirely.

compiled under this repo's `tsconfig.json` (`@tsconfig/strictest` + `@tsconfig/node20`,
typescript 5.4.5) on 2026-09-27, then removed.

## .the two shapes compared

| shape | arms |
|-------|------|
| **wish** (#48, verbatim) | primitive · function · **array** · object · fallthrough |
| **no-array-arm** | primitive · function · object · fallthrough |

the alternative rests on one property of typescript: a mapped type of the form
`{ [K in keyof T]: … }` over a type parameter is **homomorphic**, and a homomorphic mapped type
over an array or tuple maps the *elements*, never the array's own members. so the object arm
already handles arrays — the array arm is a special case for a case that was never special.

## .the result

**all 12 premises held. `tsc` passed with zero errors.**

| # | premise | verdict |
|---|---------|---------|
| P1 | 🔴 under the WISH shape, `FrozenDeep<[string, number]>[0]` is **not** `string` | ✅ confirmed — the error fired. it is `string \| number` |
| P2 | 🔴 under the WISH shape, a tuple loses its fixed length | ✅ confirmed — the error fired |
| P3 | under no-array-arm, `FrozenDeep<[since: string, until: string]>` **is** a `readonly [string, string]` | ✅ the tuple survives |
| P4 | …and `[0]` is `string` | ✅ positional types kept |
| P5 | …and `[1]` is `number` | ✅ |
| P6 | no-array-arm still refuses `.push` on a plain array | ✅ the error fired |
| P7 | no-array-arm still goes deep on array items | ✅ the error fired |
| P8 | the wish shape also goes deep on array items — parity | ✅ the error fired |
| P9 | no-array-arm: a plain array is assignable to `readonly number[]` | ✅ |
| P10 | no-array-arm: a branded primitive is untouched | ✅ |
| P11 | no-array-arm: an array **of** branded primitives keeps the brand | ✅ |
| P12 | the wish shape also keeps the brand through an array — parity | ✅ |

## 🔴 .the result that moves the vision

> **the wish's array arm silently degrades every tuple.**

`ReadonlyArray<infer TItem>` captures a tuple — a tuple *is* a readonly-array subtype — and
`infer TItem` collapses its slots into a union. so:

| input | wish shape | no-array-arm |
|-------|-----------|--------------|
| `[since: string, until: string]` | `readonly string[]` — length lost, labels lost | `readonly [since: string, until: string]` |
| `[string, number]` | `readonly (string \| number)[]` — **positions lost** | `readonly [string, number]` |
| `number[]` | `readonly number[]` | `readonly number[]` — identical |
| `Stamp[]` | `readonly Stamp[]` | `readonly Stamp[]` — identical |

⚠️ **the two shapes differ on exactly one input class: the tuple.** on every other measured input
they agree (P6–P12), so the four-arm shape is not a rewrite — it is the same type with one special
case removed.

### and it is the same defect class the wish exists to fix

the wish's aha reads:

> "frozen" should mean *you cannot change it*. it should not mean *it stops to be what it was*.

a tuple that comes out an array **stopped to be what it was**, silently, with no error at the
boundary — the identical failure the branded primitive suffers, one shape over. the wish's literal
scope says "primitives", so the tuple is outside its words and squarely inside its reason.

## .the reach

honest about how often this bites:

- a **lambda envelope is `JSON.parse` output**, and a json array is a `T[]`, never a tuple. so the
  reported consumer (svc-chat) cannot produce one
- but `FrozenDeep` is a **general** type in a **general** package — that generality is the wish's
  own stated reason for the move out of sdk-aws-lambda. a tuple in a domain object is ordinary
  (`[lat, lng]`, a labelled range, a zod `.tuple()`)

⇒ this is precisely the failure mode the wish diagnoses in its `.why`: *a general type lived in one
repo, so it only ever saw one repo's shapes*. the array arm is a second instance of it, still in
the proposed fix.

## .what it costs to take

one arm deleted. the clamp from #48 passes unchanged (P6–P12 are the parity rows). the addition is
one test that a tuple survives.

⇒ recorded as fulcrum **F9**, flagged for the council, because the wish names #48 "the source of
truth" and this deviates from it.

## .the probe source, as compiled

```ts
type FrozenDeepWish<T> = T extends
  | string | number | boolean | bigint | symbol | null | undefined
  ? T
  : T extends (...args: never[]) => unknown
    ? T
    : T extends ReadonlyArray<infer TItem>
      ? ReadonlyArray<FrozenDeepWish<TItem>>
      : T extends object
        ? { readonly [TKey in keyof T]: FrozenDeepWish<T[TKey]> }
        : T;

type FrozenDeepNoArrayArm<T> = T extends
  | string | number | boolean | bigint | symbol | null | undefined
  ? T
  : T extends (...args: never[]) => unknown
    ? T
    : T extends object
      ? { readonly [TKey in keyof T]: FrozenDeepNoArrayArm<T[TKey]> }
      : T;

type Pair = [since: string, until: string];
type MixedPair = [string, number];

// P1 — the wish shape loses the positional type
// @ts-expect-error
const _p1: string = {} as FrozenDeepWish<MixedPair>[0];

// P2 — the wish shape loses the fixed length
// @ts-expect-error
const _p2: readonly [string, string] = {} as FrozenDeepWish<Pair>;

// P3, P4, P5 — no-array-arm keeps all of it
const _p3: readonly [string, string] = {} as FrozenDeepNoArrayArm<Pair>;
const _p4: string = {} as FrozenDeepNoArrayArm<MixedPair>[0];
const _p5: number = {} as FrozenDeepNoArrayArm<MixedPair>[1];

// P6 — no-array-arm still refuses push
// @ts-expect-error
({} as FrozenDeepNoArrayArm<number[]>).push(1);

// P7, P8 — both go deep on items
// @ts-expect-error
({} as FrozenDeepNoArrayArm<{ y: number }[]>)[0]!.y = 1;
// @ts-expect-error
({} as FrozenDeepWish<{ y: number }[]>)[0]!.y = 1;

// P9 — no-array-arm: plain array assignable to readonly array
const _p9: readonly number[] = {} as FrozenDeepNoArrayArm<number[]>;

// P10, P11, P12 — the brand survives, under both
type Stamp = string & { _dglo: 'iso-time.IsoTimeStamp' };
const _p10: Stamp = {} as FrozenDeepNoArrayArm<Stamp>;
const _p11: readonly Stamp[] = {} as FrozenDeepNoArrayArm<Stamp[]>;
const _p12: readonly Stamp[] = {} as FrozenDeepWish<Stamp[]>;
```

## .see also

- `.fulcrums/…case=F9-the-array-arm-degrades-a-tuple.md` — the fork this measurement opens
- `.fulcrums/…case=F1-ship-the-wishs-type-verbatim.md` — the call this measurement lowers
- `appendix/groundwork.probe.tsc-measured.md` — the 16 premises that hold under both shapes
