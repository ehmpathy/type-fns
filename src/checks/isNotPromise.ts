export type NotPromise<T> = T extends Promise<any> ? never : T;

/**
 * checks whether the value is a promise
 */
export const isNotPromise = <T = any>(obj: any): obj is NotPromise<T> =>
  Promise.resolve(obj) === obj;
