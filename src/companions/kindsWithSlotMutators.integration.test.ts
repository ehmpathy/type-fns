import { given, then, when } from 'test-fns';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { kindsWithSlotMutators } from './kindsWithSlotMutators';

/**
 * .what = a doc-drift clamp: the docs that name the slot-mutator kinds must name every kind the
 *         runtime refuses
 * .why = the integration grain because it reads the filesystem, a boundary a unit test forbids; it
 *        calls no external service, so it proves no external contract — the built package root's
 *        contract is `src/index.acceptance.test.ts`
 */

/**
 * .what = the passage of a doc from an anchor up to a terminator
 * .why = each doc enumerates the kinds in one passage; a whole-file check would stay green when
 *        that passage drifts but the name still appears elsewhere
 * .note = throws if either end is absent, so a moved anchor fails loud, never passes silent
 */
const getOnePassage = (input: {
  path: string;
  from: string;
  until: string;
}): string => {
  const doc = readFileSync(join(process.cwd(), input.path), 'utf8');
  const start = doc.indexOf(input.from);
  if (start < 0)
    throw new Error(`anchor not found in ${input.path}: ${input.from}`);
  const end = doc.indexOf(input.until, start + input.from.length);
  if (end < 0)
    throw new Error(`terminator not found in ${input.path}: ${input.until}`);
  return doc.slice(start, end);
};

const kindNames = kindsWithSlotMutators.map((kind) => kind.of.name);

describe('kindsWithSlotMutators, against the docs that name it', () => {
  given('[case1] the runtime list of slot-mutator kinds', () => {
    then('it holds the eight kinds the docs were written against', () => {
      expect(kindNames).toEqual([
        'Map',
        'Set',
        'WeakMap',
        'WeakSet',
        'Date',
        'DataView',
        'RegExp',
        'ArrayBuffer',
      ]);
    });
  });

  given('[case2] the readme paragraph that lists refused mutators', () => {
    const passage = getOnePassage({
      path: 'readme.md',
      from: 'a bare `Object.freeze` lets a built-in change its internal state',
      until: '\n\n',
    });

    when('[t0] each kind of the runtime list is sought', () => {
      kindNames.map((name) =>
        then(`it names ${name}`, () => {
          expect(passage).toContain(`\`${name}\``);
        }),
      );
    });
  });

  given('[case3] the asFrozenDeep jsdoc note that lists refused kinds', () => {
    const passage = getOnePassage({
      path: 'src/companions/asFrozenDeep.ts',
      from: '.note = a built-in whose mutators write an internal slot',
      until: '.note =',
    });

    when('[t0] each kind of the runtime list is sought', () => {
      kindNames.map((name) =>
        then(`it names ${name}`, () => {
          expect(passage).toContain(`\`${name}\``);
        }),
      );
    });
  });

  given('[case4] the FrozenDeep jsdoc, which types each kind', () => {
    const family = getOnePassage({
      path: 'src/types/FrozenDeep.ts',
      from: '.the family =',
      until: '.note =',
    });
    const bound = getOnePassage({
      path: 'src/types/FrozenDeep.ts',
      from: '.bound =',
      until: '*/',
    });

    when('[t0] each kind of the runtime list is sought', () => {
      kindNames.map((name) =>
        then(`it gives ${name} a Frozen arm, or names it in the bound`, () => {
          const covered =
            family.includes(`\`Frozen${name}<`) ||
            bound.includes(`\`${name}\``);
          expect({ name, covered }).toEqual({ name, covered: true });
        }),
      );
    });
  });
});
