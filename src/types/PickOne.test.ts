import { PickOne } from './PickOne';

describe('PickOne', () => {
  it('should constrain type correctly', async () => {
    const findWrench = async ({
      size,
    }: {
      /**
       * specify the size of the wrench in either `imperial` or `metric` units
       *
       * note
       * - we "PickOne" because this is an exclusive option, a size cant be defined in both
       */
      size: PickOne<{
        metric: {
          millimeters: number;
        };
        imperial: {
          inches: string;
        };
      }>;
    }) => {
      // ...
    };

    // you can find by metric
    await findWrench({
      size: {
        metric: { millimeters: 16 },
      },
    });

    // you can find by imperial
    await findWrench({
      size: {
        imperial: { inches: '5/16' },
      },
    });

    // you can't find by both
    await findWrench({
      size: {
        metric: { millimeters: 16 },
        imperial: { inches: '5/16' },
      },
    });
  });
});
