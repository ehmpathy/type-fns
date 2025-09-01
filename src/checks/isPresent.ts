import { asAssure } from '../wrappers/withAssure';
import { NotNull } from './isNotNull';
import { IsDefined } from './isNotUndefined';
import { isPresentAssess as assess } from './isPresent.assess';

const assure = asAssure(assess, { name: 'isPresent' });

interface IsPresentWithAssure {
  <T>(t: T): t is NotNull<IsDefined<T>>; // todo: use `withAssure` to build this method instead, once typescript supports pass through of generics; (today for generic, ReturnType<AssureMethod> works but ReturnType<{ assure: AssureMethod }> does not, leading withAssess to fail to resolve the types)
  assess: typeof assess;
  assure: typeof assure;
}

/**
 * checks whether the value is defined and is not null
 *
 * refs
 * - https://github.com/microsoft/TypeScript/issues/16069#issuecomment-566222173
 */
const isPresentWithAssure: IsPresentWithAssure = function (
  ...input: Parameters<typeof assess>
): ReturnType<typeof assess> {
  return assess(...input);
} as typeof assess & {
  assess: typeof assess;
  assure: typeof assure;
};
isPresentWithAssure.assess = assess;
isPresentWithAssure.assure = assure;

export { isPresentWithAssure as isPresent };
