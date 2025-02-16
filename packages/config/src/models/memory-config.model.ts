import { ClonableMixin, CompositionMixin } from '@lights/core'
import { StorageAdapter } from '@lights/core/contracts'
import { Config, ConfigModel, ConfigValue } from '../config.interface'
import { ConfigKeyNotFoundError } from '../errors/config.error'

class ConfigBase {}

export class MemoryConfig
  extends CompositionMixin(ClonableMixin(ConfigBase))
  implements Config
{
  protected _data: ConfigModel
  protected _storageAdapter: StorageAdapter

  constructor(storageAdapter: StorageAdapter) {
    super()
    this._data = {}
    this._storageAdapter = storageAdapter
  }
  get data() {
    return this._data
  }
  get(key: string): ConfigValue {
    if (this.has(key)) {
      return this._data[key]
    }
    throw new ConfigKeyNotFoundError(key, this)
  }
  has(key: string): boolean {
    if (key in this._data) {
      return true
    }
    return false
  }
  load(key: string | ConfigModel): void {
    throw new Error('Method not implemented.')
  }
  save(key: string): void {
    throw new Error('Method not implemented.')
  }
  append(data: ConfigModel): void {
    this._data = { ...data, ...this._data }
  }
  remove(key: string): void {
    if (this.has(key)) {
      delete this._data[key]
    }
    throw new ConfigKeyNotFoundError(key, this)
  }
  clear(): void {
    this._data = {}
  }
}
