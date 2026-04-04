# self-review round 4: has-complete-defect-entries

## re-examined with deeper scrutiny

opened the artifact fresh. walked through each line. questioned whether each field truly answers its question.

## issue found

the **how** fields described what changed but did not include diff evidence. the guide says "diff against origin/main is documented" — the diffs were documented in r3.has-compared-against-main.md, but not in the artifact itself. each entry should be self-contained.

### fix applied

added diff evidence to both **how** fields:

defect 1:
```sh
git diff origin/main -- provision/github.repo/resources.ts
# new file mode 100644
```

defect 2:
```sh
git status
# D  package-lock.json
# A  pnpm-lock.yaml
```

now each entry includes the verification command and relevant output.

## verification after fix

### defect 1: github / plan fails

| field | present? | self-contained? |
|-------|----------|-----------------|
| what | yes | yes - names error |
| how | yes | yes - now includes diff command |
| why | yes | yes - explains mechanism |
| fix | yes | yes - documents both attempts |

### defect 2: test-types fails on @jest/globals

| field | present? | self-contained? |
|-------|----------|-----------------|
| what | yes | yes - quotes error |
| how | yes | yes - now includes diff evidence |
| why | yes | yes - explains pnpm behavior |
| fix | yes | yes - specific package and version |

## why it now holds

found one issue (diff evidence not inline), fixed it. re-verified all 8 fields are now complete and self-contained.

## conclusion

all defect entries now have complete what/how/why/fix documentation with diff evidence inline.
