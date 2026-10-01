# F17 — route docs keep their status glyphs

## .the fork

| option | effect |
|--------|--------|
| **keep** the 🔴 ⚠️ ✅ ⛔ 🛑 glyphs in the route's vision and appendix docs | the verdict columns stay scannable at a glance |
| swap them for nature emojis, capped at 5–7 per file | a rewrite across a dozen route docs, none of which ship |

## .taken — keep, at 5.1

- **the glyphs are a verdict vocabulary, not decoration.** ⛔ = refused, ✅ = permitted, 🔴 = the
  decisive row. the experience catalog and the case files read one glyph per verdict, so a reader
  sorts a table by eye. a nature emoji carries no verdict.
- **the rule targets comments and logs.** `rule.prefer.chill-nature-emojis` governs callouts in
  code comments and log lines. route docs are the behaver's artifacts, and the behaver's own
  catalogs use the same glyphs.
- **a swap is a corpus rewrite outside the diff's point.** `rule.prefer.wickup-touched-prose` grades
  a corpus-wide rewrite smuggled into an unrelated change a blocker.

## .rework — clean

a sed across route docs. no code, no caller.

## .confidence — 90%

the residual: a reader who holds the emoji rule literal across all markdown would ask for the swap.

## .where

`1.vision.experience.case=*.md` · `appendix/*.md` · peer lane `ergo-friction-hazards` nitpick.5.
