import { ConstraintError } from 'helpful-errors';
import { getError, given, then, when } from 'test-fns';

// the built package, resolved via the root package.json `main`, as a consumer's import resolves it;
// `test:acceptance` builds `dist/` first
import * as pkg from '..';

type Stamp = string & { _dglo: 'iso-time.IsoTimeStamp' };

/**
 * .what = the engine's write-refusal error, with its volatile target name masked
 * .why = v8 names the target as `'#<Object>'` or similar — an engine internal, not this package's
 *        contract. the mask keeps the stable shape snappable
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

describe('type-fns, built', () => {
  given('[case1] the #48 clamp, against the published .d.ts', () => {
    when('[t0] a branded primitive is frozen, at the top and nested', () => {
      then('it stays assignable back to its brand', () => {
        const at: pkg.FrozenDeep<Stamp> = 'at' as Stamp;
        const atBack: Stamp = at;
        const event: pkg.FrozenDeep<{ at: Stamp }> = { at: 'at' as Stamp };
        const eventBack: { readonly at: Stamp } = event;
        expect([atBack, eventBack.at]).toEqual(['at', 'at']);
      });
    });

    when('[t1] a plain object and an array are frozen', () => {
      then('the object is deep readonly and the array a readonly array', () => {
        const frozen = { page: { limit: 10 }, tags: [] } as pkg.FrozenDeep<{
          page: { limit: number };
          tags: string[];
        }>;
        // compile-time only; never invoked
        const _attempts = () => {
          // @ts-expect-error - readonly at depth two
          frozen.page.limit = 50;
          // @ts-expect-error - push is absent from a readonly array
          frozen.tags.push('x');
        };
        expect(frozen.page.limit).toEqual(10);
      });
    });
  });

  given('[case2] the package root', () => {
    when(
      '[t0] a consumer imports the Frozen family, ArrayWith, and asFrozenDeep',
      () => {
        then('each resolves from the root', () => {
          const map: pkg.FrozenMap<string, number> = new Map();
          const set: pkg.FrozenSet<string> = new Set();
          const pair: pkg.ArrayWith<'len', 2, number> = [1, 2];
          expect([map.size, set.size, pair.length]).toEqual([0, 0, 2]);
          expect(typeof pkg.asFrozenDeep).toEqual('function');
        });

        then('the built root exports the same runtime names', () => {
          const names = Object.keys(pkg).sort();
          expect(names).toContain('asFrozenDeep');
          expect(names).toMatchSnapshot();
        });
      },
    );
  });

  given('[case3] a payload with a brand, a nested object, and a map', () => {
    const scene = () => ({
      input: {
        at: 'at' as Stamp,
        page: { limit: 10 },
        seen: new Map([['sms', 1]]),
      },
    });

    when('[t0] asFrozenDeep freezes it', () => {
      then(
        'it returns the same reference, frozen deep, the brand intact',
        () => {
          const { input } = scene();
          const frozen = pkg.asFrozenDeep(input);
          const at: Stamp = frozen.at;
          expect(frozen).toBe(input);
          expect(at).toEqual('at');
          expect(Object.isFrozen(input.page)).toEqual(true);
          expect(frozen).toMatchSnapshot();
        },
      );

      then('a second call returns the same reference, no throw', () => {
        const { input } = scene();
        const once = pkg.asFrozenDeep(input);
        expect(pkg.asFrozenDeep(once)).toBe(input);
      });
    });

    when('[t1] a caller writes through the original reference', () => {
      then(
        'the engine refuses it with a TypeError, and the value holds',
        () => {
          const { input } = scene();
          pkg.asFrozenDeep(input);
          // the original reference is typed mutable, so only the runtime freeze stands in the way
          const error = getError(() => {
            input.page.limit = 50;
          });
          expect(error).toBeInstanceOf(TypeError);
          expect(error.message).toContain("read only property 'limit'");
          expect(asMaskedEngineError({ error })).toMatchSnapshot();
          expect(input.page.limit).toEqual(10);
        },
      );
    });

    when('[t2] a caller calls a map mutator', () => {
      then('a ConstraintError names the fix, and the map holds', () => {
        const { input } = scene();
        pkg.asFrozenDeep(input);
        const error = getError(() => input.seen.set('push', 2));
        expect(error).toBeInstanceOf(ConstraintError);
        expect(error.message).toContain('a frozen Map refuses .set()');
        expect(error.message).toMatchSnapshot();
        expect(input.seen.has('push')).toEqual(false);
      });
    });

    when('[t3] a caller calls a set or a date mutator', () => {
      then('each refuses with a ConstraintError, and each holds', () => {
        // the original reference is typed mutable, so only the runtime freeze stands in the way
        const input = { tags: new Set(['sms']), sentAt: new Date(0) };
        pkg.asFrozenDeep(input);
        const errorSet = getError(() => input.tags.add('push'));
        const errorDate = getError(() => input.sentAt.setFullYear(2000));
        expect(errorSet).toBeInstanceOf(ConstraintError);
        expect(errorDate).toBeInstanceOf(ConstraintError);
        expect([errorSet.message, errorDate.message]).toMatchSnapshot();
        expect(input.tags.has('push')).toEqual(false);
        expect(input.sentAt.getTime()).toEqual(0);
      });
    });
  });

  given('[case4] a payload asFrozenDeep can not freeze', () => {
    const pinned = (): Map<string, number> => {
      const map = new Map<string, number>();
      Object.defineProperty(map, 'set', {
        value: Map.prototype.set,
        configurable: false,
      });
      return map;
    };
    const refusals = [
      {
        kind: 'a typed array with elements, deep',
        input: () => ({ event: { records: [{ raw: new Uint8Array([1]) }] } }),
        text: 'can not freeze a typed array with elements',
        path: 'value.event.records[0].raw',
      },
      {
        kind: 'a global RegExp, under a map value',
        input: () => ({ rules: new Map([['sms', { match: /swell/g }]]) }),
        text: 'can not freeze a global or sticky RegExp',
        path: "value.rules.get('sms').match",
      },
      {
        kind: 'a set sealed by a bare Object.freeze',
        input: () => ({ seen: Object.freeze(new Set(['sms'])) }),
        text: 'can not freeze a Set already sealed',
        path: 'value.seen',
      },
      {
        kind: 'a map with a pinned mutator',
        input: () => ({ cache: pinned() }),
        text: 'can not freeze a Map whose mutator is pinned',
        path: 'value.cache',
      },
    ];

    refusals.map((refusal) =>
      when(`[t0] the payload holds ${refusal.kind}`, () => {
        then(
          'a ConstraintError names the path and the fix, and freezes naught',
          () => {
            const input = refusal.input();
            const error = getError(() => pkg.asFrozenDeep(input));
            expect(error).toBeInstanceOf(ConstraintError);
            expect(error.message).toContain(refusal.text);
            expect(error.message).toContain(
              `"path": ${JSON.stringify(refusal.path)}`,
            );
            expect(Object.isFrozen(input)).toEqual(false);
            expect(error.message).toMatchSnapshot();
          },
        );
      }),
    );
  });
});
