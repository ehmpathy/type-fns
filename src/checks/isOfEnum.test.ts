import { createIsOfEnum } from './isOfEnum';

describe('isOfEnum', () => {
  enum Planet {
    VENUS = 'VENUS',
    EARTH = 'EARTH',
    MARS = 'MARS',
  }
  it('can be used to assess correctly, default call', () => {
    const isPlanet = createIsOfEnum(Planet);
    const earthIsPlanet = isPlanet('EARTH');
    const plutoIsPlanet = isPlanet('PLUTO');
    expect(earthIsPlanet).toEqual(true);
    expect(plutoIsPlanet).toEqual(false);
  });
  it('can be used to assess correctly, named call', () => {
    const isPlanet = createIsOfEnum(Planet);
    const earthIsPlanet = isPlanet.assess('EARTH');
    const plutoIsPlanet = isPlanet.assess('PLUTO');
    expect(earthIsPlanet).toEqual(true);
    expect(plutoIsPlanet).toEqual(false);
  });
  it('can be used to create type guarded branches', () => {
    const isPlanet = createIsOfEnum(Planet);
    const earth = 'EARTH';
    if (isPlanet.assess(earth)) {
      const home: Planet = earth; // no type error
    }
  });
  it('can be used to create type asserted casts', () => {
    const isPlanet = createIsOfEnum(Planet);
    const earth = 'EARTH';
    const home: Planet = isPlanet.assure(earth);
  });
});
