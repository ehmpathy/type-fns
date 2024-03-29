/**
 * a generic fn that allows us to create type checks for enums. for example:
 * ```ts
 *   // you have an enum
 *   enum Planet {
 *     ...
 *     VENUS = 'VENUS',
 *     EARTH = 'EARTH',
 *     MARS = 'MARS',
 *     ...
 *   }
 *
 *   // define a type check for your enum
 *   const isPlanet = createIsOfEnum(Planet);
 *
 *   // use your new type check for a type guard
 *   if (!isPlanet(potentialPlanet)) throw new Error('is not a planet');
 * ```
 *
 * ref: https://stackoverflow.com/a/58278753/3068233
 */
export const createIsOfEnum =
  <T extends { [index: string | number | symbol]: string | number }>(e: T) =>
  (token: string | number | symbol): token is T[keyof T] =>
    Object.values(e).includes(token as T[keyof T]);
