import { getClassMetadata, mergeClassMetadata } from '@flights/core/metadata'
import { MetadataKeyTypes } from '../enums/metadata.keys'
import { ModelMetadata } from '../metadata/model.metadata'

export function Errors(): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    Object.defineProperty(target, propertyKey, {
      set(value: {}) {
        this.$e = value
      },
      get() {
        return this.$e
      },
      enumerable: true,
      configurable: false,
    })
    mergeClassMetadata(
      MetadataKeyTypes.MODEL_METADATA,
      new ModelMetadata({
        errors: true,
      }),
      target,
    )
  }
}
