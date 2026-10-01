# appendix — which clamp statements actually bite?

## .what

the wish's R3 reads:

> the clamp is proven to bite: remove the primitive check and **the first two assertions** go red

that phrase can be read two ways, and the vision had measured neither. this probe feeds #48's
clamp, statement by statement, to the **old** (broken) shape and records which lines `tsc`
rejects.

compiled under this repo's `tsconfig.json` (`@tsconfig/strictest` + `@tsconfig/node20`,
typescript 5.4.5) on 2026-09-27, then removed.

## .the result

**`tsc` passed with zero errors**, which — given where the `@ts-expect-error` directives sit and
where they do not — settles the question exactly:

| # | #48's statement | under the OLD shape |
|---|-----------------|---------------------|
| **C1a** | `const a: FrozenDeep<Stamp> = '' as Stamp` | 🔴 **COMPILES — it does not bite** |
| **C1b** | `const b: Stamp = a` | ⛔ red ✅ |
| **C2** | `const c: { readonly at: Stamp } = {} as FrozenDeep<{ at: Stamp }>` | ⛔ red ✅ |
| C3 | `@ts-expect-error` — a depth-two write | ⛔ red, **before and after** (an intentional negative) |
| C4 | `@ts-expect-error` — `.push` on a frozen array | ⛔ red, **before and after** (an intentional negative) |

⚠️ **C1a carries no `@ts-expect-error` in the probe and the run was green** — so its compilation is
proven, not assumed. `tsc` fails an *unused* directive, so had C1a errored, its absent directive
would have made the run red.

## 🔴 .why C1a does not bite

the old shape sends `Stamp` (= `string & { _dglo }`) down the **object arm**, so it becomes:

```ts
{ readonly [K in keyof Stamp]: FrozenDeepOld<Stamp[K]> }
```

`keyof Stamp` is every `String.prototype` member plus `_dglo`. each member is a **method**, so each
passes the function arm unchanged. the result is a readonly record that a real `Stamp`
**structurally satisfies** — every method is there, `_dglo` is there, and typescript does not
compare `readonly` modifiers in assignability.

⇒ **the value goes IN cleanly and cannot come back OUT.** the defect is one-directional, and the
wish's first statement tests the direction that was never broken.

## 🔴 .what this means for R3

counted by statement, **R3 is false**: the first two *statements* do not both go red. the first
one never did.

what actually goes red is **C1b and C2** — the two *assignability-back* assertions, which are the
second and third statements. counted by block (`a` and `b` together as one), the wish's phrase is
correct; counted by line it is not.

the harm is concrete and lands on the exact person R3 exists for:

> a maintainer runs case 7's dogfood, removes the primitive arm, counts the red lines, sees **two
> of five** and the *first* one green — and concludes either that the revert was wrong or that the
> clamp does not bite.

⇒ that is a false negative on the one requirement whose whole job is to make the fix falsifiable.

## .the remedy

R3 is **correct in substance** — the clamp does bite, on exactly the two assertions that encode
the defect. what it needs is precision, not a change:

> remove the primitive arm and **the two assignability-back assertions go red**: `const b: Stamp = a`
> and the nested `const c`. the forward assignment `const a: FrozenDeep<Stamp> = '' as Stamp`
> stays green — the defect is one-directional, and that green line is itself informative.

⇒ **case 7 now names the lines and the count**, so the dogfood has an expected result to compare
against rather than a phrase to interpret.

## .the probe source, as compiled

```ts
type FrozenDeepOld<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends ReadonlyArray<infer TItem>
    ? ReadonlyArray<FrozenDeepOld<TItem>>
    : T extends object
      ? { readonly [TKey in keyof T]: FrozenDeepOld<T[TKey]> }
      : T;

type Stamp = string & { _dglo: 'iso-time.IsoTimeStamp' };

// C1a — no directive, and the run is green ⇒ it compiles
const _c1a: FrozenDeepOld<Stamp> = '' as Stamp;

// C1b
// @ts-expect-error
const _c1b: Stamp = _c1a;

// C2
// @ts-expect-error
const _c2: { readonly at: Stamp } = {} as FrozenDeepOld<{ at: Stamp }>;

// C3, C4 — red before and after; intentional negatives
// @ts-expect-error
({} as FrozenDeepOld<{ x: { y: number } }>).x.y = 1;
// @ts-expect-error
({} as FrozenDeepOld<number[]>).push(1);
```

## .see also

- `1.vision.experience.case=7.the-clamp-is-proven-to-bite.md` — the demo this corrects
- `appendix/groundwork.probe.tsc-measured.md` — premise 1 measured C1b; C1a was never fed to it
- `rule.require.clamp-edge-cases` — *prove the clamp bites*, and what "prove" costs
