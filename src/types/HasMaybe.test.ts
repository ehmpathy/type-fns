import type { HasMetadata } from '../checks/hasMetadata';
import type { HasMaybe } from './HasMaybe';

describe('HasMaybe', () => {
  it('should make the listed key optional while other keys stay required', () => {
    type A = HasMaybe<{ role: string; exid: string }, 'exid'>;

    // exid may be absent
    const withoutExid: A = { role: 'cruiser' };
    expect(withoutExid.role).toEqual('cruiser');

    // exid may be present
    const withExid: A = { role: 'cruiser', exid: 'turtle_123' };
    expect(withExid.exid).toEqual('turtle_123');

    // role stays required
    // @ts-expect-error - role is not optional
    const _missingRole: A = { exid: 'turtle_123' };
  });

  it('should make multiple listed keys optional, others untouched', () => {
    type B = HasMaybe<{ a: 1; b: 2; c: 3 }, 'a' | 'b'>;

    // a and b may be absent; c stays required
    const partial: B = { c: 3 };
    expect(partial.c).toEqual(3);

    const full: B = { a: 1, b: 2, c: 3 };
    expect(full.a).toEqual(1);

    // c stays required
    // @ts-expect-error - c is not optional
    const _missingC: B = { a: 1, b: 2 };
  });

  it('should reject a key that is not a key of T', () => {
    // @ts-expect-error - 'z' is not a key of T
    type _C = HasMaybe<{ role: string }, 'z'>;
  });

  it('should accept an interface-typed T (not just a type alias)', () => {
    // regression guard: an `interface` lacks an implicit index signature, so it
    // could fail the `T extends Record<string, any>` bound. this proves the
    // real-world shape (an interface) compiles against HasMaybe.
    interface SurferRef {
      role: 'shredder' | 'cruiser' | 'grommet';
      exid: string;
    }

    type RiderDraft = HasMaybe<SurferRef, 'exid'>;

    const draft: RiderDraft = { role: 'cruiser' };
    expect(draft.role).toEqual('cruiser');

    const bound: RiderDraft = { role: 'shredder', exid: 'turtle_456' };
    expect(bound.exid).toEqual('turtle_456');
  });

  it('should compose with HasMetadata as an exact inverse on the same key', () => {
    interface Wave {
      id: string;
      swell: number;
    }

    // loosen id to optional, then re-require it via HasMetadata → back to Wave
    type Loosened = HasMaybe<Wave, 'id'>;
    type Restored = HasMetadata<Loosened, 'id'>;

    // after the round-trip, id is required again
    const restored: Restored = { id: 'wave_1', swell: 6 };
    expect(restored.id).toEqual('wave_1');

    // @ts-expect-error - id is required again after the round-trip
    const _missingId: Restored = { swell: 6 };

    // the round-tripped type is shape-equivalent to the original Wave
    const asWave: Wave = restored;
    const backToRestored: Restored = asWave;
    expect(asWave.id).toEqual(backToRestored.id);
  });

  it('should be a no-op when the key is already optional', () => {
    type AlreadyOptional = { id?: string; swell: number };
    type Result = HasMaybe<AlreadyOptional, 'id'>;

    // id stays optional — absent is still allowed
    const without: Result = { swell: 6 };
    expect(without.swell).toEqual(6);

    // and present is still allowed
    const withId: Result = { id: 'wave_1', swell: 6 };
    expect(withId.id).toEqual('wave_1');
  });

  it('should be equivalent to Partial<T> when K = keyof T', () => {
    type Full = { a: 1; b: 2 };
    type Result = HasMaybe<Full, keyof Full>;

    // every key optional, exactly like Partial<Full>
    const empty: Result = {};
    const full: Result = { a: 1, b: 2 };
    expect(Object.keys(empty)).toHaveLength(0);
    expect(full.a).toEqual(1);

    // assignable both directions with Partial<Full>
    const asPartial: Partial<Full> = full;
    const backToResult: Result = asPartial;
    expect(asPartial.a).toEqual(backToResult.a);
  });
});
