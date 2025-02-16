import {
  getPropertyMetadata,
  mergePropertyMetadata,
} from '@flights/core/src/metadata'
import { CastMetadata, CastMetadataOptions } from '../metadata'
import { MetadataKeyTypes } from '../enums'

export function Cast(castOptions: CastMetadataOptions): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    mergePropertyMetadata(
      MetadataKeyTypes.CAST_METADATA,
      new CastMetadata({
        get: castOptions.get,
        set: castOptions.set,
        access: castOptions.access,
        mutate: castOptions.mutate,
      }),
      target,
      propertyKey,
    )
  }
}
