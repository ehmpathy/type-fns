import { isAPromise } from './isAPromise';

describe('isAPromise', () => {
  it('should return true for promises', () => {
    const descision = isAPromise(Promise.resolve('hello'));
    expect(descision).toEqual(true);
  });
  it('should return false for not promises', () => {
    const descision = isAPromise('hello');
    expect(descision).toEqual(false);
  });
  it('should be usable to narrow the typescript type', () => {
    // imagine we didn't know whether soonerOrLater is a promise or a string
    const soonerOrLater: Promise<string> | string = Promise.resolve(
      'hello',
    ) as any;

    // we can use this check to narrow down the typescript type and do operations specific to each type
    if (isAPromise(soonerOrLater)) {
      void soonerOrLater.then(() => 'done');
    } else {
      void soonerOrLater.toLowerCase();
    }
  });
});
