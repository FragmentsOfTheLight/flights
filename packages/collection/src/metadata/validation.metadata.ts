import { Metadata, ModelValidationFunction } from '@flights/core/src/contracts'

export interface ValidationMetadataOptions {
  validator: ModelValidationFunction<any>
  restrict?: boolean
}

export interface ValidationMetadataArgs {
  validator: ModelValidationFunction<any>
  restrict?: boolean
}

export class ValidationMetadata implements Metadata {
  validator: ModelValidationFunction<any>
  restrict: boolean

  constructor(args: ValidationMetadataArgs) {
    this.validator = args.validator
    this.restrict = args.restrict ?? true
  }

  toObject(): { [p: string]: any } {
    return {
      validator: this.validator,
      restrict: this.restrict,
    }
  }
}
