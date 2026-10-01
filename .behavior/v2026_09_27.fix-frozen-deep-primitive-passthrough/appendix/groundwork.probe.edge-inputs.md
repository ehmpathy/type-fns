# appendix — the input classes the first probe never fed the type

## .what

review 3 closed with a carry-forward: *"a probe's silence is not evidence — when a proof passes,
write down the input classes it did **not** contain."* review 4 takes that one step further and
**closes** them rather than merely lists them.

the 16-premise probe covered primitives, branded strings, functions, arrays, plain objects,
branded objects, `Date`/`Map`/`Set`, unions, optionality, and `unknown`. it never fed the type:
`void`, `never`, `any`, a recursive type, an index signature, a symbol key, a branded **number**
or **boolean**, a literal type, or an optional branded primitive.

compiled under this repo's `tsconfig.json` (`@tsconfig/strictest` + `@tsconfig/node20`,
typescript 5.4.5) on 2026-09-27, then removed.

## .the result

**all 10 held. `tsc` passed with zero errors.**

| # | input class | premise | verdict |
|---|-------------|---------|---------|
| E1 | `void` | round-trips both directions | ✅ falls to the final `: T` arm |
| E2 | `never` | `FrozenDeep<never>` is `never`, not a collapse into an object arm | ✅ the conditional distributes over the empty union |
| E3 | `any` | does not explode; stays usable | ✅ |
| E4 | a **recursive** type (`TreeNode { children: TreeNode[] }`) | terminates, and goes deep through the recursion | ✅ no *"instantiation is excessively deep"*; the nested child's write is refused |
| E5 | an index signature (`Record<string, number>`) | the signature survives as readonly | ✅ |
| E6 | a **symbol**-keyed property | mapped, never dropped | ✅ the nested write is refused |
| E7 | a branded **number** (`number & { _dglo }`) | passes through unchanged | ✅ |
| E8 | a branded **boolean** | passes through unchanged | ✅ |
| E9 | a literal type (`'shredder'`) | not widened to `string` | ✅ |
| E10 | an **optional** branded primitive (`{ at?: Stamp }`) | stays optional **and** stays branded | ✅ |

## .the two that matter most

### E7 / E8 — the fix reaches past the reported shape

the wish's `.found in` names one concrete case: `IsoTimeStamp`, a branded **string**. every
narrative in this vision walks a branded string.

⇒ E7 and E8 measure that a branded **number** (`Cents`) and a branded **boolean** pass through
identically. the primitive arm is a union of all seven js primitives, so the fix is **general in
the way the wish's prose implies and its evidence never showed**.

⚠️ that matters for `iso-price`: `IsoPriceWords` is a branded string today, and any future branded
numeric would have hit the identical defect. the fix covers it before it is reported.

### E4 — the recursion terminates, and that was not obvious

a conditional type that recurses through `keyof T` can hit typescript's instantiation-depth limit
and fail with *"Type instantiation is excessively deep and possibly infinite."* a self-referential
interface is the ordinary way to trigger it.

⇒ `FrozenDeep<TreeNode>` compiles, and `frozen.children[0].label = 'x'` is still refused. the type
is safe on the recursive shapes a domain model actually holds.

## .what this does NOT cover

per the same carry-forward, stated rather than left silent:

- **a deeply nested generic** — `FrozenDeep<Map<string, TreeNode[]>>` and similar compounds
- **a class with private fields** — `#x` interacts with mapped types in its own way
- **a type with a call signature AND properties** — cell A21's shape, which F6 defers
- **conditional/inferred types as input** — `FrozenDeep<T extends X ? A : B>`

⇒ none is reachable from a json lambda envelope, and each is a place a later reviewer could look.

## .the probe source, as compiled

```ts
type FrozenDeep<T> = T extends
  | string | number | boolean | bigint | symbol | null | undefined
  ? T
  : T extends (...args: never[]) => unknown
    ? T
    : T extends ReadonlyArray<infer TItem>
      ? ReadonlyArray<FrozenDeep<TItem>>
      : T extends object
        ? { readonly [TKey in keyof T]: FrozenDeep<T[TKey]> }
        : T;

// E1 — void
const _e1: void = {} as FrozenDeep<void>;
const _e1b: FrozenDeep<void> = undefined as void;

// E2 — never
type NeverResult = FrozenDeep<never>;
const _e2: never = {} as NeverResult;

// E3 — any
const _e3: number = {} as FrozenDeep<any>;

// E4 — recursion
interface TreeNode { label: string; children: TreeNode[] }
const _e4: { readonly label: string } = {} as FrozenDeep<TreeNode>;
// @ts-expect-error
({} as FrozenDeep<TreeNode>).children[0]!.label = 'x';

// E5 — index signature
const _e5: { readonly [k: string]: number } = {} as FrozenDeep<Record<string, number>>;

// E6 — symbol key
declare const sym: unique symbol;
type SymKeyed = { [sym]: { y: number } };
// @ts-expect-error
({} as FrozenDeep<SymKeyed>)[sym].y = 1;

// E7, E8 — branded number, branded boolean
type Cents = number & { _dglo: 'iso-price.Cents' };
const _e7: Cents = {} as FrozenDeep<Cents>;
type Verified = boolean & { _dglo: 'x.Verified' };
const _e8: Verified = {} as FrozenDeep<Verified>;

// E9 — a literal is not widened
const _e9: 'shredder' = {} as FrozenDeep<'shredder'>;

// E10 — optional AND branded
type Stamp = string & { _dglo: 'iso-time.IsoTimeStamp' };
const _e10: { readonly at?: Stamp } = {} as FrozenDeep<{ at?: Stamp }>;
```

## .see also

- `appendix/groundwork.probe.tsc-measured.md` — the 16 premises this widens
- `appendix/groundwork.probe.tuple-arm.md` — the **one** untested input class that did break
- `review/self/for.1.vision._.has-questioned-assumptions.md` — where this was run
