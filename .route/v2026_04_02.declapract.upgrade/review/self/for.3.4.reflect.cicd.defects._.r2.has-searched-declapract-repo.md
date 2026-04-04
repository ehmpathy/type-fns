# self-review round 2: has-searched-declapract-repo

## re-examined with fresh eyes

opened the 3.4 artifact. verified each practice bug has a gh cli citation to the exact practice file.

## defect 1: DeclaredGithubBranchProtection

### question: was the exact practice file found?

yes.

### citation in artifact

```sh
gh search code "DeclaredGithubBranchProtection" --repo ehmpathy/declapract-typescript-ehmpathy
# src/practices/provision-github/best-practice/provision/github.repo/resources.ts

rhx git.repo.get lines --in ehmpathy/declapract-typescript-ehmpathy --paths '...resources.ts'
# line 88: const branchMainProtection = DeclaredGithubBranchProtection.as({
# line 117: requiredPullRequestReviews: null,
# line 123: return [repo, repoConfig, branchMainProtection];
```

### verification

- search command: `gh search code "DeclaredGithubBranchProtection"` - yes, used gh cli
- exact file: `src/practices/provision-github/best-practice/provision/github.repo/resources.ts` - yes, found
- line numbers: 88, 117, 123 - yes, cited

## defect 2: @jest/globals

### question: was the exact practice file found?

yes.

### citation in artifact

```sh
gh search code "@jest/globals" --repo ehmpathy/declapract-typescript-ehmpathy
# src/practices/tests/best-practice/jest.unit.env.ts: import { jest } from '@jest/globals';
# src/practices/tests/best-practice/jest.integration.env.ts: import { jest } from '@jest/globals';
# src/practices/tests/best-practice/jest.acceptance.env.ts: import { jest } from '@jest/globals';

rhx git.repo.get lines --in ehmpathy/declapract-typescript-ehmpathy --paths '.../package.json'
# devDependencies: { "@types/jest", "jest", ... } -- no @jest/globals
```

### verification

- search command: `gh search code "@jest/globals"` - yes, used gh cli
- import sites: 3 jest.env files found - yes
- package.json: verified @jest/globals is absent - yes

## issue found

the artifact had search commands but lacked direct GitHub links. the guide says "cite the root cause with a link or search result" — links make citations clickable.

### fix applied

added GitHub links to both defects in the artifact:

defect 1:
```md
- practice file: [src/practices/.../resources.ts](https://github.com/ehmpathy/declapract-typescript-ehmpathy/blob/main/src/practices/provision-github/best-practice/provision/github.repo/resources.ts#L88)
```

defect 2:
```md
- practice files:
  - [jest.unit.env.ts](https://github.com/ehmpathy/declapract-typescript-ehmpathy/blob/main/src/practices/tests/best-practice/jest.unit.env.ts)
  - [package.json](https://github.com/ehmpathy/declapract-typescript-ehmpathy/blob/main/src/practices/tests/best-practice/package.json) (lacks @jest/globals)
```

## verification after fix

### defect 1: DeclaredGithubBranchProtection

| citation type | present? |
|---------------|----------|
| gh cli search command | yes |
| practice file path | yes |
| GitHub link | yes (line 88) |
| line numbers cited | yes (88, 117, 123) |

### defect 2: @jest/globals

| citation type | present? |
|---------------|----------|
| gh cli search command | yes |
| import file paths | yes |
| GitHub links | yes (2 links) |
| package.json verification | yes |

## why it now holds

found one issue (no GitHub links), fixed it. both defects now have:
1. gh cli search command
2. direct GitHub link(s) to the practice file
3. specific content cited

citations are now both verifiable and clickable.

## conclusion

artifact enhanced with GitHub links. citations are complete.
