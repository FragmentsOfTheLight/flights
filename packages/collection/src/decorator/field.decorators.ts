import { isString, isUndefined } from '@lights/core'
import {
  getClassMetadata,
  getPropertyMetadata,
  mergePropertyMetadata,
} from '@lights/core/src/metadata'
import {
  FieldMetadata,
  FieldMetadataOptions,
  CastMetadata,
  ValidationMetadata,
  ModelMetadata,
} from '../metadata'
import { MetadataKeyTypes } from '../enums'
import _, { toLower } from 'lodash'

export function Field(
  nameOrOptions?: FieldMetadataOptions | string,
  maybeOptions?: FieldMetadataOptions,
): PropertyDecorator {
  const options: FieldMetadataOptions = isUndefined(nameOrOptions)
    ? {}
    : isString(nameOrOptions)
    ? isUndefined(maybeOptions)
      ? ({
          name: nameOrOptions as string,
        } as FieldMetadataOptions)
      : (maybeOptions as FieldMetadataOptions)
    : (nameOrOptions as FieldMetadataOptions)

  return function (target: object, propertyKey: string | symbol) {
    if (isUndefined(options.name)) {
      options.name = toLower(String(propertyKey))
    }

    Object.defineProperty(target, propertyKey, {
      set(value) {
        const modelMetadata = getClassMetadata<ModelMetadata>(
          MetadataKeyTypes.MODEL_METADATA,
          target,
        )
        // Apply validation
        const validation = getPropertyMetadata<ValidationMetadata>(
          MetadataKeyTypes.VALIDATION_METADATA,
          target,
          propertyKey,
        )
        if (validation && validation.validator) {
          const validated = validation.validator(
            target,
            propertyKey,
            value,
            this.$ ? this.$[propertyKey] : undefined,
            validation,
          )
          if (!validated.status) {
            if (modelMetadata.errors) {
              try {
                this.$e[propertyKey].push(validated.messages)
              } catch (e) {
                this.$e = {
                  [propertyKey]: [validated.messages],
                }
              }
            }
            if (validation.restrict) {
              return
            }
          } else {
            if (modelMetadata.errors) {
              try {
                delete this.$e[propertyKey]
              } catch (e) {}
            }
          }
        }
        // Apply casts
        const cast = getPropertyMetadata<CastMetadata>(
          MetadataKeyTypes.CAST_METADATA,
          target,
          propertyKey,
        )
        if (cast && cast.set) {
          value = cast.set(this, propertyKey, value)
        }
        // this._onPropertyChanged()
        try {
          this.$[propertyKey] = value
        } catch (e) {
          this.$ = {
            [propertyKey]: value,
          }
        }
      },
      get() {
        const cast = getPropertyMetadata<CastMetadata>(
          MetadataKeyTypes.CAST_METADATA,
          target,
          propertyKey,
        )
        if (cast && cast.get) {
          return cast.get(this, propertyKey, this.$[propertyKey] ?? undefined)
        }
        try {
          return this.$[propertyKey] ?? undefined
        } catch (e) {
          return undefined
        }
      },
      enumerable: true,
      configurable: false,
    })
    mergePropertyMetadata(
      MetadataKeyTypes.FIELD_METADATA,
      new FieldMetadata({
        name: options.name ?? '',
        visible: options.visible ?? true,
        searchable: options.searchable ?? false,
        editable: options.editable ?? true,
        bulkEditable: options.bulkEditable ?? false,
        sortable: options.sortable ?? false,
      }),
      target,
      propertyKey,
    )
  }
}
