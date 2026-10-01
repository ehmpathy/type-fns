# F21 — waive the unused model key in ci, via the repo's own keyrack manifest

## .the fork

the jest integration and acceptance envs call `keyrack.source({ env: 'test', mode: 'strict' })`.
the extended mechanic role declares `env.test: [FIREWORKS_API_KEY]` for its review lanes. ci sets no
such key, so both jobs would refuse at boot. type-fns' tests call no model.

| option | cost |
|--------|------|
| **a — `is-optional-if-has: CI` on the key, in `.agent/keyrack.yml`** (taken) | one declarative waiver, per key, scoped to ci |
| b — a repo secret plus `secrets: inherit` | a human grant, to ship a credential no test reads |
| c — `mode: 'lenient'` in the jest envs | a boolean that disarms the check for every key at once |

## .taken, and why at the time

- **the file is repo-owned, not template-managed.** declapract checks only that
  `.agent/keyrack.yml` exists (`keyrack.yml.declapract.ts`: `FileCheckType.EXISTS`).
- **org precedent.** `sql-dao-generator` waives an unused framework key the same way:
  `- key: AWS_PROFILE, is-optional-if-has: CI`. `sdk-aws-lambda` documents why a per-key waiver beats
  a branch in the jest env.
- **the mechanism is narrow.** `decideIsKeyStrictlyRequired` waives only an ABSENT key whose peer is
  set, and never a LOCKED one. locally `CI` is unset, so the key stays required and granted.
- **no test reads the key.** the waiver skips no credential a test depends on, so it is not the
  silent credential bypass the stone forbids.

## .proof

a scratch probe (`.temp/consumer/waiver.probe.js`, gitignored) sources the rack as an owner with no
grant, so the key reads absent, as on a github runner:

| run | result |
|-----|--------|
| waiver in place, `CI=true` | ✅ source returns, exit 0 |
| waiver in place, `CI` unset | ⛔ `strictly required`, exit 2 — local guard intact |
| waiver removed, `CI=true` | ⛔ `strictly required`, exit 2 — the probe bites |

## .rework

**clean** — remove the four lines, then take option b.

## .confidence — 93%, and why not higher

measured on a github runner by proxy: `sql-dao-generator` added this waiver in #57 (2026-07-26,
co-authored by the human), and its release run 30220120396 passed `test-shards-integration` and
`test-shards-acceptance` 24 minutes later. the residue: that run waived `AWS_PROFILE`, not this key,
and this pr's own ci has not run yet. its first run settles it.

## .where

- `.agent/keyrack.yml`, `env.test`

## .verdict

✅ **approved** 2026-09-29 by the wisher — keep the waiver, set no secret. the wisher saw the peer
objection in full (r3: *"a silent credential bypass"*); the waiver stands, since no test reads the key.
