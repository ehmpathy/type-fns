/**
 * drop the first type in an array
 *
 * example use cases
 * - reference all parameters except first in typescript
 *
 * ref
 * - https://stackoverflow.com/questions/63024617/how-to-reference-all-parameters-except-first-in-typescript
 */
export type DropFirst<T extends unknown[]> = T extends [any, ...(infer U)] ? U : never;
