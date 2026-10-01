/**
 * .what = the names of every `set*` method on a prototype
 * .why = `Date` and `DataView` each hold a closed family of setters; to read them from the
 *        prototype keeps the list exact for the runtime at hand (e.g. `setFloat16` where present)
 */
const getAllSettersOf = (input: { prototype: object }): string[] =>
  Object.getOwnPropertyNames(input.prototype).filter((name) =>
    name.startsWith('set'),
  );

/**
 * .what = the built-ins whose mutators write an internal slot, which `Object.freeze` can not stop
 * .why = `map.set()`, `date.setFullYear()`, `view.setInt8()` each change a frozen object in
 *        silence; each owes its mutators shadowed with throwers, and a copy recipe for the hint
 * .note = a file of its own so the doc-drift clamp can read the list, not restate it; the package
 *         root does not export it
 */
export const kindsWithSlotMutators = [
  { of: Map, mutators: ['set', 'delete', 'clear'], copy: 'new Map(frozen)' },
  { of: Set, mutators: ['add', 'delete', 'clear'], copy: 'new Set(frozen)' },
  {
    of: WeakMap,
    mutators: ['set', 'delete'],
    copy: 'a new WeakMap, refilled from the keys you hold',
  },
  {
    of: WeakSet,
    mutators: ['add', 'delete'],
    copy: 'a new WeakSet, refilled from the members you hold',
  },
  {
    of: Date,
    mutators: getAllSettersOf({ prototype: Date.prototype }),
    copy: 'new Date(frozen)',
  },
  {
    of: DataView,
    mutators: getAllSettersOf({ prototype: DataView.prototype }),
    copy: 'new DataView(frozen.buffer.slice(0))',
  },
  {
    of: RegExp,
    mutators: ['compile'],
    copy: 'new RegExp(frozen)',
  },
  {
    of: ArrayBuffer,
    mutators: ['resize', 'transfer', 'transferToFixedLength'].filter(
      (name) => name in ArrayBuffer.prototype,
    ),
    copy: 'frozen.slice(0)',
  },
];
