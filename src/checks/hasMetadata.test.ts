import { hasMetadata } from '..';
import { HasMetadata } from './hasMetadata';

describe('HasMetadata', () => {
  it('should enable accessing an optional metadata property of a type', () => {
    type FlowerPot = { id?: number; age: number };
    const pot: HasMetadata<FlowerPot> = { id: 123, age: 72 };
    expect(pot.id.toFixed).toBeDefined(); // no type errors
  });
});

describe('hasMetadata', () => {
  it('should enable accessing an optional metadata property of a type', () => {
    type FlowerPot = { id?: number; age: number };
    const pot: FlowerPot = { id: 123, age: 72 };
    if (!hasMetadata(pot, ['id'])) throw new Error('doesnt have metadata');
    expect(pot.id.toFixed).toBeDefined();
  });
});
