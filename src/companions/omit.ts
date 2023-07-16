/**
 * a companion to the `Omit` type, returns a new object without the omitted attributes
 */
export const omit = <T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[],
): Omit<T, typeof keys[number]> =>
  Object.entries(obj).reduce((summary, [key, value]) => {
    // if key is in the specified keys, dont add it to the new object
    if (keys.includes(key)) return summary;

    // if it is not within specified keys, add it
    return { ...summary, [key]: value };
  }, {} as Record<string, any>) as any;
