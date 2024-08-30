/**
 * the shape of an empty object
 *
 * usecase
 * - the type `{}` unfortunately actually means "anything not null and not undefined" in typescript
 * - this exposes a type that represents a literal Empty object
 */
export type Empty = Record<string, never>;
