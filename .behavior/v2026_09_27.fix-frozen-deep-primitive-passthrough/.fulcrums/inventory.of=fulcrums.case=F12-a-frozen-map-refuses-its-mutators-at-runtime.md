# F12 — a frozen `Map` / `Set` refuses its mutators at runtime

## .the fork

`Object.freeze(map)` does not block `map.set()` — entries live in an internal slot. the type
refuses it (F3). for the runtime to agree:

| option | effect | cost |
|--------|--------|------|
| **shadow** — define own `set` / `add` / `delete` / `clear` that throw, then freeze | same instance; `instanceof Map` holds; reads use the prototype | four own props on the instance |
| proxy — wrap in a `Proxy` that traps the mutators | a clean instance | a different object — identity breaks (F11); `Map.prototype` methods on a proxy throw `incompatible receiver` |
| copy into a custom readonly class | full control | identity breaks; `instanceof Map` fails |
| leave it — freeze only | runtime permits what the type refuses | the type/runtime gap this companion exists to close |

## .taken — shadow

the only option that keeps identity and `instanceof Map` and still refuses at runtime. the shadow
throws a `TypeError` that names the fix — *"frozen map refuses set; copy it via new Map(frozen)"* —
where a frozen property write throws node's bare message.

## .rework — clean

private to the companion. a later swap to another mechanism changes no caller.

## .confidence — 80%

- `Map.prototype.set.call(frozenMap, k, v)` bypasses the shadow. deliberate reach-around, and the
  type already refuses the call; the jsdoc names it.
- a structural clone or a serializer that walks own props sees the four shadows. none in the org
  is known to; unverified.

## .where

`src/companions/asFrozenDeep.ts`; unit test pairs `@ts-expect-error` with a runtime throw for each
mutator.
