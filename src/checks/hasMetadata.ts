/**
 * these are the keys most commonly used metadata keys
 */
type TypicalMetadataKeys = 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'effectiveAt';

/**
 * assets that any optional metadata keys of the object will now be required
 *
 * by default, the following keys are considered to be metadata:
 * - `id`
 * - `uuid`
 * - `createdAt`
 * - `updatedAt`
 * - `effectiveAt`
 *
 * note:
 * - this type does not make any other optional, non-metadata keys required
 *   - i.e., any optional types on the object that are not specified as metadata keys will not be made required
 * - this type does not _add_ any database-generated properties to the type definition
 *   - i.e., if a metadata key was not already present on the object's type - it will not be added
 */
export type HasMetadata<T extends Record<string, any>, MetadataKeys = TypicalMetadataKeys> = T &
  // require all keys
  Required<
    Pick<
      T,
      keyof T & // that are on the object
        MetadataKeys // and are metadata keys
    >
  >;
