import { BaseError } from '@flights/core'

export class SerializerError extends BaseError {
  constructor(message: string) {
    super('serializer error. ' + message)
  }
}

export class InvalidKeySerializerError extends SerializerError {
  constructor(key: string) {
    super(`key "${key}" is not valid.`)
  }
}

export class RequiredKeySerializerError extends SerializerError {
  constructor(key?: string) {
    super(`key "${key}" is required but not available in input data.`)
  }
}

export class InvalidTypeSerializerError extends SerializerError {
  constructor(key: string, required: any, provided: any) {
    super(
      `type of key "${key}" is invalid. required "${required}" but found "${provided}"`,
    )
  }
}
