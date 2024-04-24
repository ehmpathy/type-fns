import { pick } from './pick';

describe('pick', () => {
  it('should satisfy the standard Pick type', () => {
    const withAll = { a: 1, b: 2 };

    const pickKeyTypeFound = pick(withAll, ['a']);
    const pickKeyTypeCheck: Pick<typeof withAll, 'a'> = pickKeyTypeFound;
  });
});
