import { ConstraintError } from 'helpful-errors';

import { isPresent } from '@src/checks/isPresent';
import type { FrozenDeep } from '@src/types/FrozenDeep';

import { kindsWithSlotMutators } from './kindsWithSlotMutators';

/**
 * .what = the mark `asFrozenDeep` sets on each object whose mutators it refused
 * .why = a second call must skip what a first call froze, and tell it apart from an object sealed
 *        by any other freeze, whose mutators can no longer be shadowed
 * .note = `Symbol.for`, so two loaded copies of this package read one mark; a marked object stays
 *         idempotent across duplicate installs
 * .note = set as a non-enumerable own prop, so `Object.keys`, json, and the walk skip it
 */
const mutatorsRefusedMark = Symbol.for('type-fns.asFrozenDeep.mutatorsRefused');

/**
 * .what = the slot-mutator kind a value is an instance of; else null
 * .why = one lookup feeds the check pass and the freeze pass alike
 */
const getOneKindWithSlotMutators = (input: {
  value: object;
}): (typeof kindsWithSlotMutators)[number] | null =>
  kindsWithSlotMutators.find((kind) => input.value instanceof kind.of) ?? null;

/**
 * .what = the mutators of a value that `asFrozenDeep` has yet to refuse; else none
 * .why = a value already marked owes none, and a value of no slot-mutator kind owes none
 */
const getAllMutatorsUnrefused = (input: { value: object }): string[] => {
  // a value this package already refused owes none
  if (Object.hasOwn(input.value, mutatorsRefusedMark)) return [];

  // a slot-mutator kind owes its mutators; any other object owes none
  return getOneKindWithSlotMutators({ value: input.value })?.mutators ?? [];
};

/**
 * .what = true for the one own property the walk must never enter: a function's `prototype`
 * .why = a class's `prototype` holds the methods every instance shares; to freeze it would freeze
 *        every instance's methods, far past the value the caller passed
 */
const isPrototypeOfFunction = (input: {
  of: object;
  key: string | symbol;
}): boolean => typeof input.of === 'function' && input.key === 'prototype';

/**
 * .what = the key and value of every own data property, symbol keys and non-enumerable keys included
 * .why = `FrozenDeep` maps every key deep, so the walk must reach every value the type claims is
 *        frozen — `Object.values` skips symbol keys, and enumerability hides `err.cause`
 * .note = data properties only: an accessor is never invoked, so the walk runs no caller code
 * .note = a function's `prototype` stays out of the walk (see `isPrototypeOfFunction`)
 */
const getAllOwnDataEntries = (input: {
  of: object;
}): { key: string | symbol; value: unknown }[] =>
  Reflect.ownKeys(input.of)
    .filter((key) => !isPrototypeOfFunction({ of: input.of, key }))
    .map((key) => ({
      key,
      descriptor: Reflect.getOwnPropertyDescriptor(input.of, key),
    }))
    .filter((own) => isPresent(own.descriptor) && 'value' in own.descriptor)
    .map((own) => ({ key: own.key, value: own.descriptor?.value }));

/**
 * .what = a string as a single-quoted js literal
 * .why = a path sits inside the json metadata of a refusal; a double-quoted key would print there
 *        as `\"sms\"`, where a single-quoted one prints as `'sms'`
 */
const asQuotedLiteral = (input: { of: string }): string =>
  `'${input.of.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/**
 * .what = the path to an own property, from its holder's path, in js accessor notation
 * .why = a refusal deep in a payload must say where it sits, or the caller hunts for it
 * .note = `value.page`, `value.tags[0]`, `value['a-b']`, `value[Symbol(tag)]`
 */
const asPathToOwnProperty = (input: {
  holder: { path: string; value: object };
  key: string | symbol;
}): string => {
  const { holder, key } = input;
  if (typeof key === 'symbol') return `${holder.path}[${String(key)}]`;
  if (Array.isArray(holder.value) && /^\d+$/.test(key))
    return `${holder.path}[${key}]`;
  if (/^[A-Za-z_$][\w$]*$/.test(key)) return `${holder.path}.${key}`;
  return `${holder.path}[${asQuotedLiteral({ of: key })}]`;
};

/**
 * .what = the path to a map value, from the map's path, in js accessor notation
 * .note = `.get('sms')` for a string, number, or boolean key; else the entry's position,
 *         `[...value.byKey.values()][0]`, since an object key has no literal to name it
 */
const asPathToMapValue = (input: {
  map: { path: string };
  key: unknown;
  position: number;
}): string => {
  const { map, key, position } = input;
  if (typeof key === 'string')
    return `${map.path}.get(${asQuotedLiteral({ of: key })})`;
  if (typeof key === 'number' || typeof key === 'boolean')
    return `${map.path}.get(${String(key)})`;
  return `[...${map.path}.values()][${position}]`;
};

/**
 * .what = every object reachable from a value, each once, in visit order, with the path that
 *         first reached it
 * .why = a pure read of the graph, so every refusal is found before any freeze happens, and each
 *        refusal can name where in the value it sits
 * .note = walks own data values (non-enumerable ones too), map keys and values, and set members;
 *         never a function's `prototype`; a typed array's elements
 *         are numbers, so its interior is not walked. a weak collection can not be enumerated,
 *         so its entries are not walked either
 * .note = a shared sub-object is named by the first path that reached it
 * .note = a general graph walk, private while this is its one caller; lift it to `src/` when a
 *         second caller (a deep equal, a deep clone) appears
 */
const getAllReachableObjects = (input: {
  from: unknown;
}): { object: object; path: string }[] => {
  const reached = new Map<object, string>();

  /**
   * .what = records one value at its path, then descends into what it holds
   * .why = one recursion for every shape; the `reached` check ends a cycle and dedupes a shared
   *        sub-object
   */
  const visit = (step: { value: unknown; path: string }): void => {
    // skip a primitive, and a value already reached by another path
    const { value, path } = step;
    if (value === null) return;
    if (typeof value !== 'object' && typeof value !== 'function') return;
    if (reached.has(value)) return;
    reached.set(value, path);

    // descend into entries, members, and own data values
    if (ArrayBuffer.isView(value)) return;
    if (value instanceof Map)
      [...value].forEach(([key, entry], position) => {
        visit({ value: key, path: `[...${path}.keys()][${position}]` });
        visit({
          value: entry,
          path: asPathToMapValue({ map: { path }, key, position }),
        });
      });
    if (value instanceof Set)
      [...value].forEach((member, position) =>
        visit({ value: member, path: `[...${path}][${position}]` }),
      );
    for (const own of getAllOwnDataEntries({ of: value }))
      visit({
        value: own.value,
        path: asPathToOwnProperty({ holder: { path, value }, key: own.key }),
      });
  };

  visit({ value: input.from, path: 'value' });
  return [...reached].map(([object, path]) => ({ object, path }));
};

/**
 * .what = refuses a typed array with elements; else null
 * .why = `Object.freeze` throws on a non-empty typed array, since its index slots can not be sealed
 * .note = a `DataView` has no index slots, so it freezes fine; its setters are refused instead
 */
const getOneRefusalOfTypedArray = (input: {
  value: object;
  path: string;
}): Error | null => {
  const { value, path } = input;
  if (!ArrayBuffer.isView(value)) return null;
  if (value instanceof DataView) return null;
  if (value.byteLength === 0) return null;
  return new ConstraintError(
    'asFrozenDeep can not freeze a typed array with elements',
    {
      path,
      kind: value.constructor.name,
      byteLength: value.byteLength,
      hint: 'convert it to a plain array first, e.g. Array.from(bytes)',
    },
  );
};

/**
 * .what = refuses a global or sticky `RegExp`; else null
 * .why = each `.exec()` / `.test()` on one writes `lastIndex`, so once frozen, a plain read throws
 */
const getOneRefusalOfRegExpWithLastIndex = (input: {
  value: object;
  path: string;
}): Error | null => {
  const { value, path } = input;
  if (!(value instanceof RegExp)) return null;
  if (!value.global && !value.sticky) return null;
  return new ConstraintError(
    'asFrozenDeep can not freeze a global or sticky RegExp, since each exec writes its lastIndex',
    {
      path,
      kind: 'RegExp',
      flags: value.flags,
      hint: "copy it without the g and y flags first: new RegExp(re.source, re.flags.replace(/[gy]/g, ''))",
    },
  );
};

/**
 * .what = a class name with its indefinite article, `a Map` or `an ArrayBuffer`
 * .why = a refusal names the kind in prose; `a ArrayBuffer` reads as a typo
 */
const asKindWithArticle = (input: { kind: string }): string =>
  `${/^[AEIOU]/i.test(input.kind) ? 'an' : 'a'} ${input.kind}`;

/**
 * .what = refuses a slot-mutator kind sealed by a freeze other than `asFrozenDeep`; else null
 * .why = a sealed object takes no new own props, so its mutators can no longer be shadowed
 */
const getOneRefusalOfSealedElsewhere = (input: {
  value: object;
  path: string;
}): Error | null => {
  const { value, path } = input;
  if (getAllMutatorsUnrefused({ value }).length === 0) return null;
  if (Object.isExtensible(value)) return null;
  const kind = getOneKindWithSlotMutators({ value });
  return new ConstraintError(
    `asFrozenDeep can not freeze ${asKindWithArticle({ kind: value.constructor.name })} already sealed via Object.freeze, Object.seal, or Object.preventExtensions`,
    {
      path,
      kind: value.constructor.name,
      hint: `pass it to asFrozenDeep before any other freeze, or copy it first: ${kind?.copy}`,
    },
  );
};

/**
 * .what = refuses a slot-mutator kind with a mutator pinned as an own non-configurable prop; else null
 * .why = `Object.defineProperty` can not replace it, so the shadow would throw mid-freeze
 */
const getOneRefusalOfMutatorPinned = (input: {
  value: object;
  path: string;
}): Error | null => {
  const { value, path } = input;
  const pinned = getAllMutatorsUnrefused({ value }).find(
    (mutator) =>
      Reflect.getOwnPropertyDescriptor(value, mutator)?.configurable === false,
  );
  if (!pinned) return null;
  const kind = getOneKindWithSlotMutators({ value });
  return new ConstraintError(
    `asFrozenDeep can not freeze ${asKindWithArticle({ kind: value.constructor.name })} whose mutator is pinned as an own non-configurable property`,
    {
      path,
      kind: value.constructor.name,
      mutator: pinned,
      hint: `copy it first, which carries no own props: ${kind?.copy}`,
    },
  );
};

/**
 * .what = every check a single object must clear before `asFrozenDeep` freezes it
 * .why = one list, so a new refusal lands as one new entry
 */
const freezeRefusalChecks = [
  getOneRefusalOfTypedArray,
  getOneRefusalOfRegExpWithLastIndex,
  getOneRefusalOfSealedElsewhere,
  getOneRefusalOfMutatorPinned,
];

/**
 * .what = the first refusal any object of a graph earns, which names the object's path; else null
 * .why = lets the walk refuse the whole graph before it touches any of it
 */
const getOneFreezeRefusalOfGraph = (input: {
  reached: { object: object; path: string }[];
}): Error | null =>
  input.reached
    .flatMap((each) =>
      freezeRefusalChecks.map((check) =>
        check({ value: each.object, path: each.path }),
      ),
    )
    .find(isPresent) ?? null;

/**
 * .what = shadows each named mutator with an own method that throws, then marks the value
 * .why = the only way to refuse `map.set()` or `date.setFullYear()` at runtime and keep the same
 *        instance — a `Proxy` or a copy would break identity and `instanceof`
 * .note = the shadows and the mark are non-enumerable, so `Object.keys` and json do not see them
 */
const setMutatorsRefused = (input: {
  value: object;
  mutators: string[];
}): void => {
  // shadow each mutator with a method that names the fix
  const kind = input.value.constructor.name;
  const copy = getOneKindWithSlotMutators({ value: input.value })?.copy;
  for (const mutator of input.mutators)
    Object.defineProperty(input.value, mutator, {
      value: () => {
        throw new ConstraintError(`a frozen ${kind} refuses .${mutator}()`, {
          kind,
          mutator,
          hint: `copy it first, then mutate the copy: ${copy}`,
        });
      },
      enumerable: false,
      writable: false,
      configurable: false,
    });

  // mark it, so a later call — from this copy of the package or another — skips it
  Object.defineProperty(input.value, mutatorsRefusedMark, {
    value: true,
    enumerable: false,
    writable: false,
    configurable: false,
  });
};

/**
 * .what = freezes one object; a slot-mutator kind also has its mutators refused, once
 * .why = the single place this module writes to a caller's value
 */
const setFrozen = (input: { value: object }): void => {
  // refuse a slot-mutator kind's mutators, unless a prior call already did
  const mutators = getAllMutatorsUnrefused({ value: input.value });
  if (mutators.length > 0) setMutatorsRefused({ value: input.value, mutators });

  // freeze the object itself; a no-op if already frozen
  Object.freeze(input.value);
};

/**
 * .what = a companion to the `FrozenDeep` type; freezes a value deep, in place, and returns it
 *         typed as `FrozenDeep<T>`
 * .why = the type announces "readonly all the way down"; this enforces it at runtime, so a write
 *        the type refuses also throws, and the two cannot drift apart
 *
 * .note = in place, deliberately. it returns the same reference (`asFrozenDeep(x) === x`), since a
 *         copy would break identity for every holder of the original, and would leave that
 *         original writable
 * .note = all or none. the whole graph is checked before any of it is frozen, so a refusal leaves
 *         the value untouched
 * .note = idempotent. a second call on a value it froze returns the same reference, no throw — even
 *         from a second loaded copy of this package, via a `Symbol.for` mark on each value
 * .note = a built-in whose mutators write an internal slot — `Map`, `Set`, `WeakMap`, `WeakSet`,
 *         `Date`, `DataView`, `RegExp` (`compile`), `ArrayBuffer` (`resize`, `transfer`) — has each
 *         mutator refused at runtime with a `ConstraintError` that names the fix, which a bare
 *         `Object.freeze` does not. its reads are untouched
 * .note = a write onto a frozen object, array, or function prop throws the engine's own
 *         `TypeError` in strict mode (every es module) and is ignored in sloppy mode, per
 *         `Object.freeze`. to change a value, copy it and change the copy:
 *         `{ ...frozen, page: { ...frozen.page, limit: 50 } }`, `[...frozen.tags, 'push']`
 * .note = a primitive, branded or plain, is returned as-is
 * .note = it reaches non-enumerable own props too, so `new Error('x', { cause })` freezes `cause`.
 *         it never enters a function's `prototype`, which every instance of a class shares
 * .note = it throws a `ConstraintError` on what it can not freeze: a typed array with elements, a
 *         global or sticky `RegExp` (its reads write `lastIndex`), a slot-mutator built-in already
 *         sealed by another freeze, and one with a mutator pinned as an own non-configurable prop.
 *         each names the fix, and the `path` in the value where the refused object sits
 *         (`value.page.bytes`, `value.byKey.get('sms')`)
 * .note = it freezes every holder's view of a shared sub-object, since it freezes in place: an
 *         object the caller shares with another holder is frozen for that holder too
 * .bound = what it does not stop:
 *   - the bytes of an `ArrayBuffer`, or of a `DataView`'s buffer, stay writable through any view
 *     built on that buffer; a freeze locks the object, never its memory
 *   - a class instance's `#private` fields stay writable through its own methods; a private field
 *     is no property, so `Object.freeze` can not reach it
 *   - a value a getter returns is not frozen, though the type calls it frozen deep; the walk never
 *     invokes an accessor, so it runs no caller code
 *   - a refused mutator still runs when reached through its prototype, as in
 *     `Map.prototype.set.call(frozen, k, v)` or `Reflect.apply`; the shadow is an own prop, and a
 *     `Proxy` that would close it breaks identity and `instanceof` (F12)
 *
 * example:
 * ```ts
 * const event = asFrozenDeep({ page: { limit: 10 }, tags: ['sms'] });
 * event.page.limit = 50;   // ⛔ tsc refuses; at runtime, a TypeError
 * event.tags.push('push'); // ⛔ tsc refuses; at runtime, a TypeError
 * const next = { ...event, page: { ...event.page, limit: 50 } }; // ✅ a copy is writable
 * ```
 */
export const asFrozenDeep = <T>(value: T): FrozenDeep<T> => {
  // find every object the value reaches, with its path
  const reached = getAllReachableObjects({ from: value });

  // refuse the whole graph if any object can not be frozen
  const refusal = getOneFreezeRefusalOfGraph({ reached });
  if (refusal) throw refusal;

  // freeze every object
  for (const each of reached) setFrozen({ value: each.object });

  /**
   * .why the cast = `FrozenDeep<T>` is a conditional type, so on an unresolved generic typescript
   *        defers it and cannot prove `T` satisfies it — a limit of the checker, never a gap in the
   *        claim. the walk above is the proof, and it runs first
   * .removal = drops if typescript ever proves a conditional type against its own input
   */
  return value as FrozenDeep<T>;
};
