import { Buildable, builder } from 'packages/core'
import { StorageAdapter } from '@lights/core/contracts'
import { Config } from '../config.interface'
import { MemoryConfig } from './memory-config.model'

export class ConfigBuilder implements builder {
  private _adapter: Config
  private _storageAdapter: StorageAdapter

  constructor(defaults = false) {
    if (defaults) {
      this._
      this._adapter = new MemoryConfig()
    }
  }

  adapter(adapter: Config) {
    this._adapter = adapter
  }

  storageAdapter(storageAdapter: StorageAdapter) {
    this._storageAdapter = storageAdapter
  }

  build(): Buildable {
    throw new Error('Method not implemented.')
  }
}
