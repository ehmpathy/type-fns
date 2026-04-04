# self-review round 5: has-complete-defect-entries

## post-fix verification

r4 found an issue: diff evidence was not inline in the artifact. the fix was applied. this round verifies the artifact is now complete.

## re-read the artifact

opened 3.3.repair.cicd.defects.v1.i1.md fresh. line by line review below.

## defect 1: github / plan fails

### what (line 18)
> provision workflow fails with `DomainObjectNotSafeToManipulateError`

the defect is described: workflow named, error named.

### how (lines 20-29)
> upgrade added provision workflow with DeclaredGithubBranchProtection resource
>
> ```sh
> git diff origin/main -- provision/github.repo/resources.ts
> # new file mode 100644
> # +import { DeclaredGithubBranchProtection } from 'declastruct-github';
> # +const _branchMainProtection = DeclaredGithubBranchProtection.as({
> # +  requiredPullRequestReviews: null,
> # ...
> ```

diff against origin/main is now documented inline. command shown, output shows new file with the relevant code.

### why (lines 31)
> declastruct-github does not declare `nested` property for `requiredPullRequestReviews`...

root cause explained: library gap, trigger condition, consequence.

### fix (lines 33-35)
> 1. upgraded declastruct-github 1.3.0 to 1.3.4 (did not fix)
> 2. skipped branchMainProtection resource until upstream fix

fix documented: both attempts, forward path noted.

## defect 2: test-types fails on @jest/globals

### what (line 39)
> `Cannot find module '@jest/globals'` in jest.*.env.ts files

error message quoted, affected files named.

### how (lines 41-50)
> upgrade migrated from npm to pnpm
>
> ```sh
> git status
> # D  package-lock.json
> # A  pnpm-lock.yaml
>
> git diff origin/main -- package.json
> # lockfile changed: npm → pnpm
> ```

diff evidence now inline. shows both lockfile change and package.json verification.

### why (lines 52)
> pnpm strict mode only allows imports from direct dependencies...

root cause explained: pnpm behavior, prior state, contrast with npm.

### fix (line 54)
> added `@jest/globals@30.2.0` as explicit devDependency

specific package, version, dependency type.

## why it holds

all 8 fields verified after fix:
- what: both defects describe symptoms clearly
- how: both now include diff command and output inline
- why: both explain the mechanism that caused the defect
- fix: both document specific fixes taken

the artifact is self-contained. a reader needs no external context to understand each defect.

## conclusion

defect entries are complete. issue from r4 has been addressed.
