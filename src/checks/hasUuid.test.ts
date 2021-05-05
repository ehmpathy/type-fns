import { hasUuid } from './hasUuid';

describe('hasUuid', () => {
  it('should return true if an object has an id', () => {
    const obj: { uuid?: string; name: string } = { uuid: 'uuid', name: 'bob' };
    const itHasUuid = hasUuid(obj);
    expect(itHasUuid).toEqual(true);
  });
  it('should return false if an object does not have an id', () => {
    const obj: { uuid?: string; name: string } = { name: 'bob' };
    const itHasUuid = hasUuid(obj);
    expect(itHasUuid).toEqual(false);
  });
});
