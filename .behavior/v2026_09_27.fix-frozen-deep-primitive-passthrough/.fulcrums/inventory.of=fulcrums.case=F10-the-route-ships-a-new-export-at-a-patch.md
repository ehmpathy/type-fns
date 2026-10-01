# F10 — a new root export under a `fix` bind cuts a patch

**rework** clean · **status** ✅ upheld 2026-09-28

## .verdict

**upheld by the wisher: `fix` → patch.** the bind stays; the release follows the `HasMaybe`
precedent. the same patch carries the `ArrayWith` export (F7).

## .the facts

| what | source | result |
|------|--------|--------|
| branch bind | `rhx git.commit.bind get` | `level: fix`, inferred from branch `beav/fix-frozen-deep-primitive-passthrough` |
| release mechanism | `.github/workflows/release.yml` | please-release; bump from the conventional-commit type |
| #48's title | issue #48 | `feat(types): add FrozenDeep with a primitive passthrough, …` |

## .the precedent

both conventions are live in this repo, for a new symbol at the package root:

| release | commit | what shipped | bump |
|---------|--------|--------------|------|
| 1.21.4 | `f412a63` `fix(types): add HasMaybe<T, K>` | a new pure type in `src/types/`, root-exported | patch |
| 1.21.0 | `76f6b8e` `feat(assure): …` | a new guard, root-exported | minor |

`HasMaybe` is the nearer match on every axis — pure type, `src/types/`, root export — and the
same commit that settles F8.

## .the fork

| option | what it is |
|--------|-----------|
| **A — ship under `fix`** | patch; the changelog files a new type under *Bug Fixes* |
| **B — re-bind to `feat`** | human-only `git.commit.bind set --level feat`; cuts a minor, per #48's title |

## .the cost A accepts

semver calls a new export a minor. a patch breaks nobody; the version and changelog understate
what shipped, and a `~1.21.x` consumer receives a new export with no signal.

## .rework — clean

before release: one human command. after release: the next `feat:` commit cuts the minor; only a
changelog line stays misfiled.

## .where

the branch bind · the commit header
