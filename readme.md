# type-fns

![test](https://github.com/ehmpathy/type-fns/workflows/test/badge.svg)
![publish](https://github.com/ehmpathy/type-fns/workflows/publish/badge.svg)

Narrow your codepaths with generic types, type checks, and type guards for simpler, safer, and easier to read code.

# Purpose

Narrow your codepaths for simpler, safer, and easier to read code.
- simplify your code paths with type narrowing using type checks (e.g., `isPresent`, `isAPromise`, `isAFunction`, `isOfEnum`, etc)
- declare your types more readably with powerful extended types (e.g., `PickOne`, `HasMetadata`, etc)

This library is a collection of generic types, type guards, and type checks we've found the need to define over and over again across different domains, collected in one spot for reusability.



# Background

Type guards are built from type checks, built on a type predicate.
- type predicate: `value is 'blue'`
- type check: `const isBlue(value: any): value is 'blue' = value === 'blue'`
- type guard: `if (isBlue(color)) throw new Error('should be blue')`

Type guards allow us to to inform typescript we've checked the type of a variable at runtime, enabling type narrowing.

_For more information about typescripts type guards, type checks, and type predicates, [see this section in the typescript docs on "narrowing"](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)_


# Install

```sh
npm install --save type-fns
```

# Examples

## generic types

### `PickOne`

The generic type `PickOne` allows you to specify that only one of the keys in the object can be defined, the others must be undefined.

This is very useful when working with an interface where you have exclusive settings. For example:
```ts
import { PickOne } from 'type-fns';

const findWrench = async ({
  size,
}: {
  /**
   * specify the size of the wrench in either `imperial` or `metric` units
   *
   * note
   * - we "PickOne" because this is an exclusive option, a size cant be defined in both
   */
  size: PickOne<{
    metric: {
      millimeters: number,
    }
    imperial: {
      inches: string,
    }
  }>
}) => {
  // ...
}

// you can find by metric
await findWrench({
  size: {
    metric: { millimeters: 16 }
  }
})

// you can find by imperial
await findWrench({
  size: {
    imperial: { inches: '5/16' }
  }
})

// you can't find by both
await findWrench({
  size: {
    metric: { millimeters: 16 } , // 🛑 typescript error: `Type '{ millimeters: number; }' is not assignable to type 'undefined'.ts(2322)`
    imperial: { inches: '5/16' }
  }
})
```

### `DropFirst`

The generic type `DropFirst` lets you exclude the first element of an array.

```ts
type NumberStringString = [number, string, string];
const numStrStr: NumberStringString = [1, '2', '3'];
const strStr: DropFirst<NumberStringString> = ['1', '2'];
const str: string = strStr[0];
const num: number = numStrStr[0];
```

useful, for example, to change the first parameter of a function while the rest stay the same.

### `FrozenDeep`

the generic type `FrozenDeep` is readonly all the way down, where `Readonly` stops at one level. every primitive, branded primitives included, stays exactly as it is.

```ts
import { FrozenDeep } from 'type-fns';

type IsoTimeStamp = string & { _dglo: 'iso-time.IsoTimeStamp' };
type Event = { at: IsoTimeStamp; page: { limit: number }; tags: string[]; seen: Map<string, number> };

declare const event: FrozenDeep<Event>;
event.page.limit = 50;          // 🛑 readonly at depth two
event.tags.push('push');        // 🛑 a readonly array has no push
event.seen.set('sms', 1);       // 🛑 a FrozenMap has no set
const at: IsoTimeStamp = event.at; // ✅ a branded primitive stays assignable back
```

one bound to know: a frozen object still passes into a parameter typed as a mutable object, since typescript does not check `readonly` on object props at assignment. a frozen array does not pass into a mutable array parameter, so an object with an array field inside is refused there too — the cause is the array, never a brand. declare the parameter `FrozenDeep<T>` to accept it.

maps and sets freeze to `FrozenMap` / `FrozenSet`, also exported. pair it with `asFrozenDeep` to enforce the same at runtime.

## type guards

### `isPresent`

The type predicate of `isPresent` any informs typescript that if a value passes this type check, the value is _not_ `null` or `undefined`:

This is most useful for filtering, to inform typescript that we have removed all `null` or `undefined` values from an array. For example:
```ts
import { isPresent } from 'type-fns';

// you have an array that contains strings or nulls
const stringsOrNulls = ['success:1', 'success:2', null, 'success:3', null]; // type = `(string | null)[]`

// now you want to get rid of all the nulls and only think about the strings: use `isPresent`
const strings = stringsOrNulls.filter(isPresent); // type = string[]

// the type predicate on the `isPresent` function informs typescript that all of the nulls and undefineds have been removed
strings.map((string) => string.toUpperCase()); // now you can operate on the strings without typescript complaining!
```

### `isOfEnum`

The type predicate of `isOfEnum` allows you to check whether a value is a valid member of an enum. For example:
```ts
import { createIsOfEnum } from 'type-fns';

// you have an enum
enum Planet {
  ...
  VENUS = 'VENUS',
  EARTH = 'EARTH',
  MARS = 'MARS',
  ...
}

// define a type check for your enum
const isPlanet = createIsOfEnum(Planet);

// use your new type check for a type guard
if (!isPlanet(potentialPlanet)) throw new Error('is not a planet');
```

### `isAPromise`

The type predicate of `isAPromise` allows you to narrow down the type of any variable that may be a promise

```ts
import { isAPromise } from 'type-fns';

// imagine we didn't know whether soonerOrLater is a promise or a string
const soonerOrLater: Promise<string> | string = Promise.resolve('hello') as any;

// typescript wont let you do things not common between the two types, rightly so
soonerOrLater.toLowerCase(); //  🛑 typescript error: `Property 'toLowerCase' does not exist on type 'string | Promise<string>'.`

// use the type-check to narrow down the the type to operate specifically per type
if (isAPromise(soonerOrLater)) {
  soonerOrLater.then((value) => value.toLowerCase()); // no error since type was narrowed to `Promise<string>`
} else {
  soonerOrLater.toLowerCase();  // no error since type was narrowed to `string`
}
```

### `isAFunction`

The type predicate of `isAFunction` allows you to narrow down the type of any variable that may be a function

This is super helpful when writing apis that can take a literal or a function that creates the literal. For example
```ts
const superCoolApi = async ({
  getConfig
}: {
  getConfig: Config | () => Promise<Config>  // this can be the `Config` object or a function which resolves the `Config` object
}) => {
  const config: Config = isAFunction(getConfig)
    ? await getConfig() // if getConfig is a function, then execut it and await it to grab the config
    : getConfig; // otherwise, it is the config object already
}
```

### `assure`

The `assure` function takes a value and a type check, returns the value narrowed to the checked type if it passes, or throws an error if it doesn't.

This is useful to narrow types inline with runtime validation in a single expression, without needing to wrap your type checks with `withAssure` first.

```ts
import { assure } from 'type-fns';

// define or import a type check
type Uuid = string & { __brand: 'Uuid' };
const isUuid = (value: string): value is Uuid =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

// use assure to narrow and validate in one expression
const uuid: Uuid = assure('821e33d6-a330-425d-a393-f97e39113046', isUuid); // returns the value as Uuid
const bad: Uuid = assure('not-a-uuid', isUuid); // throws AssureIsOfTypeRejectionError

// works great for inline validation
const processUser = (input: { uuid: string }) => {
  const userUuid: Uuid = assure(input.uuid, isUuid); // throws if invalid, narrows type if valid
  // ...
};
```

## companions

### `asFrozenDeep`

the `asFrozenDeep` function freezes a value and every value it reaches, in place, and returns it typed as `FrozenDeep<T>`. a write the type refuses also throws at runtime.

```ts
import { asFrozenDeep } from 'type-fns';

const event = asFrozenDeep({ page: { limit: 10 }, seen: new Map([['sms', 1]]) });
event.page.limit = 50;    // 🛑 typescript error; at runtime, a TypeError
event.seen.set('push', 2); // 🛑 typescript error; at runtime, a ConstraintError (a bare Object.freeze permits it)
```

it returns the same reference, so any other holder of a sub-object sees it frozen too. it reaches non-enumerable props as well, so `new Error('x', { cause })` freezes `cause`, yet never enters a function's `prototype`, which every instance of a class shares. it is safe on cycles and shared sub-objects, and a second call is a no-op. it checks the whole value before it freezes any of it, so a refusal (a typed array with elements, a global or sticky `RegExp`, or a map sealed by a bare `Object.freeze`) leaves the value untouched. each refusal is a `ConstraintError` that names where the refused object sits and how to fix it:

```
✋ ConstraintError: asFrozenDeep can not freeze a typed array with elements

{
  "path": "value.event.records[1].raw",
  "kind": "Uint8Array",
  "byteLength": 1,
  "hint": "convert it to a plain array first, e.g. Array.from(bytes)"
}
```

a bare `Object.freeze` lets a built-in change its internal state through its own methods. `asFrozenDeep` refuses those at runtime: `Map` and `Set` (`set`, `add`, `delete`, `clear`), `WeakMap` and `WeakSet` (`set`, `add`, `delete`), `Date` and `DataView` (every `set*`), `RegExp` (`compile`), and `ArrayBuffer` (`resize`, `transfer`). the type keeps the object arm for all but `Map` and `Set`, so those calls still compile.

what it does not reach: the bytes of an `ArrayBuffer` through a view built on it, a class instance's `#private` fields through its own methods, the value a getter returns (it never invokes a getter), and a refused mutator called through its prototype, as in `Map.prototype.set.call(frozen, k, v)`.

to change a frozen value, copy it and change the copy: `{ ...event, page: { ...event.page, limit: 50 } }`, or `new Map(event.seen)` for a map.
