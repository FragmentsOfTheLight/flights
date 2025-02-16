import { BaseError } from '@lights/core'

export class AuthenticationError extends BaseError {
  constructor(message: string) {
    super(`Authentication Error: ${message}`)
  }
}

export class AuthenticationFailError extends AuthenticationError {
  constructor(response: any) {
    super(`Provided authentication was not correct. Response: ${response}`)
  }
}

export class InvalidAuthenticationError extends AuthenticationError {
  constructor() {
    super(`Provided authentication is invalid or expired.`)
  }
}

export class NotYetAuthenticatedError extends AuthenticationError {
  constructor() {
    super(`No prefetched token found. Please getToken or import before saving.`)
  }
}

export class NoAuthenticationStorageDefinedError extends AuthenticationError {
  constructor() {
    super(
      `No storage adapter defined for authenticator. Set storage on authenticator object to use save and load features.`,
    )
  }
}
