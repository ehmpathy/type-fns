export type NotPromise<T> = T extends Promise<any> ? never : T;

/**
 * checks whether the value is a promise
 */
export const isNotPromise = <T = any>(obj: unknown): obj is NotPromise<T> =>
  Promise.resolve(obj) === obj;
