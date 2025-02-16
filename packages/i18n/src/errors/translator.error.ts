import { BaseError } from '@lights/core'

export class TranslatorError extends BaseError {
  constructor(message: string) {
    super(message)
  }
}

export class TranslationKeyNotFoundError extends TranslatorError {
  constructor(key: string, sender = {}) {
    super(
      `key "${key}" not found in translation adapter of type "${typeof sender}"`,
    )
  }
}
