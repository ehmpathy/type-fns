import { existsSync } from 'node:fs';
import { join } from 'node:path';
import util from 'node:util';

import { jest } from '@jest/globals';

// set console.log to not truncate nested objects
util.inspect.defaultOptions.depth = 5;

/**
 * .what = verify that we're running from a valid project directory; otherwise, fail fast
 * .why = prevent confusion and hard-to-debug errors from running tests in the wrong directory
 */
if (!existsSync(join(process.cwd(), 'package.json')))
  throw new Error('no package.json found in cwd. are you @gitroot?');

/**
 * sanity check that unit tests are only run the 'test' environment
 *
 * usecases
 * - prevent polluting prod state with test data
 * - prevent executing financially impacting mutations
 */
if (
  (process.env.NODE_ENV !== 'test' || process.env.STAGE) &&
  process.env.I_KNOW_WHAT_IM_DOING !== 'true'
)
  throw new Error(`unit.test is not targeting stage 'test'`);
