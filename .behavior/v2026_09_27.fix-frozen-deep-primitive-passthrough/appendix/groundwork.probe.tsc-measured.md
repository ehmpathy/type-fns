# appendix — the groundwork probe, measured against `tsc`

## .what

the 1.vision stone claims rest on how typescript actually resolves the two `FrozenDeep` shapes.
this records a probe that was compiled under this repo's `tsconfig.json`
(`@tsconfig/strictest` + `@tsconfig/node20`, typescript 5.4.5) on 2026-09-27, and what it proved.

## .why it is here and not in `src/`

the probe declares its own copies of both shapes so it can compare them. two copies drift from
the one that ships, so it is a **point-in-time measurement**, never a clamp. the durable clamp is
`src/types/FrozenDeep.test.ts`, which execution owns.

## .how it was run

the probe was written to `.behavior/…/refs/probe.groundwork.ts`, compiled via
`rhx git.repo.test --what types` (`tsc -p ./tsconfig.json --noEmit`, whose `include` is
`**/*.ts`), then removed. every `@ts-expect-error` below carries weight: `tsc` fails an
**unused** `@ts-expect-error`, so a green run proves each marked line really does error.

## .the result

**all 16 premises held. `tsc` passed with zero errors.**

| # | premise | verdict |
|---|---------|---------|
| 1 | the OLD shape breaks a branded primitive — `FrozenDeepOld<Stamp>` is NOT assignable to `Stamp` | ✅ confirmed (the `@ts-expect-error` fired) |
| 2 | the NEW shape leaves it intact — `FrozenDeepNew<Stamp>` accepts a `Stamp` | ✅ confirmed |
| 3 | …and is assignable back to `Stamp` | ✅ confirmed |
| 4 | nested in an object, still assignable back to `{ readonly at: Stamp }` | ✅ confirmed |
| 5 | a plain object still refuses a depth-two write | ✅ confirmed (error fired) |
| 6 | an array still refuses `.push` | ✅ confirmed (error fired) |
| 7 | `FrozenDeepNew<Date>` is assignable to `Date` | ✅ survives |
| 8 | …and a `Date` is assignable to `FrozenDeepNew<Date>` | ✅ round-trips |
| 9 | `FrozenDeepNew<Map<string, number>>` still exposes `.set()` | ⚠️ mutable — see F3 |
| 10 | `FrozenDeepNew<Set<string>>` still exposes `.add()` | ⚠️ mutable — see F3 |
| 11 | a bare `string` is untouched | ✅ confirmed |
| 12 | a branded **object** (`{at:string} & {_dglo:'x'}`) still refuses a write | ✅ deep readonly holds |
| 13 | the conditional distributes over a union | ✅ `string \| {readonly y:number}` |
| 14 | a homomorphic mapped type preserves optionality (`a?` stays `a?`) | ✅ confirmed |
| 15 | a frozen value REFUSES a mutable sink — the deliberate cost | ✅ confirmed (error fired) |
| 16 | `unknown` does not collapse to `never` | ✅ confirmed |
| 17 | no regression surface: `FrozenDeepNew<string>` is assignable to `FrozenDeepOld<string>` | ✅ the shapes agree on plain primitives |

(17 rows, 16 premises — premises 2 and 3 share one numbered probe.)

## .the two findings that move the vision

### the defect is real, and it is exactly where the wish says

premise 1 is the whole justification. a branded primitive is an **intersection**
(`string & OfGlossary<G>`), and an intersection whose right half is an object type satisfies
`T extends object`. so the old shape takes the object arm and maps over every `String.prototype`
member plus `_dglo` — a record of methods, no longer a `string`. the `@ts-expect-error` fired,
so this is measured rather than reasoned.

### the change adds no regression surface

premise 17 is the safety argument. the only types the new arm diverts are those assignable to
`string | number | boolean | bigint | symbol | null | undefined`. a **plain** primitive already
fell through to the old shape's final `: T` arm, so it lands on the same answer either way. the
one class of type whose answer changes is the branded primitive — which is the defect. the arm
is therefore strictly corrective, with no blast radius.

## .the probe source, as compiled

```ts
// the sdk-aws-lambda@0.7.0 shape — no primitive arm
type FrozenDeepOld<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends ReadonlyArray<infer TItem>
    ? ReadonlyArray<FrozenDeepOld<TItem>>
    : T extends object
      ? { readonly [TKey in keyof T]: FrozenDeepOld<T[TKey]> }
      : T;

// the proposed shape — primitive arm first
type FrozenDeepNew<T> = T extends
  | string | number | boolean | bigint | symbol | null | undefined
  ? T
  : T extends (...args: never[]) => unknown
    ? T
    : T extends ReadonlyArray<infer TItem>
      ? ReadonlyArray<FrozenDeepNew<TItem>>
      : T extends object
        ? { readonly [TKey in keyof T]: FrozenDeepNew<T[TKey]> }
        : T;

type Stamp = string & { _dglo: 'iso-time.IsoTimeStamp' };

// 1 — the old shape breaks a branded primitive
// @ts-expect-error
const _old: Stamp = '' as unknown as FrozenDeepOld<Stamp>;

// 2, 3 — the new shape leaves it intact, both directions
const _newA: FrozenDeepNew<Stamp> = '' as Stamp;
const _newB: Stamp = _newA;

// 4 — nested in an object, still assignable back
const _newC: { readonly at: Stamp } = {} as FrozenDeepNew<{ at: Stamp }>;

// 5 — a plain object is still deep readonly
// @ts-expect-error
({} as FrozenDeepNew<{ x: { y: number } }>).x.y = 1;

// 6 — an array is still a readonly array
// @ts-expect-error
({} as FrozenDeepNew<number[]>).push(1);

// 7, 8 — Date round-trips
const _dateProbe: Date = {} as FrozenDeepNew<Date>;
const _dateBack: FrozenDeepNew<Date> = new Date();

// 9, 10 — Map and Set stay mutable
const _mapProbe = {} as FrozenDeepNew<Map<string, number>>;
_mapProbe.set('a', 1);
const _setProbe = {} as FrozenDeepNew<Set<string>>;
_setProbe.add('a');

// 11 — a bare primitive is untouched
const _plain: string = '' as FrozenDeepNew<string>;

// 12 — a branded OBJECT still goes deep readonly
type BrandedObj = { at: string } & { _dglo: 'x' };
// @ts-expect-error
({} as FrozenDeepNew<BrandedObj>).at = 'z';

// 13 — distributes over a union
const _unionA: string | { readonly y: number } =
  {} as FrozenDeepNew<string | { y: number }>;

// 14 — preserves optionality
const _optional: { readonly a?: number } = {} as FrozenDeepNew<{ a?: number }>;

// 15 — refuses a mutable sink (the deliberate cost)
const takesMutable = (_input: { y: number }): void => undefined;
// @ts-expect-error
takesMutable({} as FrozenDeepNew<{ y: number }>);

// 16 — `unknown` does not collapse to never
const _unknownProbe: unknown = {} as FrozenDeepNew<unknown>;

// 17 — no regression surface on a plain primitive
const _noRegress: FrozenDeepOld<string> = '' as FrozenDeepNew<string>;
```
