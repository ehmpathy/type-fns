import { hasMetadata } from '..';
import { HasMetadata, OmitMetadata } from './hasMetadata';

describe('HasMetadata', () => {
  it('should enable accessing an optional metadata property of a type', () => {
    type FlowerPot = { id?: number; age: number };
    const pot: HasMetadata<FlowerPot> = { id: 123, age: 72 };
    expect(pot.id.toFixed).toBeDefined(); // no type errors
  });
});

describe('OmitMetadata', () => {
  it('should prevent specifying a metadata property of a type', () => {
    type FlowerPot = { id?: number; age: number };

    // @ts-expect-error - should not be able to set id
    const pot: OmitMetadata<FlowerPot> = { id: 123, age: 72 };
  });
  it('should prevent accessing a metadata property of a type', () => {
    type FlowerPot = { id?: number; age: number };

    const pot: OmitMetadata<FlowerPot> = { age: 72 };

    // @ts-expect-error - should not be able to get id
    expect(pot.id).not.toBeDefined();
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
