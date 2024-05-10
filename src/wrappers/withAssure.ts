import { HelpfulError } from '@ehmpathy/error-fns';

export type AssessIsOfTypeMethod<I, C extends I> = (input: I) => input is C;
export type AssureIsOfTypeMethod<I, C extends I> = (input: I) => C;
export interface AssessWithAssure<I, C extends I> {
  (input: I): input is C;
  assess: AssessIsOfTypeMethod<I, C>;
  assure: AssureIsOfTypeMethod<I, C>;
}

export class AssureIsOfTypeRejectionError extends HelpfulError {}

/**
 * what: a wrapper which takes a boolean type.check and converts it into a type.assure
 * what^2:
 * - a type.check uses typescript's type.predicate capacity to narrow a type via boolean (i.e., `input is T`)
 * - a type.assure uses this type.check and throws an error if the result was false, assuring that if a result is returned, it is of the desired type
 * why:
 * - makes it easy to fail fast if expectations are not met
 * - simplifies code by rejecting code paths that should not happen, allowing focus on only the expected code paths, rather than having 'if/then' statements all over the place
 * why^2:
 * - simplicity++ -> readability++ -> speed++ && maintainability++
 */
export const asAssure = <I, C extends I>(
  assess: AssessIsOfTypeMethod<I, C>,
  options?: { name: string },
): AssureIsOfTypeMethod<I, C> => {
  const name = options?.name ?? assess.name; // todo: get resource name more reliably
  const assure = (input: I) =>
    assess(input)
      ? input
      : (() => {
          throw new AssureIsOfTypeRejectionError(
            `assure.rejection: input does not satisfy type.check '${name}'`,
            {
              check: name,
              input: input === undefined ? 'undefined' : input,
            },
          );
        })();
  return assure;
};

/**
 * what: a wrapper which takes a type.check and adds an .assure and .assess to it
 * what^2:
 * - a type.check uses typescript's type.predicate capacity to narrow a type via boolean (i.e., `input is T`)
 * - a type.assure uses this type.check and throws an error if the result was false, assuring that if a result is returned, it is of the desired type
 * - an .assure and .assess can be added to a function, enabling backwards compatible default .assess usage while still exposing explicit .assure and .assess utilities
 * why:
 * - makes it easy to extend type.checks w/ .assure in a backwards compatible way
 * - enables convenient custom utilities to fail fast if expectations are not met
 * why^2:
 * - simplicity++ -> readability++ -> speed++ && maintainability++
 *
 * note
 * - leverages `asAssure` under the hood
 */
export const withAssure = <I, C extends I>(
  assess: AssessIsOfTypeMethod<I, C>,
  options?: { name: string },
): AssessWithAssure<I, C> => {
  const assure = asAssure(assess, options);
  const result = function (
    ...input: Parameters<typeof assess>
  ): ReturnType<typeof assess> {
    return assess(...input);
  } as AssessIsOfTypeMethod<I, C> & {
    assess: any;
    assure: any;
  };
  result.assess = assess;
  result.assure = assure;
  return result;
};
