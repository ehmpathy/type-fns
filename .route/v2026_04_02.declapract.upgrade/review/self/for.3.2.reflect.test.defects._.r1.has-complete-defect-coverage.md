# self-review: has-complete-defect-coverage

## comparison

| defect from 3.1 | present in 3.2 | classification |
|-----------------|----------------|----------------|
| biome noExplicitAny on generic constraints | ✅ | repo quirk |
| biome format issue | ✅ | repo quirk |
| unused variable in test | ✅ | repo quirk |
| empty object pattern | ✅ | repo quirk |
| `pkg as any` casts | ✅ | practice bug |
| cycle detection false positives | ✅ | practice bug |
| depcheck false positives | ✅ | split: practice bug + repo quirk |
| ArrayWith type not exported | ✅ | repo quirk |
| ArrayWith test lacks import | ✅ | repo quirk |
| blackbox/environment.ts broken | ✅ | expected (bad-practice flag) |

## coverage check

- 3.1 inventory: 10 defects
- 3.2 reflection: 11 rows (depcheck split into 2 categories)

all defects from 3.1 are covered in 3.2.

## classification quality check

| classification | count | rationale provided |
|----------------|-------|-------------------|
| repo quirk | 7 | ✅ each has explanation |
| practice bug | 3 | ✅ each has citation and fix |
| expected | 1 | ✅ explains bad-practice intent |

## conclusion

all defects are covered. each has a classification with rationale.
