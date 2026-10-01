import { ConstraintError } from 'helpful-errors';
import { getError } from 'test-fns';

import type { FrozenDeep } from '@src/types/FrozenDeep';

import { asFrozenDeep } from './asFrozenDeep';

type Stamp = string & { _dglo: 'iso-time.IsoTimeStamp' };

/**
 * .what = the engine's write-refusal error, with its volatile target name masked
 * .why = v8 names the target as `'#<Object>'`, `'[object Array]'`, or a function's source — engine
 *        internals, not this package's contract. the mask keeps the stable shape snappable
 */
const asMaskedEngineError = (input: {
  error: Error;
}): { name: string; message: string } => ({
  name: input.error.name,
  message: input.error.message.replace(
    / of (object|function) '[\s\S]*'$/,
    ' of $1 <masked>',
  ),
});

describe('asFrozenDeep', () => {
  describe('identity', () => {
    it('should return the same reference, frozen in place', () => {
      const input = { page: { limit: 10 } };
      const frozen = asFrozenDeep(input);
      expect(frozen).toBe(input);
      expect(Object.isFrozen(input)).toEqual(true);
      expect(Object.isFrozen(input.page)).toEqual(true);
    });

    it('should return a primitive as-is, branded or plain', () => {
      const stamp = asFrozenDeep('2026-09-29T00:00:00Z' as Stamp);
      const backToStamp: Stamp = stamp;
      expect(backToStamp).toEqual('2026-09-29T00:00:00Z');
      expect(asFrozenDeep(6)).toEqual(6);
      expect(asFrozenDeep(null)).toEqual(null);
      expect(asFrozenDeep(undefined)).toEqual(undefined);
    });

    it('should type its return as FrozenDeep of its input', () => {
      const frozen: FrozenDeep<{ at: Stamp }> = asFrozenDeep({
        at: '' as Stamp,
      });
      const at: Stamp = frozen.at;
      expect(at).toEqual('');
    });
  });

  describe('the type and the runtime agree, per shape', () => {
    it('should refuse a write at depth two on a plain object', () => {
      const frozen = asFrozenDeep({ x: { y: 1 } });
      const error = getError(() => {
        // @ts-expect-error - the type refuses it too
        frozen.x.y = 2;
      });
      expect(error).toBeInstanceOf(TypeError);
      expect(error.message).toContain("read only property 'y'");
      expect(asMaskedEngineError({ error })).toMatchSnapshot();
      expect(frozen.x.y).toEqual(1);
    });

    it('should refuse a push onto an array, at depth', () => {
      const frozen = asFrozenDeep({ tags: ['sms'] });
      const error = getError(() => {
        // @ts-expect-error - the type refuses it too
        frozen.tags.push('push');
      });
      expect(error).toBeInstanceOf(TypeError);
      expect(error.message).toContain('not extensible');
      expect(asMaskedEngineError({ error })).toMatchSnapshot();
      expect(frozen.tags).toEqual(['sms']);
    });

    it('should refuse a write into a tuple slot, and keep the tuple', () => {
      const range: [since: string, until: string] = ['a', 'b'];
      const frozen = asFrozenDeep(range);
      const error = getError(() => {
        // @ts-expect-error - the type refuses it too
        frozen[0] = 'z';
      });
      expect(error).toBeInstanceOf(TypeError);
      expect(error.message).toContain("read only property '0'");
      expect(asMaskedEngineError({ error })).toMatchSnapshot();
      const since: string = frozen[0];
      expect(since).toEqual('a');
    });

    it('should refuse a write onto a function prop, and keep the function callable', () => {
      const handler = Object.assign((swell: number) => `${swell}ft`, {
        retries: 1,
      });
      const frozen = asFrozenDeep(handler);
      const error = getError(() => {
        // @ts-expect-error - the type refuses it too
        frozen.retries = 3;
      });
      expect(error).toBeInstanceOf(TypeError);
      expect(error.message).toContain("read only property 'retries'");
      expect(asMaskedEngineError({ error })).toMatchSnapshot();
      expect(frozen(6)).toEqual('6ft');
    });

    it('should refuse map.set, map.delete, and map.clear, and keep reads', () => {
      const frozen = asFrozenDeep(new Map([['sms', { n: 1 }]]));
      // @ts-expect-error - the type refuses it too
      const errorSet = getError(() => frozen.set('push', { n: 2 }));
      // @ts-expect-error - the type refuses it too
      const errorDelete = getError(() => frozen.delete('sms'));
      // @ts-expect-error - the type refuses it too
      const errorClear = getError(() => frozen.clear());
      expect(errorSet).toBeInstanceOf(ConstraintError);
      expect(errorDelete).toBeInstanceOf(ConstraintError);
      expect(errorClear).toBeInstanceOf(ConstraintError);
      expect(errorSet.message).toContain('a frozen Map refuses .set()');
      expect(errorDelete.message).toContain('a frozen Map refuses .delete()');
      expect(errorClear.message).toContain('a frozen Map refuses .clear()');
      expect({
        set: errorSet.message,
        delete: errorDelete.message,
        clear: errorClear.message,
      }).toMatchSnapshot();
      expect(frozen.get('sms')).toEqual({ n: 1 });
      expect(frozen.size).toEqual(1);
      expect(frozen instanceof Map).toEqual(true);
    });

    it('should freeze a map value deep', () => {
      const frozen = asFrozenDeep(new Map([['sms', { n: 1 }]]));
      const error = getError(() => {
        // @ts-expect-error - the type refuses it too
        frozen.get('sms')!.n = 2;
      });
      expect(error).toBeInstanceOf(TypeError);
      expect(error.message).toContain("read only property 'n'");
      expect(asMaskedEngineError({ error })).toMatchSnapshot();
    });

    it('should refuse set.add, set.delete, and set.clear, and keep reads', () => {
      const frozen = asFrozenDeep(new Set(['sms']));
      // @ts-expect-error - the type refuses it too
      const errorAdd = getError(() => frozen.add('push'));
      // @ts-expect-error - the type refuses it too
      const errorDelete = getError(() => frozen.delete('sms'));
      // @ts-expect-error - the type refuses it too
      const errorClear = getError(() => frozen.clear());
      expect(errorAdd).toBeInstanceOf(ConstraintError);
      expect(errorDelete).toBeInstanceOf(ConstraintError);
      expect(errorClear).toBeInstanceOf(ConstraintError);
      expect(errorAdd.message).toContain('a frozen Set refuses .add()');
      expect(errorDelete.message).toContain('a frozen Set refuses .delete()');
      expect(errorClear.message).toContain('a frozen Set refuses .clear()');
      expect({
        add: errorAdd.message,
        delete: errorDelete.message,
        clear: errorClear.message,
      }).toMatchSnapshot();
      expect(frozen.has('sms')).toEqual(true);
      expect(frozen.size).toEqual(1);
    });

    it('should freeze a set member deep, and a map key deep', () => {
      const member = { n: 1 };
      const key = { k: 1 };
      asFrozenDeep(new Set([member]));
      asFrozenDeep(new Map([[key, 'v']]));
      expect(Object.isFrozen(member)).toEqual(true);
      expect(Object.isFrozen(key)).toEqual(true);
    });

    it('should freeze a value under a symbol key deep, as the type does', () => {
      const tag: unique symbol = Symbol('tag');
      const frozen = asFrozenDeep({ [tag]: { n: 1 } });
      const error = getError(() => {
        // @ts-expect-error - the type refuses it too
        frozen[tag].n = 2;
      });
      expect(error).toBeInstanceOf(TypeError);
      expect(error.message).toContain("read only property 'n'");
      expect(asMaskedEngineError({ error })).toMatchSnapshot();
    });

    it('should freeze a Date and keep its methods callable', () => {
      const frozen = asFrozenDeep({ at: new Date(0) });
      expect(Object.isFrozen(frozen.at)).toEqual(true);
      expect(frozen.at.getTime()).toEqual(0);
    });

    it('should refuse every Date setter, which a bare Object.freeze permits', () => {
      const frozen = asFrozenDeep({ at: new Date(0) });
      const errorYear = getError(() => frozen.at.setFullYear(2099));
      const errorTime = getError(() => frozen.at.setTime(1));
      const errorUtc = getError(() => frozen.at.setUTCHours(3));
      expect(errorYear).toBeInstanceOf(ConstraintError);
      expect(errorTime).toBeInstanceOf(ConstraintError);
      expect(errorUtc).toBeInstanceOf(ConstraintError);
      expect(errorYear.message).toContain(
        'a frozen Date refuses .setFullYear()',
      );
      expect(errorTime.message).toContain('a frozen Date refuses .setTime()');
      expect(errorUtc.message).toContain(
        'a frozen Date refuses .setUTCHours()',
      );
      expect(errorYear.message).toMatchSnapshot();
      expect(frozen.at.getTime()).toEqual(0);
    });

    it('should freeze a DataView with bytes, and refuse its setters', () => {
      const frozen = asFrozenDeep({ view: new DataView(new ArrayBuffer(2)) });
      expect(Object.isFrozen(frozen.view)).toEqual(true);
      const error = getError(() => frozen.view.setInt8(0, 7));
      expect(error).toBeInstanceOf(ConstraintError);
      expect(error.message).toMatchSnapshot();
      expect(frozen.view.getInt8(0)).toEqual(0);
    });

    it('should refuse weakmap.set and weakmap.delete, and keep reads', () => {
      const key = {};
      const frozen = asFrozenDeep({ byKey: new WeakMap([[key, 1]]) });
      const errors = {
        set: getError(() => frozen.byKey.set({}, 2)),
        delete: getError(() => frozen.byKey.delete(key)),
      };
      expect(errors.set).toBeInstanceOf(ConstraintError);
      expect(errors.delete).toBeInstanceOf(ConstraintError);
      expect({
        set: errors.set.message,
        delete: errors.delete.message,
      }).toMatchSnapshot();
      expect(frozen.byKey.get(key)).toEqual(1);
    });

    it('should refuse weakset.add and weakset.delete, and keep reads', () => {
      const key = {};
      const frozen = asFrozenDeep({ seen: new WeakSet([key]) });
      const errors = {
        add: getError(() => frozen.seen.add({})),
        delete: getError(() => frozen.seen.delete(key)),
      };
      expect(errors.add).toBeInstanceOf(ConstraintError);
      expect(errors.delete).toBeInstanceOf(ConstraintError);
      expect({
        add: errors.add.message,
        delete: errors.delete.message,
      }).toMatchSnapshot();
      expect(frozen.seen.has(key)).toEqual(true);
    });

    it('should refuse regexp.compile, which a bare Object.freeze lets rewrite the source, and keep reads', () => {
      const frozen = asFrozenDeep({ pattern: /swell/i });
      const error = getError(() => frozen.pattern.compile('flat'));
      expect(error).toBeInstanceOf(ConstraintError);
      expect(error.message).toMatchSnapshot();
      expect(frozen.pattern.source).toEqual('swell');
      expect(frozen.pattern.test('SWELL')).toEqual(true);
    });

    it('should refuse arraybuffer.transfer, which a bare Object.freeze permits, and keep reads', () => {
      const frozen = asFrozenDeep({ buffer: new ArrayBuffer(4) });
      const transfer = Reflect.get(frozen.buffer, 'transfer');
      const error = getError((): void => {
        Reflect.apply(transfer, frozen.buffer, []);
      });
      expect(error).toBeInstanceOf(ConstraintError);
      expect(error.message).toMatchSnapshot();
      expect(frozen.buffer.byteLength).toEqual(4);
    });

    it('should freeze a function prop deep', () => {
      const handler = Object.assign(() => 'ok', { cfg: { n: 1 } });
      const frozen = asFrozenDeep(handler);
      expect(Object.isFrozen(frozen.cfg)).toEqual(true);
    });

    it('should keep the mutator shadows out of Object.keys and json', () => {
      const frozen = asFrozenDeep(new Map([['a', 1]]));
      expect(Object.keys(frozen)).toEqual([]);
      expect(JSON.stringify(frozen)).toEqual('{}');
    });
  });

  describe('idempotency', () => {
    it('should return the same reference on a second call over a map and a set', () => {
      const input = { byChannel: new Map([['sms', 1]]), tags: new Set(['a']) };
      const first = asFrozenDeep(input);
      const second = asFrozenDeep(first);
      expect(second).toBe(input);
      // @ts-expect-error - the type refuses it too
      const error = getError(() => second.byChannel.set('push', 2));
      expect(error).toBeInstanceOf(ConstraintError);
    });

    it('should hold across a second loaded copy of the module, as with duplicate installs', () => {
      const input = { byChannel: new Map([['sms', 1]]), at: new Date(0) };
      asFrozenDeep(input);
      jest.isolateModules(() => {
        // a fresh module registry loads a second, independent copy
        const other =
          jest.requireActual<typeof import('./asFrozenDeep')>('./asFrozenDeep');
        expect(other.asFrozenDeep).not.toBe(asFrozenDeep);
        expect(other.asFrozenDeep(input)).toBe(input);
      });
    });
  });

  describe('graphs', () => {
    it('should terminate on a cycle', () => {
      type Node = { name: string; next: Node | null };
      const a: Node = { name: 'a', next: null };
      const b: Node = { name: 'b', next: a };
      a.next = b;
      const frozen = asFrozenDeep(a);
      expect(Object.isFrozen(frozen.next)).toEqual(true);
    });

    it('should freeze a sub-object reachable by two paths', () => {
      const shared = { n: 1 };
      const frozen = asFrozenDeep({ left: shared, right: shared });
      expect(frozen.left).toBe(frozen.right);
      expect(Object.isFrozen(shared)).toEqual(true);
    });

    it('should freeze a sub-object for every other holder of it too, since it freezes in place', () => {
      const settings = { limit: 10 };
      const otherHolder = { settings };
      asFrozenDeep({ page: settings });
      expect(Object.isFrozen(otherHolder.settings)).toEqual(true);
      const error = getError(() => {
        otherHolder.settings.limit = 50;
      });
      expect(error).toBeInstanceOf(TypeError);
    });

    it('should freeze the child of an object another caller already froze shallow', () => {
      const page = { limit: 10 };
      const shallow = Object.freeze({ page });
      asFrozenDeep(shallow);
      expect(Object.isFrozen(page)).toEqual(true);
    });

    it("should freeze an error's cause, a non-enumerable own prop", () => {
      const cause = { retries: 3 };
      const error = new Error('wipeout', { cause });
      asFrozenDeep({ error });
      expect(Object.isFrozen(cause)).toEqual(true);
      expect(
        getError(() => {
          cause.retries = 4;
        }),
      ).toBeInstanceOf(TypeError);
      expect(cause.retries).toEqual(3);
    });

    it('should freeze an object held in any non-enumerable own prop', () => {
      const hidden = { n: 1 };
      const holder = {};
      Object.defineProperty(holder, 'hidden', {
        value: hidden,
        enumerable: false,
      });
      asFrozenDeep(holder);
      expect(Object.isFrozen(hidden)).toEqual(true);
    });

    it("should never freeze a class's prototype, so other instances stay writable", () => {
      class Board {
        public length = 7;
        public getLength(): number {
          return this.length;
        }
      }
      asFrozenDeep({ Board });
      expect(Object.isFrozen(Board)).toEqual(true);
      expect(Object.isFrozen(Board.prototype)).toEqual(false);
      const other = new Board();
      other.length = 9;
      expect(other.getLength()).toEqual(9);
    });

    it('should name the path through a non-enumerable prop, when it refuses', () => {
      const holder = {};
      Object.defineProperty(holder, 'raw', {
        value: new Uint8Array([1]),
        enumerable: false,
      });
      const error = getError(() => asFrozenDeep({ holder }));
      expect(error).toBeInstanceOf(ConstraintError);
      expect(error.message).toContain('"path": "value.holder.raw"');
    });

    it('should refuse the mutators of a Map subclass, as of a Map', () => {
      class Cache extends Map<string, number> {}
      const cache = new Cache([['sms', 1]]);
      asFrozenDeep({ cache });
      const error = getError(() => cache.set('push', 2));
      expect(error).toBeInstanceOf(ConstraintError);
      expect(error.message).toContain('a frozen Cache refuses .set()');
      expect(cache.has('push')).toEqual(false);
      expect(cache.get('sms')).toEqual(1);
    });
  });

  describe('the bound, asserted so it cannot be over-promised', () => {
    it('should leave the bytes of an ArrayBuffer writable through a view built later', () => {
      const frozen = asFrozenDeep({ buffer: new ArrayBuffer(1) });
      new Uint8Array(frozen.buffer)[0] = 7;
      expect(new Uint8Array(frozen.buffer)[0]).toEqual(7);
    });

    it('should leave a refused mutator callable through its prototype, the one path the shadow can not close', () => {
      const frozen = asFrozenDeep({ byKey: new Map([['a', 1]]) });
      Map.prototype.set.call(frozen.byKey, 'b', 2);
      expect(frozen.byKey.get('b')).toEqual(2);
    });

    it('should leave a #private field writable through its own method', () => {
      class Counter {
        #count = 0;
        bump(): number {
          this.#count += 1;
          return this.#count;
        }
      }
      const frozen = asFrozenDeep({ counter: new Counter() });
      expect(Object.isFrozen(frozen.counter)).toEqual(true);
      expect(frozen.counter.bump()).toEqual(1);
    });
  });

  describe('the values it can not freeze, refused loud', () => {
    it('should refuse a typed array with elements, and name the fix', () => {
      const error = getError(() =>
        asFrozenDeep({ bytes: new Uint8Array([1]) }),
      );
      expect(error).toBeInstanceOf(ConstraintError);
      expect(error.message).toContain('typed array');
      expect(error.message).toMatchSnapshot();
    });

    it('should refuse a global or sticky RegExp, since a plain read on a frozen one throws', () => {
      const errorGlobal = getError(() => asFrozenDeep({ pattern: /swell/g }));
      const errorSticky = getError(() => asFrozenDeep({ pattern: /swell/y }));
      expect(errorGlobal).toBeInstanceOf(ConstraintError);
      expect(errorSticky).toBeInstanceOf(ConstraintError);
      expect(errorGlobal.message).toContain(
        'can not freeze a global or sticky RegExp',
      );
      expect(errorSticky.message).toContain(
        'can not freeze a global or sticky RegExp',
      );
      expect(errorGlobal.message).toMatchSnapshot();
    });

    describe('the sealed and pinned refusals hold for every slot-mutator kind', () => {
      const kinds = [
        { kind: 'Map', mutator: 'set', build: () => new Map() },
        { kind: 'Set', mutator: 'add', build: () => new Set() },
        { kind: 'WeakMap', mutator: 'set', build: () => new WeakMap() },
        { kind: 'WeakSet', mutator: 'add', build: () => new WeakSet() },
        { kind: 'Date', mutator: 'setFullYear', build: () => new Date(0) },
        {
          kind: 'DataView',
          mutator: 'setInt8',
          build: () => new DataView(new ArrayBuffer(1)),
        },
        { kind: 'RegExp', mutator: 'compile', build: () => /swell/ },
        {
          kind: 'ArrayBuffer',
          mutator: 'transfer',
          build: () => new ArrayBuffer(1),
        },
      ];

      kinds.map((thisKind) =>
        it(`should refuse the kind ${thisKind.kind} when sealed elsewhere, or with a pinned ${thisKind.mutator}`, () => {
          const sealed = Object.freeze(thisKind.build());
          const errorSealed = getError(() => asFrozenDeep({ sealed }));
          expect(errorSealed).toBeInstanceOf(ConstraintError);
          expect(errorSealed.message).toContain(
            ` ${thisKind.kind} already sealed`,
          );

          const pinned = thisKind.build();
          Object.defineProperty(pinned, thisKind.mutator, {
            value: Reflect.get(pinned, thisKind.mutator),
            configurable: false,
          });
          const errorPinned = getError(() => asFrozenDeep({ pinned }));
          expect(errorPinned).toBeInstanceOf(ConstraintError);
          expect(errorPinned.message).toContain(
            ` ${thisKind.kind} whose mutator is pinned`,
          );
          expect({
            sealed: errorSealed.message,
            pinned: errorPinned.message,
          }).toMatchSnapshot();
        }),
      );
    });

    describe('the refusal names the path where the refused object sits', () => {
      const bytes = (): Uint8Array => new Uint8Array([1]);
      const tag = Symbol('tag');
      const holder = {};
      const cases = [
        {
          step: 'the root',
          input: bytes(),
          path: 'value',
        },
        {
          step: 'an own prop, at depth',
          input: { page: { bytes: bytes() } },
          path: 'value.page.bytes',
        },
        {
          step: 'an array index',
          input: { list: [{}, bytes()] },
          path: 'value.list[1]',
        },
        {
          step: 'a key no identifier can spell',
          input: { 'raw-bytes': bytes() },
          path: "value['raw-bytes']",
        },
        {
          step: 'a key that holds a quote',
          input: { "surfer's": bytes() },
          path: "value['surfer\\'s']",
        },
        {
          step: 'a key that holds a backslash',
          input: { 'wave\\set': bytes() },
          path: "value['wave\\\\set']",
        },
        {
          step: 'a symbol key',
          input: { [tag]: bytes() },
          path: 'value[Symbol(tag)]',
        },
        {
          step: 'a map value, under a string key',
          input: { byKey: new Map([['sms', bytes()]]) },
          path: "value.byKey.get('sms')",
        },
        {
          step: 'a map value, under a number key',
          input: { byKey: new Map([[7, bytes()]]) },
          path: 'value.byKey.get(7)',
        },
        {
          step: 'a map value, under a boolean key',
          input: { byKey: new Map([[true, bytes()]]) },
          path: 'value.byKey.get(true)',
        },
        {
          step: 'a map value, under an object key',
          input: { byKey: new Map([[holder, bytes()]]) },
          path: '[...value.byKey.values()][0]',
        },
        {
          step: 'a map key',
          input: { byKey: new Map([[bytes(), 'v']]) },
          path: '[...value.byKey.keys()][0]',
        },
        {
          step: 'a set member',
          input: { seen: new Set([{}, bytes()]) },
          path: '[...value.seen][1]',
        },
      ];

      cases.map((thisCase) =>
        it(`should name the path through ${thisCase.step}: ${thisCase.path}`, () => {
          const error = getError(() => asFrozenDeep(thisCase.input));
          expect(error).toBeInstanceOf(ConstraintError);
          expect(error.message).toContain(
            `"path": ${JSON.stringify(thisCase.path)}`,
          );
          expect(error.message).toMatchSnapshot();
        }),
      );

      it('should name the path for every refusal kind, not only the typed array', () => {
        const errorRegExp = getError(() =>
          asFrozenDeep({ rules: { match: /swell/g } }),
        );
        const errorSealed = getError(() =>
          asFrozenDeep({ cache: Object.freeze(new Map()) }),
        );
        const pinned = new Set();
        Object.defineProperty(pinned, 'add', {
          value: Set.prototype.add,
          configurable: false,
        });
        const errorPinned = getError(() => asFrozenDeep({ seen: [pinned] }));
        expect(errorRegExp.message).toContain('"path": "value.rules.match"');
        expect(errorSealed.message).toContain('"path": "value.cache"');
        expect(errorPinned.message).toContain('"path": "value.seen[0]"');
        expect({
          regexp: errorRegExp.message,
          sealed: errorSealed.message,
          pinned: errorPinned.message,
        }).toMatchSnapshot();
      });
    });

    it('should leave the whole value untouched when any part is refused', () => {
      const input = {
        page: { limit: 10 },
        byChannel: new Map([['sms', 1]]),
        bytes: new Uint8Array([1]),
      };
      const error = getError(() => asFrozenDeep(input));
      expect(error).toBeInstanceOf(ConstraintError);
      expect(Object.isFrozen(input)).toEqual(false);
      expect(Object.isFrozen(input.page)).toEqual(false);
      input.byChannel.set('push', 2);
      expect(input.byChannel.get('push')).toEqual(2);
    });

    it('should refuse a map with a pinned mutator, and leave the rest untouched', () => {
      const pinned = new Map([['a', 1]]);
      Object.defineProperty(pinned, 'set', {
        value: Map.prototype.set,
        configurable: false,
      });
      const input = { page: { limit: 10 }, pinned };
      const error = getError(() => asFrozenDeep(input));
      expect(error).toBeInstanceOf(ConstraintError);
      expect(error.message).toContain('whose mutator is pinned');
      expect(error.message).toMatchSnapshot();
      expect(Object.isFrozen(input)).toEqual(false);
      expect(Object.isFrozen(input.page)).toEqual(false);
    });

    it('should not invoke a getter, so a getter value stays unfrozen', () => {
      const inner = { n: 1 };
      const reads: number[] = [];
      const input = {
        get lazy() {
          reads.push(1);
          return inner;
        },
      };
      asFrozenDeep(input);
      expect(reads).toEqual([]);
      expect(Object.isFrozen(inner)).toEqual(false);
    });

    it('should freeze an empty typed array, the boundary of the refusal', () => {
      const frozen = asFrozenDeep({ bytes: new Uint8Array(0) });
      expect(Object.isFrozen(frozen.bytes)).toEqual(true);
    });

    it('should refuse a set already sealed by a bare Object.freeze', () => {
      const sealed = Object.freeze(new Set(['a']));
      const error = getError(() => asFrozenDeep(sealed));
      expect(error).toBeInstanceOf(ConstraintError);
      expect(error.message).toContain('a Set already sealed');
      expect(error.message).toMatchSnapshot();
    });

    it('should refuse a map already sealed by a bare Object.freeze', () => {
      const sealed = Object.freeze(new Map([['a', 1]]));
      const error = getError(() => asFrozenDeep(sealed));
      expect(error).toBeInstanceOf(ConstraintError);
      expect(error.message).toContain('a Map already sealed via Object.freeze');
      expect(error.message).toMatchSnapshot();
    });
  });
});
