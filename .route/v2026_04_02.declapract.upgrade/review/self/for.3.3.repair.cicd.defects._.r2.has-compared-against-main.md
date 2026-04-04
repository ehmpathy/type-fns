# self-review round 2: has-compared-against-main

## re-examined

for each defect, verified diff against main informed root cause analysis.

## defect 1: github / plan fails

### what changed?

```sh
git diff origin/main -- provision/github.repo/resources.ts
```

the diff shows:
- new file: upgrade added `provision/github.repo/resources.ts`
- declares `DeclaredGithubBranchProtection` resource with `requiredPullRequestReviews: null`

### how diff informed root cause

the diff revealed the failure came from a newly added resource. when GitHub API returns non-null for `requiredPullRequestReviews`, domain-objects throws because nested objects must be declared with `static nested`. the declastruct-github package lacks this declaration.

fix: skipped `branchMainProtection` until upstream fix.

## defect 2: test-types fails on @jest/globals

### what changed?

```sh
git diff origin/main -- package.json
git diff origin/main -- jest.env.unit.ts
```

the diff shows:
- package.json: lockfile changed from `package-lock.json` to `pnpm-lock.yaml`
- jest.env files: unchanged, still import `@jest/globals`

### how diff informed root cause

the diff revealed the package manager changed from npm to pnpm. npm hoists transitive deps, pnpm does not. `@jest/globals` was transitive via jest@30, but jest.env files import it directly. pnpm strict mode requires explicit deps.

fix: added `@jest/globals@30.2.0` as explicit devDependency.

## why it holds

both defects were diagnosed via diff comparison:
- defect 1: new file caused new behavior
- defect 2: lockfile change exposed transitive dep assumption

each root cause traces directly to what the upgrade changed.

## conclusion

all defects compared against origin/main. diffs informed root cause analysis.
