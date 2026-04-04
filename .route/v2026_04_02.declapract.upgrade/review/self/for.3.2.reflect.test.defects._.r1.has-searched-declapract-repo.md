# self-review: has-searched-declapract-repo

## practice bugs with citations

### 1. cycle detection exclude pattern

**search command**:
```sh
gh search code --repo ehmpathy/declapract-typescript-ehmpathy "dpdm"
```

**result**: found `src/practices/lint/best-practice/package.json`

**verification command**:
```sh
rhx git.repo.get lines --in ehmpathy/declapract-typescript-ehmpathy --paths 'src/practices/lint/best-practice/package.json'
```

**found**: line 13 shows `--exclude '^$'` which only matches empty string

**url**: https://github.com/ehmpathy/declapract-typescript-ehmpathy/blob/main/src/practices/lint/best-practice/package.json

### 2. depcheck ignores absent rhachet-brains-xai

**verification command**:
```sh
rhx git.repo.get lines --in ehmpathy/declapract-typescript-ehmpathy --paths 'src/practices/lint/best-practice/.depcheckrc.yml'
```

**found**: file has `rhachet-brains-anthropic` but not `rhachet-brains-xai`

**url**: https://github.com/ehmpathy/declapract-typescript-ehmpathy/blob/main/src/practices/lint/best-practice/.depcheckrc.yml

### 3. provision/github.repo/resources.ts uses `as any`

**search command**:
```sh
gh search code --repo ehmpathy/declapract-typescript-ehmpathy "provision/github.repo"
```

**note**: could not locate exact template file. this practice bug may need further investigation to find the source template.

## summary

| practice bug | searched | citation |
|--------------|----------|----------|
| cycle detection exclude | ✅ | line 13 of package.json |
| depcheck rhachet-brains-xai | ✅ | .depcheckrc.yml absent entry |
| `as any` in resources.ts | partial | template location unclear |

## conclusion

2 of 3 practice bugs have full citations. the third (`as any` in provision template) needs further investigation to locate the source — the file was created by upgrade but the template path in declapract is unclear.
