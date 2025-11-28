import {
  AssessIsOfTypeMethod,
  AssureIsOfTypeRejectionError,
} from '../wrappers/withAssure';

/**
 * what: a standalone assure function that takes a value and a type.check, returning the value if it passes or throwing if it doesn't
 * why:
 * - enables inline type narrowing with runtime validation in a single expression
 * - useful when you want to assure a value satisfies a type guard without pre-wrapping the guard with `asAssure` or `withAssure`
 *
 * example:
 * ```ts
 * const uuid: Uuid = assure('821e33d6-a330-425d-a393-f97e39113046', isUuid); // passes
 * const uuid: Uuid = assure('not a uuid', isUuid); // throws AssureIsOfTypeRejectionError
 * ```
 */
export const assure = <I, C extends I>(
  input: I,
  check: AssessIsOfTypeMethod<I, C>,
  options?: { name: string },
): C => {
  const name = options?.name ?? check.name;
  if (check(input)) return input;
  throw new AssureIsOfTypeRejectionError(
    `assure.rejection: input does not satisfy type.check '${name}'`,
    {
      check: name,
      input: input === undefined ? 'undefined' : input,
    },
  );
};
