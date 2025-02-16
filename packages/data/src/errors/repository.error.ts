import { BaseError, RepositoryResult } from '@flights/core'
import { AxiosResponse } from 'axios'

export class RepositoryError<T> extends BaseError {
  result: RepositoryResult<T>

  constructor(message: string, result: RepositoryResult<T>) {
    super('Repository error: ' + message)
    this.result = result
  }
}

export class RequestFailureRepositoryError<T> extends RepositoryError<T> {
  response: AxiosResponse

  constructor(result: RepositoryResult<T>, response: AxiosResponse) {
    super('Request error!', result)
    this.response = response
  }
}
