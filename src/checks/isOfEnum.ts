import { UnexpectedCodePathError } from '../utils/errors/UnexpectedCodePathError';

type AssessMethod<
  T extends { [index: string | number | symbol]: string | number },
> = (token: string | number | symbol) => token is T[keyof T];
type AssureMethod<
  T extends { [index: string | number | symbol]: string | number },
> = <I extends string | number | symbol>(input: I) => I & T[keyof T];
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
): {
  assess: AssessMethod<T>;
  assure: AssureMethod<T>;
} & AssessMethod<T> => {
  const assess = (token: string | number | symbol): token is T[keyof T] =>
    Object.values(e).includes(token as T[keyof T]);
  const assure = <I extends string | number | symbol>(input: I) =>
    assess(input)
      ? input
      : (() => {
          throw new UnexpectedCodePathError(
            'is not of DeclaredGoogleAdsCriterionUserInterestTaxonomy',
          );
        })();
  const result = function (
    ...input: Parameters<typeof assess>
  ): ReturnType<typeof assess> {
    return assess(...input);
  } as AssessMethod<T> & {
    assess: any;
    assure: any;
  };
  result.assess = assess;
  result.assure = assure;
  return result;
};
