/**
 * narrows the type to remove undefined
 *
 * ref
 * - https://stackoverflow.com/a/63045455/3068233
 */
export type NotUndefined<T> = T extends undefined ? never : T;

/**
 * checks whether the value is not undefined
 */
export const isNotUndefined = <T>(val: T): val is NotUndefined<T> =>
  typeof val !== 'undefined';
