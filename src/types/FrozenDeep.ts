/**
 * .what = readonly all the way down, with every primitive left exactly as it is
 * .why = typescript's `Readonly<T>` is one level deep, so `frozen.a.b = 1` compiles while a deep
 *        runtime freeze throws on it. this type refuses the write at every depth, to match
 *        `asFrozenDeep`, which enforces what this type announces
 *
 * .the family = `FrozenDeep<T>` maps any shape to its frozen form:
 *   - primitive, branded or plain -> itself. a primitive has no interior to freeze; a branded
 *     primitive (`string & { _brand }`) stays assignable back to its brand
 *   - function                    -> its call signature, with its own props readonly
 *   - `Map<K, V>`                 -> `FrozenMap<K, V>`
 *   - `Set<T>`                    -> `FrozenSet<T>`
 *   - array or tuple              -> a readonly array or readonly tuple; a tuple keeps its arity,
 *                                    labels, and positions
 *   - object                      -> every property readonly, every value frozen deep
 *
 * .note = there is no `FrozenArray`. an array freezes to `readonly T[]` and a tuple to a readonly
 *         tuple, so one name could not cover both without the loss of a tuple's shape
 *
 * .bound = what this type does not refuse:
 *   - a hand-off to a mutable OBJECT parameter compiles. typescript ignores `readonly` in
 *     structural assignability, so `{ readonly a: 1 }` is assignable to `{ a: 1 }`. a mutable
 *     ARRAY parameter is refused, since `ReadonlyArray` lacks the mutator methods
 *   - a write through `any` compiles. `any` opts out of every check
 *   - `Array.isArray(frozen)` narrows to `any[]`, which hands `.push` back. prefer a `typeof` or
 *     a shape check on a frozen value
 *   - a `Date`, `DataView`, `WeakMap`, `WeakSet`, `RegExp`, or `ArrayBuffer` keeps the object arm,
 *     so its mutator methods (`setFullYear`, `setInt8`, `set`, `add`, `compile`, `resize`) still
 *     type-check — the object arm guards props, not methods, and a frozen `Date` stays assignable
 *     back to `Date`. `asFrozenDeep` refuses each of those calls at runtime with a `ConstraintError`
 *   - a class instance's methods still type-check, so a method that writes a `#private` field
 *     compiles; no freeze reaches a private field
 *   - a getter's value is typed frozen deep, yet `asFrozenDeep` never invokes a getter, so the
 *     object it returns stays writable at runtime
 */
export type FrozenDeep<T> = T extends
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  ? T
  : T extends (...args: never[]) => unknown
    ? FrozenFunction<T>
    : T extends ReadonlyMap<infer TKey, infer TValue>
      ? FrozenMap<TKey, TValue>
      : T extends ReadonlySet<infer TItem>
        ? FrozenSet<TItem>
        : T extends object
          ? { readonly [TKey in keyof T]: FrozenDeep<T[TKey]> }
          : T;

/**
 * .what = a map whose mutators are absent and whose keys and values are frozen deep
 * .why = `ReadonlyMap<K, V>` alone refuses `.set` yet leaves each value writable; this freezes both
 */
export type FrozenMap<TKey, TValue> = ReadonlyMap<
  FrozenDeep<TKey>,
  FrozenDeep<TValue>
>;

/**
 * .what = a set whose mutators are absent and whose members are frozen deep
 * .why = `ReadonlySet<T>` alone refuses `.add` yet leaves each member writable; this freezes both
 */
export type FrozenSet<TItem> = ReadonlySet<FrozenDeep<TItem>>;

/**
 * .what = a function with its call signature kept and its own props readonly
 * .why = a function is an object too, and the runtime freeze refuses a write onto its props
 * .note = a function with no own props passes through whole, so its generics and overloads survive.
 *         a function WITH own props is rebuilt from `Parameters` / `ReturnType`, since an
 *         intersection with `T` would keep each prop writable (a prop is readonly in an
 *         intersection only where every member marks it so). the rebuild keeps one call
 *         signature, so a generic or overloaded function with own props narrows to its last one
 */
type FrozenFunction<T extends (...args: never[]) => unknown> = [
  keyof T,
] extends [never]
  ? T
  : ((...args: Parameters<T>) => ReturnType<T>) & {
      readonly [TKey in keyof T]: FrozenDeep<T[TKey]>;
    };
