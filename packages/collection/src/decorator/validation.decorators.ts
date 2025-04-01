import { mergePropertyMetadata } from '@flights/core/metadata'
import { MetadataKeyTypes } from '../enums'
import { ValidationMetadata, ValidationMetadataOptions } from '../metadata'

export function Validation(
  validationOptions: ValidationMetadataOptions,
): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    mergePropertyMetadata(
      MetadataKeyTypes.VALIDATION_METADATA,
      new ValidationMetadata({
        validator: validationOptions.validator,
        restrict: validationOptions.restrict,
      }),
      target,
      propertyKey,
    )
  }
}
