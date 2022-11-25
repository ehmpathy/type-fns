/**
 * narrows the type to remove undefined
 *
 * ref
 * - https://stackoverflow.com/a/63045455/3068233
 */
export type NotUndefined<T> = T extends undefined ? never : T;
