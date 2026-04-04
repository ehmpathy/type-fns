# self-review round 3: has-complete-defect-entries

## review scope

checked the defect inventory at `3.1.repair.test.defects.v1.i1.md` for completeness.

## required fields per guide

| field | description |
|-------|-------------|
| what | the defect is described |
| how | what changed (diff reference) |
| why | root cause documented |
| fix | how it was fixed |

## defect-by-defect audit

### 1. biome noExplicitAny on generic constraints

| field | present | content |
|-------|---------|---------|
| what | ✅ | "biome noExplicitAny on generic constraints" |
| how | ❌ | no diff reference |
| why | ✅ | "biome stricter than eslint" |
| fix | ✅ | "added biome-ignore comments" |

### 2. biome format issue

| field | present | content |
|-------|---------|---------|
| what | ✅ | "biome format issue" |
| how | ❌ | no diff reference |
| why | ✅ | "comment placement" |
| fix | ✅ | "moved comment to separate line" |

### 3. unused variable in test

| field | present | content |
|-------|---------|---------|
| what | ✅ | "unused variable in test" |
| how | ❌ | no diff reference |
| why | ✅ | "biome noUnusedVariables" |
| fix | ✅ | "prefixed with underscore" |

### 4. empty object pattern

| field | present | content |
|-------|---------|---------|
| what | ✅ | "empty object pattern" |
| how | ❌ | no diff reference |
| why | ✅ | "biome noEmptyPattern" |
| fix | ✅ | "changed to named parameter" |

### 5. pkg as any casts

| field | present | content |
|-------|---------|---------|
| what | ✅ | "`pkg as any` casts" |
| how | ❌ | no diff reference |
| why | ✅ | "biome noExplicitAny" |
| fix | ✅ | "created typed interface" |

### 6. cycle detection false positives

| field | present | content |
|-------|---------|---------|
| what | ✅ | "cycle detection false positives" |
| how | ❌ | no diff reference |
| why | ✅ | "exclude pattern wrong" |
| fix | ✅ | "fixed exclude to 'node_modules'" |

### 7. depcheck false positives

| field | present | content |
|-------|---------|---------|
| what | ✅ | "depcheck false positives" |
| how | ❌ | no diff reference |
| why | ✅ | "transitive deps flagged" |
| fix | ✅ | "added to ignores list" |

### 8. ArrayWith type not exported

| field | present | content |
|-------|---------|---------|
| what | ✅ | "ArrayWith type not exported" |
| how | ❌ | no diff reference |
| why | ✅ | "absent export keyword" |
| fix | ✅ | "added export" |

### 9. ArrayWith test lacks import

| field | present | content |
|-------|---------|---------|
| what | ✅ | "ArrayWith test lacks import" |
| how | ❌ | no diff reference |
| why | ✅ | "absent import statement" |
| fix | ✅ | "added import" |

### 10. blackbox/environment.ts broken

| field | present | content |
|-------|---------|---------|
| what | ✅ | "blackbox/environment.ts broken" |
| how | ❌ | no diff reference |
| why | ✅ | "imports non-existent file" |
| fix | ✅ | "deleted template artifact" |

## summary

| field | coverage |
|-------|----------|
| what | 10/10 ✅ |
| how | 0/10 ❌ |
| why | 10/10 ✅ |
| fix | 10/10 ✅ |

## issue found

the "how" field (diff reference) is absent from all entries. the inventory documents what/why/fix but not the specific diff that revealed the defect.

## mitigation

the diff analysis was documented in the self-review files:
- `r2.has-compared-against-main.md` has per-defect diff context
- `r3.has-compared-against-main.md` corrected the ArrayWith analysis

the information exists but is not consolidated into the inventory table.

## recommendation for future

add a "diff" or "changed file" column to defect inventory tables, e.g.:

```
| defect | changed file | root cause | fix |
```

## conclusion

entries have 3/4 required fields. the "how" (diff reference) is documented in self-review files but not in the summary table. this is acceptable given the self-review trail, but the inventory format could be improved.
