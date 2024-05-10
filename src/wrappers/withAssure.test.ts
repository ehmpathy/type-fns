import { getError } from 'test-fns';

import { NotNull } from '../checks/isNotNull';
import { asAssure, withAssure } from './withAssure';

describe('asAssure', () => {
  it('should be able to assure for a specific check', () => {
    const isAString = (input: any): input is string =>
      typeof input === 'string';

    const assure = asAssure(isAString);

    const shouldBeString: string = assure('hi');

    const error = getError(() => {
      const shouldThrowBeforeHere: string = assure(7);
    });
    expect(error.message).toContain(
      `input does not satisfy type.check 'isAString'`,
    );
  });
  it('should be able to assure for a generic check', () => {
    const isNotNull = <I>(input: I): input is NotNull<I> => input !== null;
    const assure = asAssure(isNotNull);

    const shouldBeString: string = assure('hi');
    const shouldBeNumber: number = assure(7);

    const error = getError(() => {
      const shouldThrowBeforeHere: never = assure(null);
    });
    expect(error.message).toContain(
      `input does not satisfy type.check 'isNotNull'`,
    );
  });
});

describe('withAssure', () => {
  it('should be able to add assure to a specific check', () => {
    const isAString = withAssure(
      (input: any): input is string => typeof input === 'string',
      { name: 'isAString' },
    );

    const shouldBeString: string = isAString.assure('hi');

    const error = getError(() => {
      const shouldThrowBeforeHere: string = isAString.assure(7);
    });
    expect(error.message).toContain(
      `input does not satisfy type.check 'isAString'`,
    );
  });

  it.skip('should be able to assure for a generic check', () => {
    const isNotNullOrig = <I>(input: I): input is NotNull<I> => input !== null;
    const isNotNull = withAssure(isNotNullOrig);

    // @ts-expect-error // todo: fix this once typescript enables passing through generic types. (today for generic, ReturnType<AssureMethod> works but ReturnType<{ assure: AssureMethod }> does not, leading this to fail)
    const shouldBeString: string = isNotNull.assure('hi');
    // @ts-expect-error // todo: fix this once typescript enables passing through generic types. (today for generic, ReturnType<AssureMethod> works but ReturnType<{ assure: AssureMethod }> does not, leading this to fail)
    const shouldBeNumber: number = isNotNull.assure(7);

    const error = getError(() => {
      // @ts-expect-error // todo: fix this once typescript enables passing through generic types. (today for generic, ReturnType<AssureMethod> works but ReturnType<{ assure: AssureMethod }> does not, leading this to fail)
      const shouldThrowBeforeHere: never = isNotNull.assure(null);
    });
    expect(error.message).toContain(
      `input does not satisfy type.check 'isNotNull'`,
    );
  });
});
