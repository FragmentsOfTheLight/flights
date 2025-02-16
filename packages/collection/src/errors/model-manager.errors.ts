import { BaseError } from '@flights/core'
import { ModelManagerAction } from '../enums/model-manager.types'

export class ModelManagerError extends BaseError {
  constructor(message: string) {
    super('ModelManager: ' + message)
  }
}

export class ModelActionNotPermittedError extends ModelManagerError {
  constructor(model: object, route: ModelManagerAction) {
    super(`${route} route is not permitted in ${model} model`)
  }
}
