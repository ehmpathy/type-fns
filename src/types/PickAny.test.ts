import { PickAny } from './PickAny';

describe('PickAny', () => {
  it('should constrain type correctly', async () => {
    const findFlowers = async (
      input: PickAny<{
        color: {
          petals: string;
        };
        size: {
          choice: 'LARGE' | 'SMALL';
        };
      }>,
    ) => {
      // ...
    };

    // you can find by color
    await findFlowers({
      color: {
        petals: 'white',
      },
    });

    // you can find by size
    await findFlowers({
      size: {
        choice: 'LARGE',
      },
    });

    // you can find by both
    await findFlowers({
      color: {
        petals: 'white',
      },
      size: {
        choice: 'LARGE',
      },
    });

    // you can't find by neither
    await findFlowers({
      // @ts-expect-error - cant be neither
      size: {},
    });
  });
});
