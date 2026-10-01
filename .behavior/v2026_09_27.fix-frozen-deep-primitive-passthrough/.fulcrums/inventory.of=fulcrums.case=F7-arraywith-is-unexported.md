# F7 — `ArrayWith` stays unexported in this route

**rework** clean · **status** ✅ overruled 2026-09-28

## .verdict

**overruled by the wisher.** this route adds `export * from './types/ArrayWith';` to
`src/index.ts`, and it ships in the same patch as `FrozenDeep`.

## .what was found

`ArrayWith` is authored, tested (`ArrayWith.test.ts`), compiled into `dist` — and absent from
`src/index.ts`, unlike every peer in `src/types/`. a consumer cannot import it by name.

the omission is an oversight:

```
7855ac5  feat(array): expose ArrayWith type declaration
         src/types/ArrayWith.test.ts | +35
         src/types/ArrayWith.ts      | +24
         (no src/index.ts)
```

## .the fork

| option | what it is |
|--------|-----------|
| **A — defer** | catch a dream, add no line |
| **B — fix it here** | add the export line in this route |

## .the case for A, as best-guessed

the SAFE/CLEAN test (`rule.always.fix-forward-under-scouts-honor`): clean — one line, no ripple;
not safe — a public api addition never reviewed as shipped surface. an export nobody ordered was
the wisher's to order. the wisher ordered it.

## .rework — clean

one additive line. no caller breaks.

## .where

`src/index.ts` · `src/types/ArrayWith.ts`

## .deferral, now closed by the verdict

`dreams/v2026_09_27.fix.arraywith-is-absent-from-the-package-root.md`
