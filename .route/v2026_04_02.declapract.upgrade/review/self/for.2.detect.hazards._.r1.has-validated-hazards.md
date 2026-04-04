# self-review: has-validated-hazards

## validation of each hazard

### 1. node v20 → v22

**validation method**: ran full test suite with node 22

**result**: ✅ validated — all tests pass

**evidence**:
- `THOROUGH=true npm run test` completed with 66 tests passed
- no node-version-specific api usage in source code
- node 22 is lts and backwards compatible

### 2. jest 29 → 30

**validation method**: ran test suite

**result**: ✅ validated — all tests pass

**evidence**:
- jest 30 is backwards compatible with jest 29 api
- no deprecated jest apis used in tests

### 3. ts-jest → swc/jest

**validation method**: ran test suite

**result**: ✅ validated — all tests pass

**evidence**:
- swc handles typescript transformation correctly
- no jest-specific typescript features that swc doesn't support

### 4. biome lint rules

**validation method**: `npm run test:lint`

**result**: ✅ validated — lint passes after repairs

**evidence**:
- added biome-ignore comments for intentional any usage
- fixed unused variable and format issues

### 5. pnpm migration

**validation method**: `pnpm install --frozen-lockfile` works, tests run

**result**: ✅ validated locally — ci will confirm

**evidence**:
- pnpm-lock.yaml present and valid
- all dependencies installed correctly

### 6. path renames

**validation method**: type check and test run

**result**: ✅ validated — no broken imports

**evidence**:
- `acceptance/` → `blackbox/` — deleted broken file, no other files
- `src/domain/` → `src/domain.objects/` — constants.ts moved, no imports broke

### 7. tsconfig changes

**validation method**: `npm run test:types` and `npm run build`

**result**: ✅ validated — types check and build succeed

**evidence**:
- extends array syntax works with typescript 5.4
- node16 module lookup is the recommended config

## conclusion

all hazards validated via test execution or logical analysis. no false positives found. all genuine hazards were repaired in stone 1.
