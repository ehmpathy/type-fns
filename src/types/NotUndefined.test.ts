/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotUndefined } from './NotUndefined';

describe('NotUndefined', () => {
  it('should constrain type correctly', async () => {
    type MaybeNumber = number | undefined;

    const maybeNumber: MaybeNumber = undefined; // valid

    // const number: NotUndefined<MaybeNumber> = undefined; // invalid
  });
});
