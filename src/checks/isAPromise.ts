/**
 * checks whether the value is a promise
 */
export const isAPromise = <T extends any = any>(obj: any): obj is Promise<T> => Promise.resolve(obj) === obj;
