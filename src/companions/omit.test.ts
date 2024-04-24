import { omit } from './omit';

describe('omit', () => {
  it('should satisfy the standard Omit type', () => {
    const withKey = { a: 1, b: 2 };

    const omitKeyTypeFound = omit(withKey, ['a']);
    const omitKeyTypeCheck: Omit<typeof withKey, 'a'> = omitKeyTypeFound;
  });
});
