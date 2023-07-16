/**
 * a companion to the `Pick` type, returns a new object with only the picked attributes
 */
export const pick = <T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[],
): Pick<T, typeof keys[number]> =>
  Object.entries(obj).reduce((summary, [key, value]) => {
    // if key is not in the specified keys, dont add it to the new object
    if (!keys.includes(key)) return summary;

    // if it is within specified keys, add it
    return { ...summary, [key]: value };
  }, {} as Record<string, any>) as any;
