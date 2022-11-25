/**
 * narrows the type to remove undefined
 *
 * ref
 * - https://stackoverflow.com/a/63045455/3068233
 */
export type NotNull<T> = T extends null ? never : T;

/**
 * checks whether the value is not undefined
 */
export const isNotNull = <T>(val: T): val is NotNull<T> => val !== null;
