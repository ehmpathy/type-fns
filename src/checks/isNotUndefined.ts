/**
 * narrows the type to remove undefined
 *
 * ref
 * - https://stackoverflow.com/a/63045455/3068233
 */
export type IsDefined<T> = T extends undefined ? never : T;

/**
 * narrows the type to remove undefined
 *
 * note
 * - alias of IsDefined
 */
export type NotUndefined<T> = IsDefined<T>;

/**
 * checks whether the value is not undefined
 */
export const isDefined = <T>(val: T): val is IsDefined<T> =>
  typeof val !== 'undefined';

/**
 * checks whether the value is not undefined
 *
 * note
 * - alias of isDefined
 */
export const isNotUndefined = <T>(val: T): val is NotUndefined<T> =>
  isDefined(val);
