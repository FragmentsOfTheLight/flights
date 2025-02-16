import { BaseError } from '@lights/core'
import { ContainerInterface } from '@lights/core/contracts'

export class ContainerError extends BaseError {
  private readonly _container: ContainerInterface

  constructor(container: ContainerInterface, m: string) {
    super(m)
    this._container = container
  }

  get container(): ContainerInterface {
    return this._container
  }
}

export class ContainerBindKeyNotFound extends ContainerError {
  constructor(container: ContainerInterface, key: string) {
    super(
      container,
      `Bind key ${key} not found in dependency injection container`,
    )
  }
}
