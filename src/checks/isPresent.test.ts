import { isPresent } from './isPresent';

describe('isPresent', () => {
  it('should return false if is null', () => {
    expect(isPresent(null)).toEqual(false);
  });
  it('should return false if is undefined', () => {
    expect(isPresent(null)).toEqual(false);
  });
  it('should return true if is falsy', () => {
    expect(isPresent(false)).toEqual(true);
    expect(isPresent(0)).toEqual(true);
    expect(isPresent('')).toEqual(true);
  });
  it('should be useful in having correct types after filtering', () => {
    const stringsOrNulls = ['hello', '', null, 'world', undefined]; // type = `(string | null | undefined)[]`
    const strings = stringsOrNulls.filter(isPresent); // type = string[]

    // check that it did what we expected in runtime
    expect(strings).toEqual(['hello', '', 'world']);

    // check that it successfully informed typescript of this too
    strings.map((string) => string.toUpperCase()); // This should not throw a type error, because the filter should have told typescript it took out the nulls
  });
});
