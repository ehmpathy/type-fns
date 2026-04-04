# self-review round 2: has-protected-test-intentions

## second pass validation

re-examined each test file change with fresh eyes.

## change-by-change analysis

| file | change | type | domain impact |
|------|--------|------|---------------|
| hasMetadata.test.ts | `import` → `import type` | infra | none — type-only import syntax |
| hasMetadata.test.ts | `const pot` → `const _pot` | infra | none — lint fix for unused var |
| isNotNull.test.ts | `import` → `import type` | infra | none — type-only import syntax |
| isNotUndefined.test.ts | `import` → `import type` | infra | none — type-only import syntax |
| assure.test.ts | relative → `@src/` path | infra | none — path alias only |
| ArrayWith.test.ts | removed unused `when` import | infra | none — dead import removal |
| ArrayWith.test.ts | added type import | infra | none — type-only import syntax |
| DropFirst.test.ts | `import` → `import type` | infra | none — type-only import syntax |
| Literalize.test.ts | `import` → `import type` | infra | none — type-only import syntax |
| PickAny.test.ts | `import` → `import type` | infra | none — type-only import syntax |
| PickOne.test.ts | `import` → `import type` | infra | none — type-only import syntax |
| PickOne.test.ts | `{}` → `_input` | infra | none — lint fix for empty pattern |
| withAssure.test.ts | relative → `@src/` path | infra | none — path alias only |
| withNot.test.ts | relative → `@src/` path | infra | none — path alias only |

## verification questions

### are any test assertions weaker?

no. all assertions remain identical. only import statements and variable names changed.

### are any test cases removed?

no. all `it()`, `test()`, and `then()` blocks are preserved.

### are any test cases skipped?

no new skips added. the one extant skip (`withAssure > should be able to assure for a generic check`) was already present before the upgrade.

### are any behavioral expectations altered?

no. every test still verifies the same behavior with the same inputs and expected outputs.

## conclusion

all test changes are infrastructure-only. zero domain logic touched. test intentions fully preserved.
