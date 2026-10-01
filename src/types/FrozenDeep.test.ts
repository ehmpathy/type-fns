import * as root from '../index';
import type { FrozenDeep, FrozenMap, FrozenSet } from './FrozenDeep';

type Stamp = string & { _dglo: 'iso-time.IsoTimeStamp' };

describe('FrozenDeep', () => {
  describe('the clamp from ehmpathy/type-fns#48', () => {
    it('should leave a branded primitive unchanged', () => {
      // a branded primitive survives unchanged
      const a: FrozenDeep<Stamp> = '' as Stamp;
      const b: Stamp = a;
      expect(b).toEqual('');
    });

    it('should keep a nested branded primitive assignable back', () => {
      // nested inside an object, still assignable back
      const c: { readonly at: Stamp } = { at: '' as Stamp } as FrozenDeep<{
        at: Stamp;
      }>;
      expect(c.at).toEqual('');
    });

    it('should keep a plain object deep readonly', () => {
      // compile-time only; never invoked, since `{}` has no `.x` at runtime
      const _attempt = () => {
        // @ts-expect-error - depth two is readonly
        (({}) as FrozenDeep<{ x: { y: number } }>).x.y = 1;
      };
    });

    it('should keep an array a readonly array', () => {
      // compile-time only; never invoked
      const _attempt = () => {
        // @ts-expect-error - push is absent from ReadonlyArray
        (({}) as FrozenDeep<number[]>).push(1);
      };
    });
  });

  describe('case 1: a branded primitive survives, nested in a payload', () => {
    type Payload = { page: { range: { since: Stamp } } };
    const frozen = {
      page: { range: { since: 'at' as Stamp } },
    } as FrozenDeep<Payload>;

    it('[t0] should map the nested slot to the brand itself', () => {
      const since: Stamp = frozen.page.range.since;
      expect(since).toEqual('at');
    });

    it('[t1] should assign the frozen payload back, with the brand intact', () => {
      const backOut: {
        readonly page: { readonly range: { readonly since: Stamp } };
      } = frozen;
      const takesStamp = (input: Stamp): Stamp => input;
      expect(takesStamp(backOut.page.range.since)).toEqual('at');
    });

    it('[t2] should forward the whole payload to a query typed on the un-frozen shape', () => {
      const query = (input: Payload): Stamp => input.page.range.since;
      expect(query(frozen)).toEqual('at');
    });

    it('[t3] should still refuse a write through the frozen payload', () => {
      // compile-time only; never invoked
      const _attempt = () => {
        // @ts-expect-error - the slot is readonly
        frozen.page.range.since = '' as Stamp;
      };
      expect(frozen.page.range.since).toEqual('at');
    });
  });

  describe('primitives', () => {
    it('should leave every primitive kind unchanged', () => {
      const s: string = 'wave' as FrozenDeep<string>;
      const n: number = 6 as FrozenDeep<number>;
      const flag: boolean = true as FrozenDeep<boolean>;
      const big: bigint = BigInt(7) as FrozenDeep<bigint>;
      const absent: null = null as FrozenDeep<null>;
      const lit: 'shredder' = 'shredder' as FrozenDeep<'shredder'>;
      expect([s, n, flag, big, absent, lit]).toEqual([
        'wave',
        6,
        true,
        BigInt(7),
        null,
        'shredder',
      ]);
    });

    it('should leave branded numbers and booleans unchanged', () => {
      type Knots = number & { _dglo: 'knots' };
      type Verified = boolean & { _dglo: 'verified' };
      const k: Knots = 12 as Knots as FrozenDeep<Knots>;
      const v: Verified = true as Verified as FrozenDeep<Verified>;
      expect([k, v]).toEqual([12, true]);
    });

    it('should keep an array of branded primitives as brands', () => {
      const stamps = ['' as Stamp] as FrozenDeep<Stamp[]>;
      const first: Stamp | undefined = stamps[0];
      expect(first).toEqual('');
    });
  });

  describe('objects', () => {
    it('should refuse a write at depth one and depth two, and permit reads', () => {
      const frozen = { x: { y: 1 } } as FrozenDeep<{ x: { y: number } }>;
      // compile-time only; never invoked, so the value stays intact for the read
      const _attempts = () => {
        // @ts-expect-error - depth one is readonly
        frozen.x = { y: 2 };
        // @ts-expect-error - depth two is readonly
        frozen.x.y = 2;
      };
      const read: number = frozen.x.y;
      expect(read).toEqual(1);
    });

    it('should refuse a write onto a primitive-valued slot, plain or branded', () => {
      // @ts-expect-error - the readonly sits on the slot
      (({}) as FrozenDeep<{ s: string }>).s = 'x';
      // @ts-expect-error - a branded slot is readonly too
      (({}) as FrozenDeep<{ at: Stamp }>).at = '' as Stamp;
    });

    it('should keep an optional property optional', () => {
      const frozen: FrozenDeep<{ at?: Stamp }> = {};
      const at: Stamp | undefined = frozen.at;
      expect(at).toBeUndefined();
    });

    it('should keep a branded object deep readonly', () => {
      type Surfer = { name: string; board: { size: number } } & {
        _dglo: 'surfer';
      };
      // compile-time only; never invoked
      const _attempt = () => {
        // @ts-expect-error - a brand does not exempt an object
        (({}) as FrozenDeep<Surfer>).board.size = 9;
      };
    });

    it('should make an index signature readonly', () => {
      const frozen = { a: 1 } as FrozenDeep<Record<string, number>>;
      // compile-time only; never invoked
      const _attempt = () => {
        // @ts-expect-error - an index signature slot is readonly
        frozen.b = 2;
      };
      expect(frozen.a).toEqual(1);
    });

    it('should make a symbol-keyed property readonly', () => {
      const tag: unique symbol = Symbol('tag');
      const frozen = { [tag]: 1 } as FrozenDeep<{ [tag]: number }>;
      // compile-time only; never invoked
      const _attempt = () => {
        // @ts-expect-error - a symbol key is readonly too
        frozen[tag] = 2;
      };
      expect(frozen[tag]).toEqual(1);
    });

    it('should terminate on a recursive type, readonly at every depth', () => {
      type Node = { name: string; next: Node | null };
      // compile-time only; never invoked
      const _attempt = () => {
        // @ts-expect-error - depth three of a recursive type is readonly
        (({}) as FrozenDeep<Node>).next!.next!.name = 'x';
      };
    });

    it('should refuse an assign-back of a class with private fields', () => {
      class Board {
        #wax = 1;
        public size = 9;
        public getWax(): number {
          return this.#wax;
        }
      }
      const frozen = new Board() as unknown as FrozenDeep<Board>;
      // @ts-expect-error - the mapped type drops #private, so it is no longer a Board
      const back: Board = frozen;
      expect(back.size).toEqual(9);
    });
  });

  describe('unions and top types', () => {
    it('should distribute over a union', () => {
      const frozen = { a: 1 } as FrozenDeep<{ a: number } | Stamp>;
      const narrowed: Stamp | { readonly a: number } = frozen;
      expect(narrowed).toEqual({ a: 1 });
    });

    it('should pass unknown, void, never, and any through', () => {
      const u: unknown = 'x' as FrozenDeep<unknown>;
      const v: void = undefined as FrozenDeep<void>;
      // biome-ignore lint/suspicious/noExplicitAny: any is the case under test
      const a: FrozenDeep<any> = 1;
      type IsNever<X> = [X] extends [never] ? true : false;
      const neverStaysNever: IsNever<FrozenDeep<never>> = true;
      // @ts-expect-error - a clamp on the clamp: a non-never input is not never
      const stringIsNotNever: IsNever<FrozenDeep<string>> = true;
      expect([u, v, a, neverStaysNever, stringIsNotNever]).toEqual([
        'x',
        undefined,
        1,
        true,
        true,
      ]);
    });
  });

  describe('tuples', () => {
    it('should keep a tuple as a readonly tuple, with arity and positions', () => {
      const range = ['2026-01-01', '2026-02-01'] as FrozenDeep<
        [since: string, until: string]
      >;
      const since: string = range[0];
      const arity: 2 = range.length;
      // @ts-expect-error - index 2 is beyond the arity
      range[2];
      // @ts-expect-error - push is absent from a readonly tuple
      range.push('x');
      expect([since, arity]).toEqual(['2026-01-01', 2]);
    });
  });

  describe('maps and sets', () => {
    it('should freeze a map to FrozenMap, with mutators absent and values deep', () => {
      const frozen = new Map([['sms', { n: 1 }]]) as FrozenDeep<
        Map<string, { n: number }>
      >;
      const asFamily: FrozenMap<string, { n: number }> = frozen;
      // compile-time only; never invoked. the runtime refusal is asFrozenDeep's to prove
      const _attempts = () => {
        // @ts-expect-error - set is absent from a frozen map
        frozen.set('push', { n: 2 });
        // @ts-expect-error - delete is absent from a frozen map
        frozen.delete('sms');
        // @ts-expect-error - clear is absent from a frozen map
        frozen.clear();
        // @ts-expect-error - a value is frozen deep
        frozen.get('sms')!.n = 2;
      };
      expect(asFamily.get('sms')?.n).toEqual(1);
    });

    it('should freeze a set to FrozenSet, with mutators absent', () => {
      const frozen = new Set(['sms']) as FrozenDeep<Set<string>>;
      const asFamily: FrozenSet<string> = frozen;
      // compile-time only; never invoked. the runtime refusal is asFrozenDeep's to prove
      const _attempts = () => {
        // @ts-expect-error - add is absent from a frozen set
        frozen.add('push');
        // @ts-expect-error - delete is absent from a frozen set
        frozen.delete('sms');
        // @ts-expect-error - clear is absent from a frozen set
        frozen.clear();
      };
      expect([...asFamily]).toEqual(['sms']);
    });

    it('should pass a FrozenMap where a ReadonlyMap is accepted', () => {
      const frozen = new Map([['a', 1]]) as FrozenMap<string, number>;
      const readonlyMap: ReadonlyMap<string, number> = frozen;
      expect(readonlyMap.get('a')).toEqual(1);
    });

    it('should pass a FrozenSet where a ReadonlySet is accepted', () => {
      const frozen = new Set(['a']) as FrozenSet<string>;
      const readonlySet: ReadonlySet<string> = frozen;
      expect(readonlySet.has('a')).toEqual(true);
    });
  });

  describe('functions', () => {
    it('should keep a plain function callable, generics intact', () => {
      const identity = (<A>(a: A): A => a) as FrozenDeep<<A>(a: A) => A>;
      const out: string = identity('wave');
      expect(out).toEqual('wave');
    });

    it('should keep a function with props callable, and refuse a write onto its props', () => {
      type Handler = ((swell: number) => string) & {
        retries: number;
        cfg: { n: number };
      };
      const handler = Object.assign((swell: number) => `${swell}ft`, {
        retries: 1,
        cfg: { n: 1 },
      }) as FrozenDeep<Handler>;
      const said: string = handler(6);
      // @ts-expect-error - an own prop is readonly
      handler.retries = 3;
      // @ts-expect-error - an own prop is frozen deep
      handler.cfg.n = 2;
      expect(said).toEqual('6ft');
    });
  });

  describe('exotic objects', () => {
    it('should round-trip a Date both directions', () => {
      const intoFrozen: FrozenDeep<Date> = new Date(0);
      const outOfFrozen: Date = intoFrozen;
      expect(outOfFrozen.getTime()).toEqual(0);
    });
  });

  describe('the bound, asserted so it cannot be over-promised', () => {
    it('should permit a hand-off to a mutable object parameter', () => {
      const takesMutable = (input: { a: number }): number => input.a;
      const frozen = { a: 1 } as FrozenDeep<{ a: number }>;
      expect(takesMutable(frozen)).toEqual(1);
    });

    it('should refuse a hand-off to a mutable array parameter', () => {
      const takesMutable = (input: number[]): number => input.length;
      const frozen = [1] as FrozenDeep<number[]>;
      // @ts-expect-error - a readonly array is not a mutable array
      takesMutable(frozen);
    });

    it('should hand .push back once Array.isArray narrows a frozen value of unknown shape', () => {
      // a tripwire: if typescript ever narrows to a readonly array here, this stops to compile,
      // and the `.bound` line on Array.isArray is stale
      const frozen: FrozenDeep<unknown> = [1] as FrozenDeep<number[]>;
      const pushed = Array.isArray(frozen) ? frozen.push(2) : 0;
      expect(pushed).toEqual(2);
    });

    describe('case 8: a mutable object sink one array field away from a brand', () => {
      type Payload = {
        page: { range: { since: { lastMessageAt: Stamp } } };
        tags: string[];
      };
      const frozen = {
        page: { range: { since: { lastMessageAt: 'at' as Stamp } } },
        tags: [],
      } as FrozenDeep<Payload>;

      it('[t2] should refuse the whole payload, yet keep the brand intact', () => {
        const query = (_input: Payload): void => undefined;
        // @ts-expect-error - the nested readonly array refuses the mutable sink
        query(frozen);
        const stampStillFine: Stamp = frozen.page.range.since.lastMessageAt; // proof of cause
        expect(stampStillFine).toEqual('at');
      });

      it('[t3] should permit a readonly sink', () => {
        const query = (input: FrozenDeep<Payload>): Stamp =>
          input.page.range.since.lastMessageAt;
        expect(query(frozen)).toEqual('at');
      });

      it('[t4] should refuse a write at depth four and a push onto the array', () => {
        // compile-time only; never invoked
        const _attempts = () => {
          // @ts-expect-error - depth four is readonly
          frozen.page.range.since.lastMessageAt = '' as Stamp;
          // @ts-expect-error - push is absent from a readonly array
          frozen.tags.push('x');
        };
        expect(frozen.tags).toEqual([]);
      });

      it('[t5] should permit the array-free sub-object into a mutable sink, so tags is the only wall', () => {
        const queryPage = (input: Payload['page']): Stamp =>
          input.range.since.lastMessageAt;
        expect(queryPage(frozen.page)).toEqual('at');
      });
    });
  });

  describe('the package root', () => {
    it('should export the family and ArrayWith from the root (case 6)', () => {
      const frozen: root.FrozenDeep<{ at: Stamp }> = { at: '' as Stamp };
      const map: root.FrozenMap<string, number> = new Map();
      const set: root.FrozenSet<string> = new Set();
      const pair: root.ArrayWith<'len', 2, number> = [1, 2];
      const at: Stamp = frozen.at;
      expect(typeof root.asFrozenDeep).toEqual('function');
      expect([at, map.size, set.size, pair.length]).toEqual(['', 0, 0, 2]);
    });

    it('should keep the runtime export names of the root stable', () => {
      const names = Object.keys(root).sort();
      expect(names).toContain('asFrozenDeep');
      expect(names).toMatchSnapshot();
    });
  });
});
