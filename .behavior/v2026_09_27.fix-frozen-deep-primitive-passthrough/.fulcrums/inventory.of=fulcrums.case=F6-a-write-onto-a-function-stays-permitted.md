# F6 — a prop write onto a function stays permitted

**rework** clean · **status** ✅ overruled 2026-09-28

## .verdict

**overruled by the wisher.** close the prop write: the function arm keeps the call signature and
maps own props readonly. cells A25/A26 flip to forbidden.

principle, shared with F3 and F9: **a general type owes its guarantee past the reported shape.**

## .what the grid found

cell A25 (`function × write-property × top`), and A26 at depth:

```ts
const fn = {} as FrozenDeep<(a: number) => void>;
(fn as never as { tag: string }).tag = 'x';   // compiles under #48
```

#48's function arm returns `T` unmapped, to keep the call signature. so no own prop is readonly,
while `Object.freeze` does freeze a function. the type is more permissive than the runtime — the
defect class of this wish, pointed the other way.

the `write-method` twins (A27/A28) are impossible: a function carries no own mutator.

## .the fork

| option | what it is |
|--------|-----------|
| **A — record it** | leave the arm; note the gap |
| **B — close it** | an intersection that keeps the call signature and adds readonly own props |
| **C — drop the function arm** | functions take the object arm and lose the call signature — a regression |

## .the case for A, as best-guessed

- for sdk-aws-lambda, a function in a frozen slot is unrepresentable: a lambda envelope is
  `JSON.parse` output, and json has no function type.
- B needs care so the intersection keeps the call signature, plus its own clamp.

a general consumer can write `FrozenDeep<{ handler: () => void }>`, so the reported consumer's
limit does not bound the type. the wisher took B.

## .rework — clean

one arm, one test block. B tightens a permission only a defective write relies on.

## .where

`src/types/FrozenDeep.ts` — the function arm · cells A25/A26

## .deferral, now closed by the verdict

`dreams/v2026_09_27.fix.frozen-deep-permits-a-write-onto-a-function.md`
