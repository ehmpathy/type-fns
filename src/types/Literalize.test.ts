import { Literalize } from './Literalize';

describe('Literalize', () => {
  it('should be able to cast enum into union of literals or enum values', () => {
    enum Berry {
      RASPBERRY = 'raspberry',
      STRAWBERRY = 'strawberry',
      BLUEBERRY = 'blueberry',
    }

    type BerryLit = Literalize<Berry>;

    // @ts-expect-error
    const before: Berry = 'raspberry'; // 🛑 Type '"raspberry"' is not assignable to type 'Berries'.ts(2322)

    // after
    const literally: BerryLit = 'raspberry';
    const originally: BerryLit = Berry.STRAWBERRY;
  });
});
