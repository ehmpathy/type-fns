// eslint-disable-next-line @typescript-eslint/ban-types
export const isAFunction = (obj: any): obj is Function =>
  typeof obj === 'function';
