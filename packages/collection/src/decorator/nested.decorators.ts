import { mergePropertyMetadata } from '@flights/core/src/metadata'
import { MetadataKeyTypes } from '../enums'
import { NestedMetadata, NestedMetadataOptions } from '../metadata'

export function Nested<T>(nest: NestedMetadataOptions<T>): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    mergePropertyMetadata(
      MetadataKeyTypes.NESTED_METADATA,
      new NestedMetadata({
        nest: nest,
      }),
      target,
      propertyKey,
    )
  }
}
