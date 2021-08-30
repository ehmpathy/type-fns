/**
 * a wrapper that enables you to easily negate the result of a type check function
 *
 * for example:
 * ```ts
 * const withoutIds = objects.filter(withNot(hasUuid));
 *
 * const invalidOptions = objects.filter(withNot(isOfStatus));
 * ```
 */
export const withNot = <T>(is: (args: T) => boolean): ((args: T) => boolean) => (args: T) => !is(args);
