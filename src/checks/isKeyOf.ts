export const isKeyOf = <T extends Record<string, any>>(
  obj: T,
  key: PropertyKey,
): key is keyof T => {
  return key in obj;
};
