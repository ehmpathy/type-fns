import { HasMetadata } from './hasMetadata';

describe('hasMetadata', () => {
  it('should enable accessing an optional metadata property of a type', () => {
    type FlowerPot = { id?: number; age: number };
    const pot: HasMetadata<FlowerPot> = { id: 123, age: 72 };
    expect(pot.id).toEqual(123); // no type errors
  });
});
