# self-review: has-complete-hazard-scan

## re-scanned for missed hazards

### additional hazards found on re-scan

#### 1. node version bump (config hazard)

**change**: `.nvmrc` — v20.12.2 → v22.21.0

**risk**: medium — node 22 may have backwards-incompatible changes vs node 20

**why it holds**:
- node 22 is lts as of 2024
- jest 30 and other tools already support node 22
- local tests pass with node 22 (inherited from environment)
- ci runners have node 22 available via setup-node

**status**: ⚠️ worth a note in hazard report but verified to work locally

#### 2. tsconfig extends format (config hazard)

**change**: single string → array of configs
```json
// before
"extends": "@tsconfig/node-lts-strictest/tsconfig.json"

// after
"extends": [
  "@tsconfig/strictest/tsconfig.json",
  "@tsconfig/node20/tsconfig.json"
]
```

**risk**: low — typescript supports array extends

**why it holds**:
- `test:types` passes
- build compiles successfully
- this is a modern tsconfig pattern

#### 3. module resolution change (config hazard)

**change**: added explicit module/moduleResolution:
```json
"module": "node16",
"moduleResolution": "node16"
```

**risk**: low — makes resolution explicit rather than inferred

**why it holds**:
- typescript recommends node16 for modern esm/cjs interop
- tests pass with this config

#### 4. jest transform change (test hazard)

**change**: ts-jest → @swc/jest

**risk**: low — swc is faster and jest 30 compatible

**why it holds**:
- all 66 tests pass
- swc handles typescript transformation correctly
- this is the modern pattern for jest + typescript

#### 5. jest reporter change (test hazard)

**change**: added slowtest reporter from test-fns

**risk**: none — additive, does not affect test execution

**why it holds**:
- reporter only adds output, does not change test behavior

### hazards confirmed as non-issues

| hazard | why it holds |
|--------|--------------|
| jest 29 → 30 | test suite passes (66 tests) |
| test-fns version bump | all bdd tests work correctly |
| biome rules | repaired in stone 1, lint passes |
| pnpm migration | local install works, ci will verify |
| path renames | verified no broken imports |
| husky safety check | graceful skip if husky not installed |
| maxWorkers 50% | performance optimization, no behavior change |
| moduleNameMapper @/* | matches tsconfig paths, verified in tests |

## conclusion

found 5 additional hazards on thorough re-scan:
1. node 22 bump — verified to work
2. tsconfig extends array — verified to work
3. node16 module resolution — verified to work
4. ts-jest → swc/jest — verified to work
5. slowtest reporter — additive, no risk

all pass local verification. ci will be the final test.
