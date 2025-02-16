import { BaseError } from "packages/core";

export class ConfigError extends BaseError {
  constructor(message: string) {
    super(message)
  }
}

export class ConfigKeyNotFoundError extends ConfigError {
  constructor(key: string, sender = {}) {
    super(`key "${key}" not found in config of type "${typeof sender}"`)
  }
}