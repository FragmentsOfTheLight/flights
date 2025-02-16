import { BaseError } from '@flights/core'
import { StorageAdapter } from 'packages/core/src/contracts/storage.contract'

export class StorageError extends BaseError {
  private _container: StorageAdapter
  constructor(container: StorageAdapter, m: string) {
    super(m)
    this._container = container
  }

  get container(): StorageAdapter {
    return this._container
  }
}

export class FileNotFound extends StorageError {
  constructor(storage: StorageAdapter) {
    super(storage, 'File not found')
  }
}
