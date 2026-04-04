# self-review round 2: has-validated-hazards

## second pass validation

re-examined each hazard with fresh eyes.

### validation summary

| hazard | validation | status |
|--------|------------|--------|
| node v20 → v22 | `THOROUGH=true npm test` passes | ✅ validated |
| jest 29 → 30 | 66 tests pass | ✅ validated |
| ts-jest → swc/jest | tests pass, faster execution | ✅ validated |
| biome lint | `npm run test:lint` passes | ✅ validated |
| pnpm migration | install works, tests run | ✅ validated |
| path renames | no broken imports | ✅ validated |
| tsconfig changes | types check, build succeeds | ✅ validated |

### are any not actual issues?

**reviewed each hazard for false positives:**

1. **node v22**: not a false positive. node version changes can cause real issues, but this one is verified safe via test execution.

2. **jest 30**: not a false positive. major version bumps can have backwards-incompatible changes. verified safe via 66 tests.

3. **swc/jest**: not a false positive. different transpilers can behave differently. verified safe via test execution.

4. **biome**: not a false positive. different linters have different rules. required repairs in stone 1.

5. **pnpm**: not a false positive. different package managers can behave differently. verified locally, ci will confirm.

6. **path renames**: not a false positive. renames can break imports. verified no breakage occurred.

7. **tsconfig**: not a false positive. config changes can affect compilation. verified via type check and build.

### conclusion

all hazards are genuine — none are false positives. all have been validated via test execution. the upgrade is safe to proceed.
