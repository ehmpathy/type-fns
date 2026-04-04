# self-review round 4: has-searched-declapract-repo

## what the guide asks

> did we search declapract-typescript-ehmpathy via gh cli for the exact practice?
> for each practice bug, cite the root cause with a link or search result.

two requirements:
1. searched via gh cli
2. cited with link or search result

## re-read artifact line by line

opened 3.4.reflect.cicd.defects.v1.i1.md fresh.

### defect 1: lines 13-38

**upstream citation section (lines 13-18)**:
```
- repo: ehmpathy/declastruct-github
- issue: none found
- gap: DeclaredGithubBranchProtection needs `static nested = { requiredPullRequestReviews: DomainLiteral }`
- practice file: [src/practices/provision-github/best-practice/provision/github.repo/resources.ts](https://github.com/ehmpathy/declapract-typescript-ehmpathy/blob/main/src/practices/provision-github/best-practice/provision/github.repo/resources.ts#L88)
```

**search evidence section (lines 27-38)**:
```sh
gh search code "DeclaredGithubBranchProtection" --repo ehmpathy/declapract-typescript-ehmpathy
# src/practices/provision-github/best-practice/provision/github.repo/resources.ts

rhx git.repo.get lines --in ehmpathy/declapract-typescript-ehmpathy --paths '...resources.ts'
# line 88: const branchMainProtection = DeclaredGithubBranchProtection.as({
# line 117: requiredPullRequestReviews: null,
# line 123: return [repo, repoConfig, branchMainProtection];
```

| requirement | satisfied? | evidence |
|-------------|-----------|----------|
| searched via gh cli | yes | `gh search code "DeclaredGithubBranchProtection"` |
| cited with link | yes | GitHub link to resources.ts#L88 |

### defect 2: lines 42-75

**upstream citation section (lines 52-59)**:
```
- repo: ehmpathy/declapract-typescript-ehmpathy
- issue: none found
- gap: jest.env files import @jest/globals but it's not in devDependencies
- practice files:
  - [jest.unit.env.ts](https://github.com/ehmpathy/declapract-typescript-ehmpathy/blob/main/src/practices/tests/best-practice/jest.unit.env.ts)
  - [package.json](https://github.com/ehmpathy/declapract-typescript-ehmpathy/blob/main/src/practices/tests/best-practice/package.json) (lacks @jest/globals)
```

**search evidence section (lines 67-75)**:
```sh
gh search code "@jest/globals" --repo ehmpathy/declapract-typescript-ehmpathy
# src/practices/tests/best-practice/jest.unit.env.ts: import { jest } from '@jest/globals';
...
```

| requirement | satisfied? | evidence |
|-------------|-----------|----------|
| searched via gh cli | yes | `gh search code "@jest/globals"` |
| cited with link | yes | 2 GitHub links to practice files |

## why it holds

both defects satisfy both requirements:
1. searched via gh cli: `gh search code` commands documented in search evidence
2. cited with link: GitHub links in upstream citation sections

the artifact meets the guide's criteria.

## conclusion

verified: both practice bugs have gh cli searches and GitHub links.
