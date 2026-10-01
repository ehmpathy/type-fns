# F11 — `asFrozenDeep` freezes in place and returns the same reference

## .the fork

| option | effect |
|--------|--------|
| **in place** — `Object.freeze` the input, return it narrowed | identity holds: `asFrozenDeep(x) === x` |
| copy — clone deep, freeze the clone, return it | the input stays mutable; identity breaks |

## .taken — in place

- **downstream depends on identity.** the sdk's freeze is in place for this reason: a copy would
  break `headers === event.headers`, and the projection would drift from its envelope
  (`sdk-aws-lambda/…/setEventFrozen.ts:37-39`). `asFrozenDeep` must be a drop-in for it.
- **it is what `Object.freeze` does.** the companion named for the freeze behaves like the freeze.
- **a copy leaves a mutable twin.** the caller still holds the original, and a write through it
  succeeds — the hazard a freeze exists to remove.

## .rework — clean

one function body. a `{ copy: true }` option, if ever wanted, adds without a break.

## .confidence — 90%

the residual: the `as*` prefix reads as a pure cast, and this one has an effect on its input.
`setFrozen*` would name the effect, and breaks the `as$Noun` shape the family asked for. the jsdoc
states the effect. a council may prefer the `set` verb.

the name is the wisher's, verbatim: *"how about asFrozenDeep operation as a companion too plz"*.
four peer lanes at 5.1 i001 flag the `as*` prefix (arch-hazards-behavior b2,
ergo-friction-hazards n3, arch-opport-decomposition, arch-smell-scopeleaks). a rename is a
one-file sed plus the readme, so it stays clean — but it overrules the wisher's own word, so the
driver holds it for the council rather than rename unasked.

## .where

`src/companions/asFrozenDeep.ts`; the jsdoc `.note` on in-place.
