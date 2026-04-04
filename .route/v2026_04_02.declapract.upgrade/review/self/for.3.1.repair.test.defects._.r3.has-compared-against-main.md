# self-review round 3: has-compared-against-main

## deeper verification

re-read round 2 analysis and ran actual diffs. found an error in my prior claims.

## issue found: ArrayWith categorization was wrong

### what i claimed

round 2 said: "pre-extant issues — ArrayWith export, ArrayWith import"

### what the diff actually shows

```
git diff origin/main -- src/types/ArrayWith.ts src/types/ArrayWith.test.ts
```

reveals:

| file | change | actual cause |
|------|--------|--------------|
| ArrayWith.test.ts | removed unused `when` import | upgrade (biome noUnusedLocals) |
| ArrayWith.test.ts | added `ArrayWith` type import | my fix |
| ArrayWith.ts | added `export` keyword | my fix |

### corrected analysis

the `export` issue in ArrayWith.ts IS pre-extant — the type was never exported.

but the test file WAS touched by the upgrade (removed `when`). so it's not purely pre-extant.

the correct categorization:

| category | count | examples |
|----------|-------|----------|
| biome rule differences | 8 | noExplicitAny, noUnusedVariables, noEmptyPattern, format, **ArrayWith unused import** |
| pre-extant issues | 1 | ArrayWith export |
| template artifact issues | 1 | blackbox/environment.ts |

## what holds from round 2

- biome noExplicitAny: verified via package.json diff
- cycle detection: verified via package.json diff
- depcheck: verified via .depcheckrc.yml diff
- hasMetadata.ts: verified, shows biome-ignore additions

## lesson

"did the upgrade touch this file?" requires the actual diff, not an assumption from memory. i assumed ArrayWith files were untouched because the *defect* seemed pre-extant. but the upgrade did touch the test file.

## conclusion

round 2 analysis was mostly correct but miscategorized ArrayWith. the core claim — that each defect was compared against main — holds, but i did not run the diff carefully enough on the first pass.
