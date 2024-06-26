/**
 * a companion to the `Omit` type, returns a new object without the omitted attributes
 */
export const omit = <
  T extends Record<string, any>,
  K extends readonly (keyof T)[],
>(
  obj: T,
  keys: K,
): Omit<T, K[number]> =>
  Object.entries(obj).reduce((summary, [key, value]) => {
    // if key is in the specified keys, dont add it to the new object
    if (keys.includes(key)) return summary;

    // if it is not within specified keys, add it
    return { ...summary, [key]: value };
  }, {} as Record<string, any>) as any;
