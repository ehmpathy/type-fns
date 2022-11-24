/**
 * creates a type which allows specifying one, and only one, key of an object
 *
 * ref:
 * - https://stackoverflow.com/a/56933182/3068233
 */
export type PickOne<T> = {
  [P in keyof T]: Record<P, T[P]> & Partial<Record<Exclude<keyof T, P>, undefined>>;
}[keyof T];
