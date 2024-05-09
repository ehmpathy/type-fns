/**
 * expands the type of an enum to include the literal union of its types
 *
 * usecase
 * - when you want to use literals for devexp
 * - yet also want the advantages of enums (semantic purpose; tsdocs on hover; etc)
 *
 * example
 * ```ts
 *    enum Berry {
 *      RASPBERRY = 'raspberry',
 *      STRAWBERRY = 'strawberry',
 *      BLUEBERRY = 'blueberry',
 *    }
 *    const before: Berry = 'raspberry'; // 🛑 Type '"raspberry"' is not assignable to type 'Berries'.ts(2322)
 *    const after: Literalize<Berry> = 'raspberry';
 * ```
 *
 * ref
 * - https://stackoverflow.com/questions/52393730/typescript-string-literal-union-type-from-enum
 *
 * def
 * - "literalize" = interpret or represent literally
 */
export type Literalize<
  T extends string | number | bigint | boolean | null | undefined,
> = `${T}` | T;
