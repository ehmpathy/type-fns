import { getError, given, then, when } from 'test-fns';

import { isPresent } from './isPresent';

describe('isPresent', () => {
  given('direct calls should assess by default', () => {
    when('called directly', () => {
      then('it should return true if is some number, for example', () => {
        const input: number | null = 21;

        expect(isPresent(input)).toEqual(true);

        if (!isPresent(input)) {
          const shouldBeNever: never = input;
        }
      });
      then('it should return false if is null', () => {
        const input: number | null = null;

        expect(isPresent(input)).toEqual(false);

        if (isPresent(input)) {
          const shouldBeNever: never = input;
        }
      });
      then('it should return false if is undefined', () => {
        const input: number | undefined = undefined;

        expect(isPresent(input)).toEqual(false);

        if (isPresent(input)) {
          const shouldBeNever: never = input;
        }
      });
      then('it should return true if is falsy', () => {
        expect(isPresent(false)).toEqual(true);
        expect(isPresent(0)).toEqual(true);
        expect(isPresent('')).toEqual(true);
      });
      then(
        'it should be useful in having correct types after filtering',
        () => {
          const stringsOrNulls = ['hello', '', null, 'world', undefined]; // type = `(string | null | undefined)[]`
          const strings = stringsOrNulls.filter(isPresent); // type = string[]

          // check that it did what we expected in runtime
          expect(strings).toEqual(['hello', '', 'world']);

          // check that it successfully informed typescript of this too
          strings.map((string) => string.toUpperCase()); // This should not throw a type error, because the filter should have told typescript it took out the nulls
        },
      );
    });
  });

  given('it has an assess', () => {
    when('.assess is called', () => {
      then('it should assess correctly', () => {
        expect(isPresent.assess(21)).toEqual(true);
        expect(isPresent.assess(null)).toEqual(false);
        expect(isPresent.assess(undefined)).toEqual(false);
      });
    });
  });

  given('it has an assure', () => {
    when('.assure is called', () => {
      then('it should assure correctly, for a number, for example', () => {
        const input: number | undefined | null = 21 as any;

        const shouldWork: number = isPresent.assure(input);

        // @ts-expect-error
        const shouldFail: number = input;
      });
      then('it should assure correctly, for null', () => {
        const input: number | undefined | null = null as any;

        const error = getError(() => {
          const shouldWork: number = isPresent.assure(input);
        });
        expect(error.message).toContain(
          `assure.rejection: input does not satisfy type.check 'isPresent'`,
        );
      });
      then('it should assure correctly, for undefined', () => {
        const input: number | undefined | null = undefined as any;

        const error = getError(() => {
          const shouldWork: number = isPresent.assure(input);
        });
        expect(error.message).toContain(
          `assure.rejection: input does not satisfy type.check 'isPresent'`,
        );
      });
    });
  });
});
