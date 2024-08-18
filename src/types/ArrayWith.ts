/**
 * ref:
 * - https://stackoverflow.com/a/67655609/3068233
 * - https://stackoverflow.com/a/73409753/3068233
 */
type BuildArrayWith<
  TCheck extends 'len' | 'min', // todo: support 'max' too?
  TLength extends number,
  TType,
  TCurrent extends TType[],
> = TCurrent['length'] extends TLength
  ? TCheck extends 'len'
    ? [...TCurrent]
    : [...TCurrent, ...TType[]]
  : BuildArrayWith<TCheck, TLength, TType, [...TCurrent, TType]>;

/**
 * declares a type of array with a check on its length
 */
type ArrayWith<
  TCheck extends 'len' | 'min', // todo: support 'max' too?
  TLength extends number,
  TType,
> = BuildArrayWith<TCheck, TLength, TType, []>;
