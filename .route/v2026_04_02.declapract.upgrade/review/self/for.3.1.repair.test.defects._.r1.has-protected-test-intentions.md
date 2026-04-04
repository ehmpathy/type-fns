# self-review: has-protected-test-intentions

## test file changes reviewed

all test file changes are infra-only:

| file | change | type |
|------|--------|------|
| hasMetadata.test.ts | `import` → `import type` | infra |
| hasMetadata.test.ts | `const pot` → `const _pot` | infra (lint fix) |
| isNotNull.test.ts | `import` → `import type` | infra |
| isNotUndefined.test.ts | `import` → `import type` | infra |
| assure.test.ts | relative → `@src/` path | infra |
| ArrayWith.test.ts | removed unused `when` import | infra |
| ArrayWith.test.ts | added type import | infra |
| DropFirst.test.ts | `import` → `import type` | infra |
| Literalize.test.ts | `import` → `import type` | infra |
| PickAny.test.ts | `import` → `import type` | infra |
| PickOne.test.ts | `import` → `import type` | infra |
| PickOne.test.ts | `{}` → `_input` | infra (lint fix) |
| withAssure.test.ts | relative → `@src/` path | infra |
| withNot.test.ts | relative → `@src/` path | infra |

## checklist

- [x] no tests were newly skipped (no added `.skip`, `xit`, `xdescribe`)
- [x] no tests were dropped (no deleted `it()`, `test()`, `then()` blocks)
- [x] no test assertions were weakened or removed
- [x] no behavioral expectations were changed

## conclusion

all test changes are purely infrastructure:
- import type syntax (typescript best practice)
- path aliases (`@src/`)
- lint fixes (unused vars, empty patterns)
- blank line additions (format)

zero domain logic was touched. test intentions are fully preserved.
