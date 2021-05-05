/**
 * asserts that an object has an id
 */
export type HasId<T> = T & { id: number };

/**
 * checks whether not an object that may have an id does have the id, at runtime
 */
export const hasId = <T extends { id?: undefined | number }>(obj: T): obj is HasId<T> => {
  return !!obj.id;
};
