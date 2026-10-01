# F16 — `asFrozenDeep` returns via one documented cast; type tests build fixtures via `as`

## .the fork

| option | effect |
|--------|--------|
| **keep one cast at the return**, documented with `.why the cast` and `.removal` | the signature states the true claim, `<T>(value: T) => FrozenDeep<T>` |
| type the implementation `(value: any): any` and annotate the const | no `as`, but an `any` the rules forbid harder, and the body loses its checks |
| overload via `function` declarations | the implementation signature is free to differ — but `rule.require.arrow-only` forbids `function` |
| return `T`, not `FrozenDeep<T>` | no cast, and the companion no longer announces what it enforces — the wish's point |

## .taken — keep the cast, at 5.1

- **the checker can not prove it, by construction.** `FrozenDeep<T>` is a conditional type. on an
  unresolved `T` typescript defers it, so no body typed `T` satisfies it. this is the checker's
  limit, not a gap in the claim: the walk runs first and freezes every reachable object.
- **every alternative trades the cast for a worse hazard.** `any` erases the body's types; a
  `function` overload breaks a blocker-grade rule; a `T` return drops the contract.
- **one site, documented.** `.why the cast` states why types lack; `.removal` states when it drops.
  `rule.forbid.as-cast` asks for exactly that record.

## .taken — the fixture casts in type tests

- **a type test has no runtime producer for the type under test.** `FrozenDeep.test.ts` asserts what
  the compiler accepts and refuses. `x as FrozenDeep<T>` materializes a value of the type, which is
  the subject; the `@ts-expect-error` lines are the assertions. a runtime producer would be
  `asFrozenDeep`, which is a different subject with its own suite.

## .rework — clean

one line in `asFrozenDeep.ts`; the fixtures are test-only. no caller sees either.

## .confidence — 88%

the residual: `rule.forbid.as-cast` names "external org code boundaries" as the one exception, and a
deferred conditional is not that. a reviewer may hold the rule literal. the wisher rules.

## .where

`src/companions/asFrozenDeep.ts` return · `src/types/FrozenDeep.test.ts` fixtures · peer lane
`arch-hazards-maintenance` blocker.1 and nitpick.1.
