import { createIsOfEnum } from './isOfEnum';

describe('isOfEnum', () => {
  it('can be used for custom enums correctly', () => {
    enum Planet {
      VENUS = 'VENUS',
      EARTH = 'EARTH',
      MARS = 'MARS',
    }
    const isPlanet = createIsOfEnum(Planet);
    const earthIsPlanet = isPlanet('EARTH');
    const plutoIsPlanet = isPlanet('PLUTO');
    expect(earthIsPlanet).toEqual(true);
    expect(plutoIsPlanet).toEqual(false);
  });
});
