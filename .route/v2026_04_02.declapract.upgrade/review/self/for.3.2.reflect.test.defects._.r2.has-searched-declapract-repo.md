# self-review round 2: has-searched-declapract-repo

## issue from r1

r1 noted: "could not locate exact template file" for the `as any` practice bug.

## fix: found the template

**search command**:
```sh
rhx git.repo.get files --in ehmpathy/declapract-typescript-ehmpathy --paths 'src/practices/provision-github/**/*'
```

**result**: found `src/practices/provision-github/best-practice/provision/github.repo/resources.ts`

**verification command**:
```sh
rhx git.repo.get lines --in ehmpathy/declapract-typescript-ehmpathy --paths 'src/practices/provision-github/best-practice/provision/github.repo/resources.ts'
```

**found**:
- line 34: `Promise<DomainEntity<any>[]>`
- line 39: `(pkg as any).description`
- line 40: `(pkg as any).private`
- line 41: `(pkg as any).private`
- line 42: `(pkg as any).homepage`

**url**: https://github.com/ehmpathy/declapract-typescript-ehmpathy/blob/main/src/practices/provision-github/best-practice/provision/github.repo/resources.ts

## updated summary

| practice bug | searched | citation |
|--------------|----------|----------|
| cycle detection exclude | ✅ | `src/practices/lint/best-practice/package.json` line 13 |
| depcheck rhachet-brains-xai | ✅ | `src/practices/lint/best-practice/.depcheckrc.yml` absent entry |
| `as any` in resources.ts | ✅ | `src/practices/provision-github/best-practice/provision/github.repo/resources.ts` lines 34, 39-42 |

## conclusion

all 3 practice bugs now have full citations with search commands and file paths.
