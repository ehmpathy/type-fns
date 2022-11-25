/* eslint-disable @typescript-eslint/no-unused-vars */
import { isNotUndefined, NotUndefined } from '..';

describe('isNotUndefined', () => {
  it('should constrain type correctly', async () => {
    type MaybeNumber = number | undefined;

    const maybeNumber: MaybeNumber = undefined as any; // valid

    if (isNotUndefined(maybeNumber)) {
      const defNumber: number = maybeNumber; // valid
    }
  });
});

describe('NotUndefined', () => {
  it('should constrain type correctly', async () => {
    type MaybeNumber = number | undefined;

    const notMaybeNumber: NotUndefined<MaybeNumber> = 821 as any;
    const onlyNumber: number = notMaybeNumber; // valid
  });
});
