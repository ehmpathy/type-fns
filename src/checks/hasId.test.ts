import { hasId } from './hasId';

describe('hasId', () => {
  it('should return true if an object has an id', () => {
    const obj: { id?: number; name: string } = { id: 821, name: 'bob' };
    const itHasId = hasId(obj);
    expect(itHasId).toEqual(true);
  });
  it('should return false if an object does not have an id', () => {
    const obj: { id?: number; name: string } = { name: 'bob' };
    const itHasId = hasId(obj);
    expect(itHasId).toEqual(false);
  });
});
