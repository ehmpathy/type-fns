# self-review round 1: has-searched-declapract-repo

## re-examined

searched declapract-typescript-ehmpathy via gh cli for the exact practices.

## defect 1: DeclaredGithubBranchProtection

### search

```sh
gh search code "DeclaredGithubBranchProtection" --repo ehmpathy/declapract-typescript-ehmpathy
```

### results

```
ehmpathy/declapract-typescript-ehmpathy:src/practices/provision-github/best-practice/provision/github.repo/resources.ts: DeclaredGithubBranchProtection,
ehmpathy/declapract-typescript-ehmpathy:src/practices/provision-github/best-practice/provision/github.repo/resources.ts: const branchMainProtection = DeclaredGithubBranchProtection.as({
```

### exact practice

```sh
rhx git.repo.get lines --in ehmpathy/declapract-typescript-ehmpathy --paths 'src/practices/provision-github/best-practice/provision/github.repo/resources.ts'
```

```ts
// line 88
const branchMainProtection = DeclaredGithubBranchProtection.as({
// line 117
  requiredPullRequestReviews: null,
// line 123
return [repo, repoConfig, branchMainProtection];
```

the practice includes branchMainProtection in the returned resources. when GitHub API returns non-null for requiredPullRequestReviews, declastruct-github fails because it lacks nested object support.

## defect 2: @jest/globals

### search

```sh
gh search code "@jest/globals" --repo ehmpathy/declapract-typescript-ehmpathy
```

### results

```
ehmpathy/declapract-typescript-ehmpathy:src/practices/tests/best-practice/jest.unit.env.ts: import { jest } from '@jest/globals';
ehmpathy/declapract-typescript-ehmpathy:src/practices/tests/best-practice/jest.integration.env.ts: import { jest } from '@jest/globals';
ehmpathy/declapract-typescript-ehmpathy:src/practices/tests/best-practice/jest.acceptance.env.ts: import { jest } from '@jest/globals';
```

### exact practice

```sh
rhx git.repo.get lines --in ehmpathy/declapract-typescript-ehmpathy --paths 'src/practices/tests/best-practice/package.json'
```

```json
{
  "devDependencies": {
    "@types/jest": "@declapract{check.minVersion('30.0.0')}",
    "jest": "@declapract{check.minVersion('30.2.0')}",
    // ... no @jest/globals
  }
}
```

the practice's jest.env files import @jest/globals, but package.json does not include it as a devDependency.

## why it holds

both defects were searched via gh cli:
- defect 1: found exact practice file and line numbers
- defect 2: found the import sites and confirmed package.json lacks the dep

citations are specific and verifiable.

## conclusion

searched declapract-typescript-ehmpathy. found exact practices for both bugs.
