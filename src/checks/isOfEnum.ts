import { AssessWithAssure, withAssure } from '../wrappers/withAssure';

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
 *   const isPlanet = createIsOfEnum.assess(Planet);
 *
 *   // use it to assess type for type guarded blocks
 *   if (!isPlanet.assess(potentialPlanet)) throw new Error('is not a planet');
 *
 *   // use it to assure type for type guarded type casts
 *   const planet: Planet = isPlanet.assure(potentialPlanet)
 * ```
 *
 * ref: https://stackoverflow.com/a/58278753/3068233
 */
export const createIsOfEnum = <
  T extends { [index: string | number | symbol]: string | number },
>(
  e: T,
): AssessWithAssure<string | number | symbol, T[keyof T]> => {
  const check = (token: string | number | symbol): token is T[keyof T] =>
    Object.values(e).includes(token as T[keyof T]);
  return withAssure(check);
};
