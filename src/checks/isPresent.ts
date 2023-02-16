/**
 * checks whether the value is defined and is not null
 *
 * https://github.com/microsoft/TypeScript/issues/16069#issuecomment-566222173
 */
export const isPresent = <T>(t: T | undefined | null | void): t is T =>
  t !== undefined && t !== null;
