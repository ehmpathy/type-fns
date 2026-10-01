# appendix — what `FrozenDeep` actually refuses, measured against `tsc`

## .what

a second groundwork probe, compiled under this repo's `tsconfig.json` (typescript 5.4.5) on
2026-09-27. it corrects a claim the first draft of the vision carried, and it sets the honest
bound on what the word "frozen" promises.

## .why it was run

the first draft asserted that a `FrozenDeep<T>` value **refuses a mutable sink** — that
`handler(event)` fails where `handler` takes a mutable parameter. that claim was inherited from
sdk-aws-lambda's own prose:

> `FrozenDeep<TInput>` makes `event` unassignable to every mutable parameter a handler forwards
> it to, so a handler must declare its sinks readonly.
> — `sdk-aws-lambda`, `setEventFrozen.ts:66-69`

⚠️ typescript does **not** check `readonly` property modifiers in structural assignability — a
deliberate, long-lived unsoundness in its assignability rules. so the claim was suspect.
`rule.require.trust-but-verify`: measure it.

⚠️ **no issue number is cited here on purpose.** the behavior below is established by the nine
rows measured in this repo, not by a reference. an issue number quoted from memory would add
authority the measurement already supplies, and would be the one part of this file nobody could
check from inside the repo.

## .the result

| # | the case | verdict |
|---|----------|---------|
| A | a hand-written `{ readonly y: number }` → a `{ y: number }` sink | ✅ **compiles** — `readonly` alone refuses no sink |
| B | `FrozenDeep<{ y: number }>` → a `{ y: number }` sink | ✅ **compiles** |
| C | `FrozenDeep<{ x: { y: number } }>` → a `{ x: { y: number } }` sink | ✅ **compiles** — depth does not change it |
| D | `FrozenDeep<number[]>` → a `number[]` sink | ⛔ **refused** |
| E | `FrozenDeep<{ xs: number[] }>` → a `{ xs: number[] }` sink | ⛔ **refused** — a nested array refuses too |
| F | `FrozenDeep<Order>` → an `Order` sink (`Order` = branded object) | ✅ **compiles** — the brand does not refuse |
| G | `FrozenDeep<Wave>` → a `Wave` sink (`Wave` = a class) | ✅ **compiles** — a class does not refuse |
| H | `FrozenDeep<{ since: Stamp }>` → a `{ since: Stamp }` sink | ✅ **compiles** — the fix at work |
| I | `frozen.xs.push(1)` on a nested array | ⛔ **refused** |

every ⛔ row is proven by a `@ts-expect-error` that `tsc` confirmed was used.

## .the corrected claim

> **`FrozenDeep` refuses WRITES, at every depth. it does not refuse ASSIGNMENT into a mutable
> sink — unless an array is somewhere in the shape.**

two mechanisms, and only one of them is total:

| mechanism | reach |
|-----------|-------|
| **write refusal** — `obj.a.b = 1`, `arr.push(1)` | total. every depth, every shape with a property |
| **sink refusal** — pass to a mutable parameter | arrays only. `ReadonlyArray<T>` is genuinely not a `T[]`; `{ readonly a }` **is** a `{ a }` |

## .why the sdk's prose is not wrong, only narrower than it reads

every envelope sdk-aws-lambda freezes contains an array —
`records: FrozenDeep<TShapes['record'][]>` is a declared slot of `InvokeInputSuperset`, and the
api-gateway envelope carries array-valued headers. row E shows a nested array is enough to refuse
the whole object. so the sdk observes the refusal on the shapes it actually ships, and its prose
generalizes from that to "every mutable parameter" — true of its envelopes, not of the type.

⇒ type-fns ships the type to **everyone**, on shapes with no array in them. the jsdoc must state
the bound rather than inherit the generalization. that is fulcrum **F4**.

## .the second correction this forces

the first draft planned a critipath demo named *"a frozen value refuses a mutable sink"* (case 5),
on a plain object. rows B and C make that demo **false**. it is replaced by
`case=5.a-frozen-value-refuses-a-write-and-a-mutable-array-sink`, which demonstrates what is
actually true — and its `[t2]` step asserts the **non**-refusal of an object sink, so the bound is
clamped rather than merely written down.

## .the probe source, as compiled

```ts
// (FrozenDeepNew declared as in the other appendix)

const takesMutableFlat = (_input: { y: number }): void => undefined;
const takesMutableDeep = (_input: { x: { y: number } }): void => undefined;
const takesMutableArr  = (_input: number[]): void => undefined;

// A — a hand-written flat readonly, into a mutable sink
declare const flatByHand: { readonly y: number };
takesMutableFlat(flatByHand);

// B — FrozenDeep at depth one
declare const flatByFrozen: FrozenDeepNew<{ y: number }>;
takesMutableFlat(flatByFrozen);

// C — FrozenDeep at depth two
declare const deepByFrozen: FrozenDeepNew<{ x: { y: number } }>;
takesMutableDeep(deepByFrozen);

// D — a readonly ARRAY into a mutable array sink
declare const arrByFrozen: FrozenDeepNew<number[]>;
// @ts-expect-error
takesMutableArr(arrByFrozen);

// E — an array NESTED inside a frozen object
const takesMutableNestedArr = (_input: { xs: number[] }): void => undefined;
declare const objWithArr: FrozenDeepNew<{ xs: number[] }>;
// @ts-expect-error
takesMutableNestedArr(objWithArr);

// F — a branded object into a branded-object sink
type Order = { at: string; qty: number } & { _dglo: 'orders.Order' };
const takesOrder = (_input: Order): void => undefined;
declare const frozenOrder: FrozenDeepNew<Order>;
takesOrder(frozenOrder);

// G — a class instance into a class sink
class Wave { public height = 0; public crest(): number { return this.height; } }
const takesWave = (_input: Wave): void => undefined;
declare const frozenWave: FrozenDeepNew<Wave>;
takesWave(frozenWave);

// H — an object with a branded-primitive field, into a mutable sink (the fix at work)
type Stamp = string & { _dglo: 'iso-time.IsoTimeStamp' };
const takesPage = (_input: { since: Stamp }): void => undefined;
declare const frozenPage: FrozenDeepNew<{ since: Stamp }>;
takesPage(frozenPage);

// I — a mutator method on a nested array is refused
declare const nestedArr: FrozenDeepNew<{ xs: number[] }>;
// @ts-expect-error
nestedArr.xs.push(1);
```

## .see also

- `groundwork.probe.tsc-measured.md` — the first probe: the defect and the fix
- `.fulcrums/inventory.of=fulcrums.case=F4-the-jsdoc-states-the-sink-bound.md`
- `1.vision.experience.case=5.a-frozen-value-refuses-a-write-and-a-mutable-array-sink.md`
