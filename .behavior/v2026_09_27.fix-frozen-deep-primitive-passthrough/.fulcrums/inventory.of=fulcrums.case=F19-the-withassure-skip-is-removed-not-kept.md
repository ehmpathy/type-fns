# F19 — the `withAssure` skip is removed, not kept

## .the fork

5.3 forbids skips (*"skipped test → remove the skip and make it pass NOW"*). the suite held one:
`src/wrappers/withAssure.test.ts`, `it.skip('should be able to assure for a generic check')` —
an extant test outside this wish's surface.

| option | cost |
|--------|------|
| **a — remove the skip, name the fixture** (taken) | an extant test changes: +5 −3. its assertions stay verbatim |
| b — keep the skip | the stone's zero-skips mandate fails; the gate can not pass |
| c — delete the test | coverage lost; worse than both |

## .taken, and why at the time

the skip had one cause: the fixture bound the predicate to `isNotNullOrig`, and `withAssure` names a
check after its function (`withAssure.ts:28`, `options?.name ?? assess.name`), so the message read
`'isNotNullOrig'` while the test asserted `'isNotNull'`. the fixture now passes `{ name: 'isNotNull' }`,
as the specific-check test above it already does. every `expect` line is unchanged. the
`@ts-expect-error` on the generic return type is unchanged.

⇒ the intent held: *a generic check assures, throws on null, and names itself.* no source change to
`withAssure` — the name derivation is correct; the fixture was what drifted.

peer lanes r4 and r8 flag it as an extant-test change with no human approval. that is true, and it is
the approval this row asks for.

## .rework

**clean** — restore the three lines and the `.skip`. naught else depends on it.

## .confidence — 85%, and why not higher

the fix is plainly correct. the doubt is scope: a wisher who scoped the route to `FrozenDeep` may
prefer an out-of-scope skip left for its own pr, and 5.3's mandate may not have meant to reach a test
this route never touched.

## .where

- `src/wrappers/withAssure.test.ts:56`
- `review/self/for.5.3.verification._.has-zero-test-skips.md`, `…has-preserved-test-intentions.md`

## .verdict

✅ **approved** 2026-09-29 by the wisher — keep the un-skip and the named fixture.
