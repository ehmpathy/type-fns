# self-review round 2: has-compared-against-main

## verification method

ran `git diff origin/main -- <file>` for each defect to understand why the upgrade caused it.

## defect-by-defect analysis

### 1. biome noExplicitAny on generic constraints

**diff context**: package.json shows eslint → biome migration

**root cause**: biome's `noExplicitAny` rule is stricter than eslint's `@typescript-eslint/no-explicit-any`. generic constraints like `T extends Record<string, any>` are flagged by biome but were allowed by eslint.

**fix**: added `biome-ignore` comments with clear rationale.

### 2. biome format issue (comment placement)

**diff context**: biome replaces prettier for format checks

**root cause**: biome has different rules for inline comments. the `// omit all keys` comment inline with `=` violated biome format rules.

**fix**: moved comment to separate line above the code.

### 3. unused variable in test (`pot` → `_pot`)

**diff context**: biome's `noUnusedVariables` rule

**root cause**: biome enforces unused variable detection differently. eslint allowed the unused `pot` variable; biome flagged it.

**fix**: prefixed with underscore to indicate intentional non-use.

### 4. empty object pattern (`{}` → `_input`)

**diff context**: biome's `noEmptyPattern` rule

**root cause**: biome disallows empty destructure patterns `{}` in function parameters. eslint permitted this.

**fix**: changed to named parameter `_input`.

### 5. `pkg as any` casts in provision/github.repo/resources.ts

**diff context**: new file introduced by upgrade template

**root cause**: template used `pkg as any` to access package.json fields. biome's `noExplicitAny` flagged this.

**fix**: created typed `PackageJson` interface with needed fields.

### 6. cycle detection false positives

**diff context**: package.json shows new `test:lint:cycles` command with dpdm

**root cause**: the exclude pattern `'^` was meant to exclude `node_modules` but the regex only matched empty string. this is a template defect.

**fix**: changed to literal string `'node_modules'`.

### 7. depcheck false positives

**diff context**: .depcheckrc.yml shows extensive changes

**root cause**: upgrade added new devDependencies (rhachet-*, @swc/*, tsx, etc.) that are used transitively or via npx. depcheck flagged them as unused.

**fix**: added each to ignores list in .depcheckrc.yml.

### 8. ArrayWith type not exported

**diff context**: src/types/ArrayWith.ts unchanged by upgrade

**root cause**: pre-extant issue — type lacked `export` keyword. test failed because it tried to import an unexported type.

**fix**: added `export` keyword.

### 9. ArrayWith test lacks import

**diff context**: src/types/ArrayWith.test.ts unchanged by upgrade

**root cause**: pre-extant issue — test referenced `ArrayWith` without import statement.

**fix**: added type import.

### 10. blackbox/environment.ts broken

**diff context**: new file from upgrade template

**root cause**: template artifact referenced `../src/utils/environment` which does not exist in this repo.

**fix**: deleted the broken template file.

## conclusion

all defects were compared against origin/main. root causes are understood:
- 7 defects from biome vs eslint rule differences
- 2 defects from pre-extant issues (ArrayWith)
- 1 defect from broken template artifact
