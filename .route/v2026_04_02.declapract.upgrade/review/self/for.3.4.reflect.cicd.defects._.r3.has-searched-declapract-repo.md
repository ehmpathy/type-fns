# self-review round 3: has-searched-declapract-repo

## issue found

the artifact had search commands but lacked direct GitHub links to the practice files. the guide says "cite the root cause with a link or search result" — links make citations verifiable in one click.

### fix applied

added GitHub links to both defects:

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
| GitHub link | yes (with line number) |
| line numbers cited | yes (88, 117, 123) |

### defect 2: @jest/globals

| citation type | present? |
|---------------|----------|
| gh cli search command | yes |
| import file paths | yes (3 jest.env files) |
| GitHub links | yes (2 links) |
| package.json verification | yes |

## why it now holds

both defects have:
1. gh cli search command that shows how the file was found
2. direct GitHub link(s) to the practice file
3. specific content cited (line numbers or assertion)

citations are now both verifiable via gh cli and clickable via browser.

## conclusion

artifact enhanced with GitHub links. citations are complete and verifiable.
