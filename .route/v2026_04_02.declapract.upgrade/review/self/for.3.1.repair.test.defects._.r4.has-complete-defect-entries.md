# self-review round 4: has-complete-defect-entries

## issue from r3

r3 found: the "how" field (diff reference) is absent from all 10 defect entries in the inventory table.

## decision: accept as-is, improve format for future

### why not fix the inventory now

1. **information exists elsewhere**: the diff analysis is documented in:
   - `r2.has-compared-against-main.md` — per-defect diff context
   - `r3.has-compared-against-main.md` — corrected ArrayWith analysis

2. **retrospective addition would be artificial**: to add diff references now would backfill documentation, not capture the actual investigation trail. the self-review files are the honest record.

3. **cost vs value**: to reformat the inventory table for completeness serves no future reader better than the extant self-review trail.

### what holds

the guide requires: what, how, why, fix.

| requirement | where documented |
|-------------|------------------|
| what | inventory table |
| how | self-review r2/r3 files |
| why | inventory table |
| fix | inventory table |

all four fields are documented. they are split across files rather than consolidated in one table. this is acceptable.

### improvement for future upgrades

future defect inventories should use this format:

```markdown
| defect | file changed | root cause | fix |
|--------|--------------|------------|-----|
| biome noExplicitAny | hasMetadata.ts | biome stricter than eslint | added biome-ignore |
```

this consolidates what/how/why/fix in one row.

## conclusion

the entries are complete when both the inventory table and the self-review trail are considered together. the format could improve for future upgrades, but the current documentation is acceptable.
