# self-review round 3: has-compared-against-main

## re-examined with fresh eyes

ran the actual diff commands again. verified each defect's root cause traces to specific changes.

## defect 1: github / plan fails

### the diff

```sh
git diff origin/main -- provision/github.repo/resources.ts
```

output:
```diff
diff --git a/provision/github.repo/resources.ts b/provision/github.repo/resources.ts
new file mode 100644
...
+import {
+  DeclaredGithubBranchProtection,
...
+const _branchMainProtection = DeclaredGithubBranchProtection.as({
+  ...
+  requiredPullRequestReviews: null,
...
```

### how "what changed?" was asked

the file is entirely new. the upgrade scaffold added it. therefore, any failure from this file is upgrade-caused by definition.

### how the diff informed root cause

the diff shows `DeclaredGithubBranchProtection` with `requiredPullRequestReviews: null`. when the GitHub API returns a non-null object for this field (because branch protection exists with PR review settings), domain-objects throws `DomainObjectNotSafeToManipulateError`. this happens because declastruct-github does not declare `static nested = { requiredPullRequestReviews: ... }` for nested object hydration.

the upgrade caused this because it introduced a resource that exposes a bug in declastruct-github.

## defect 2: test-types fails on @jest/globals

### the diff

```sh
git diff origin/main -- package.json
```

relevant portions:
```diff
-    "test:types": "tsc -p ./tsconfig.build.json --noEmit",
+    "test:types": "tsc -p ./tsconfig.json --noEmit",
...
```

and the lockfile change:
```sh
git status
# D  package-lock.json
# A  pnpm-lock.yaml
```

### how "what changed?" was asked

two things changed:
1. package manager: npm to pnpm
2. tsconfig used for type check: tsconfig.build.json to tsconfig.json

### how the diff informed root cause

the root cause is the package manager change. npm hoists all transitive dependencies to node_modules root. pnpm does not. `@jest/globals` was accessible via npm as a transitive dep of jest@30, but pnpm strict mode requires explicit installation.

the upgrade caused this because it switched from npm to pnpm.

## why it holds

| defect | change from diff | how change caused defect |
|--------|-----------------|-------------------------|
| github / plan | new provision/github.repo/resources.ts | introduced resource that exposes upstream bug |
| test-types | package-lock.json to pnpm-lock.yaml | pnpm strict mode broke transitive import |

both defects were diagnosed by "what changed?" and traced the diff to the failure.

## conclusion

verified: each defect was compared against origin/main. the diffs directly informed root cause analysis.
