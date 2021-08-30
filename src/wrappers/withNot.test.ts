import { hasId } from '../checks/hasId';
import { withNot } from './withNot';

describe('withNot', () => {
  it('should return false if an object has an id after wrapping hasId', () => {
    const obj: { id?: number; name: string } = { id: 821, name: 'bob' };
    const itDoesNotHaveId = withNot(hasId)(obj);
    expect(itDoesNotHaveId).toEqual(false);
  });
  it('should return false if an object does not have an id', () => {
    const obj: { id?: number; name: string } = { name: 'bob' };
    const itDoesNotHaveId = withNot(hasId)(obj);
    expect(itDoesNotHaveId).toEqual(true);
  });
});
