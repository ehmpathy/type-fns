import { isNotNull, NotNull } from './isNotNull';
import { IsDefined, isDefined } from './isNotUndefined';

const assess = <T>(t: T): t is NotNull<IsDefined<T>> =>
  isNotNull(t) && isDefined(t);

// export for direct usage, without assure
export { assess as isPresentAssess };
