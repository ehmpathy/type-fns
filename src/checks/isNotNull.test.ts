/* eslint-disable @typescript-eslint/no-unused-vars */
import { isNotNull, NotNull } from '..';

describe('isNotNull', () => {
  it('should constrain type correctly', async () => {
    type MaybeNumber = number | null;

    const maybeNumber: MaybeNumber = undefined as any; // valid

    if (isNotNull(maybeNumber)) {
      const defNumber: number = maybeNumber; // valid
    }
  });
});

describe('NotNull', () => {
  it('should constrain type correctly', async () => {
    type MaybeNumber = number | null;

    const notMaybeNumber: NotNull<MaybeNumber> = 821 as any;
    const onlyNumber: number = notMaybeNumber; // valid
  });
});
