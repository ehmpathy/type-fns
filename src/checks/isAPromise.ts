/**
 * checks whether the value is a promise
 */
export const isAPromise = <T = any>(obj: any): obj is Promise<T> =>
  Promise.resolve(obj) === obj;
