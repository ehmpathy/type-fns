/**
 * these are the keys most commonly used metadata keys
 */
const typicalMetadataKeys = [
  'id',
  'uuid',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'effectiveAt',
] as const;

/**
 * these are the keys most commonly used metadata keys
 */
type TypicalMetadataKeys = typeof typicalMetadataKeys[number];

/**
 * asserts that any optional metadata keys of the object will now be required
 *
 * by default, the following keys are considered to be metadata:
 * - `id`
 * - `uuid`
 * - `createdAt`
 * - `updatedAt`
 * - `deletedAt`
 * - `effectiveAt`
 *
 * note:
 * - this type does not make any other optional, non-metadata keys required
 *   - i.e., any optional types on the object that are not specified as metadata keys will not be made required
 * - this type does not _add_ any metadata properties to the type definition
 *   - i.e., if a metadata key was not already present on the object's type - it will not be added
 */
export type HasMetadata<
  T extends Record<string, any>,
  MetadataKeys = TypicalMetadataKeys,
> = T &
  // require all keys
  Required<
    Pick<
      T,
      keyof T & // that are on the object
        MetadataKeys // and are metadata keys
    >
  >;

/**
 * asserts that any optional metadata keys of the object will now be omitted
 *
 * by default, the following keys are considered to be metadata:
 * - `id`
 * - `uuid`
 * - `createdAt`
 * - `updatedAt`
 * - `deletedAt`
 * - `effectiveAt`
 */
export type OmitMetadata<
  T extends Record<string, any>,
  MetadataKeys = TypicalMetadataKeys,
> =
  // omit all keys
  Omit<
    T,
    keyof T & // that are on the object
      MetadataKeys // and are metadata keys
  >;

/**
 * for an object of type T, asserts that the object HasMetadata<T, K> for all listed metadata keys K
 *
 * by default, the following keys are considered to be metadata:
 * - `id`
 * - `uuid`
 * - `createdAt`
 * - `updatedAt`
 * - `deletedAt`
 * - `effectiveAt`
 *
 * see more information about the `HasMetadata` type in its jsdoc on-hover documentation
 */
export const hasMetadata = <
  MetadataKeys extends string = TypicalMetadataKeys,
  T extends Record<string, any> = Record<string, any>,
>(
  obj: T,
  keys: MetadataKeys[] = typicalMetadataKeys as any as MetadataKeys[],
): obj is HasMetadata<T, typeof keys[number]> =>
  keys.every((key) => obj[key] !== undefined);
