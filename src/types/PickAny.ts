/**
 * creates a type which requires specifying at least one, or more, key of an object
 *
 * ref:
 * - https://stackoverflow.com/a/49725198/3068233
 */
export type PickAny<TObj, TKeys extends keyof TObj = keyof TObj> = Pick<
  TObj,
  Exclude<keyof TObj, TKeys>
> &
  {
    [K in TKeys]-?: Required<Pick<TObj, K>> &
      Partial<Pick<TObj, Exclude<TKeys, K>>>;
  }[TKeys];
