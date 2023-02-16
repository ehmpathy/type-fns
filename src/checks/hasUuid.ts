/**
 * asserts that an object has a uuid
 */
export type HasUuid<T> = T & { uuid: string };

/**
 * checks whether not an object that may have a uuid does have the uuid, at runtime
 */
export const hasUuid = <T extends { uuid?: undefined | string }>(
  obj: T,
): obj is HasUuid<T> => {
  return typeof obj.uuid === 'string';
};
