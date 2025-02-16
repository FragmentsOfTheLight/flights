import { BaseError } from '@lights/core'

export class MessageBusError extends BaseError {
  constructor(message: string) {
    super(`message bus error. ${message}`)
  }
}

export class EmptyMessageBusError extends MessageBusError {
  constructor() {
    super(`attempt to pop from empty message bus.`)
  }
}
