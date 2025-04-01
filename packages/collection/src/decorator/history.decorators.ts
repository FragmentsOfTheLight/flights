import { mergeClassMetadata } from '@flights/core/metadata'
import { MetadataKeyTypes } from '../enums/metadata.keys'
import { ModelMetadata } from '../metadata/model.metadata'

export function History(): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    Object.defineProperty(target, propertyKey, {
      set(value: {}) {
        this.$h = value
      },
      get() {
        return this.$h
      },
      enumerable: true,
      configurable: false,
    })
    mergeClassMetadata(
      MetadataKeyTypes.MODEL_METADATA,
      new ModelMetadata({
        history: true,
      }),
      target,
    )
  }
}
