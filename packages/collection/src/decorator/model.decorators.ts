import {
  isString,
  isUndefined,
  Constructor,
  ClassConstructorDecorator,
} from '@flights/core'
import { mergeClassMetadata } from '@flights/core/metadata'
import { MetadataKeyTypes, ModelState } from '../enums'
import { ModelMetadataOptions, ModelMetadata } from '../metadata'
import { lowerCase } from 'lodash'

export function Model(
  nameOrOptions?: string | ModelMetadataOptions,
  maybeOptions?: ModelMetadataOptions,
): ClassConstructorDecorator {
  const options: ModelMetadataOptions = isUndefined(nameOrOptions)
    ? {}
    : isString(nameOrOptions)
    ? isUndefined(maybeOptions)
      ? ({
          name: nameOrOptions as string,
        } as ModelMetadataOptions)
      : (maybeOptions as ModelMetadataOptions)
    : (nameOrOptions as ModelMetadataOptions)

  return function <T extends Constructor>(target: T) {
    if (isUndefined(options.name)) {
      options.name = isUndefined(maybeOptions)
        ? lowerCase(target.name)
        : (nameOrOptions as string)
    }
    mergeClassMetadata<ModelMetadata>(
      MetadataKeyTypes.MODEL_METADATA,
      new ModelMetadata({
        name: options.name,
        identifier: options.identifier ?? 'id',
        routePrefix: options.routePrefix,
        routes: options.routes,
      }),
      target.prototype,
    )

    Object.defineProperty(target.prototype, 'state', {
      get(): ModelState {
        return this.$state ?? 'empty'
      },
      set(v: ModelState) {
        this.$state = v
      },
    })

    // return class extends target {
    //   protected $ = {};
    //   constructor(...args: any[]) {
    //     super(...args)
    //   }
    // }
  }
}
