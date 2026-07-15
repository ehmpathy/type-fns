/**
 * makes the listed key(s) `K` of `T` optional — the make-maybe companion of the
 * make-required (`HasMetadata`) / omit (`OmitMetadata`) trio.
 *
 * use when a value's key is authored without it, then bound at a later
 * lifecycle stage (e.g. a domain key like `exid` known only at activation).
 *
 * for example, `HasMaybe<{ role: string; exid: string }, 'exid'>` produces
 * `{ role: string; exid?: string }`.
 *
 * note:
 * - this type preserves all non-`K` keys exactly (required keys stay required)
 * - this type only loosens the listed `K` — it does not add keys and does not
 *   touch any key outside `K`
 * - `K extends keyof T` — a key not on `T` is a compile error
 */
// biome-ignore lint/suspicious/noExplicitAny: generic constraint requires any for flexibility
export type HasMaybe<T extends Record<string, any>, K extends keyof T> = Omit<
  T,
  K
> &
  Partial<Pick<T, K>>;
