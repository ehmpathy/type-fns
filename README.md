# simple-type-guards

![ci_on_commit](https://github.com/uladkasach/simple-type-guards/workflows/ci_on_commit/badge.svg)
![deploy_on_tag](https://github.com/uladkasach/simple-type-guards/workflows/deploy_on_tag/badge.svg)

A set of type checks, guards, and predicates for simpler, safer, and easier to read code.

> Check your code paths to balance expressibility vs complexity

# Purpose

Simpler, safer, and easier to read code.

Type guards are built from type checks.
- type check: `const isBlue(value: any): value is 'blue' = value === 'blue'`
- type guard: `if (isBlue(color)) throw new Error('should be blue')`

Type guards allow us to check values at runtime - to protect code paths from unwanted values. These are very useful with typescript, as typescript will warn you if you dont protect certain code paths from unconstrained inputs and respect the type checking that type guards conduct.

Type guards allow us to
  - make code easier to read and write by using natural human language
  - make code safer by using type guards to catch more unexpected states and invalid input at runtime faster
  - make code simpler by limiting code paths based on runtime values
  - make it easier to work with typescript, by making it easy to satisfy its concerns instead of forcing it to be quiet

The goal of this library is to define a reusable set of type checks that will add value in the most cases - without adding bloat.

_For more information about typescripts type predicates and type guards, [see this section in the typescript docs on "narrowing"](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)_

# Install

```sh
npm install --save simple-type-guards
```

# Examples

### `isPresent`

The type predicate of `isPresent` any informs typescript that if a value passes this type check, the value is _not_ `null` or `undefined`:

This is most useful for filtering, to inform typescript that we have removed all `null` or `undefined` values from an array. For example:
```ts
import { isPresent } from 'simple-type-guards';

// you have an array that contains strings or nulls
const stringsOrNulls = ['success:1', 'success:2', null, 'success:3', null]; // type = `(string | null)[]`

// now you want to get rid of all the nulls and only think about the strings: use `isPresent`
const strings = stringsOrNulls.filter(isPresent); // type = string[]

// the type predicate on the `isPresent` function informs typescript that all of the nulls and undefineds have been removed
strings.map((string) => string.toUpperCase()); // now you can operate on the strings without typescript complaining!
```

### `isOfEnum`

This library exposes a function that lets you create type check functions for any enum. For example:
```ts
import { createIsOfEnum } from 'simple-type-guards';

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

# Features

The following type checks are supported. Please see their definition and tests for more details

- `isPresent`
- `isOfEnum`
- `hasUuid`
- `hasId`
