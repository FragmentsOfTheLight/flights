import { AdapterFactory } from '@lights/core'
import { StorageAdapter } from '@lights/core/contracts'
import {
  JsonStorageAdapter,
  JsStorageAdapter,
  TsStorageAdapter,
  YamlStorageAdapter,
} from './adapters'

export class StorageAdapterFactory implements AdapterFactory {
  private _instances: { [key: string]: Object }

  constructor() {
    this._instances = {
      js: new JsStorageAdapter(),
      ts: new TsStorageAdapter(),
      json: new JsonStorageAdapter(),
      yaml: new YamlStorageAdapter(),
    }
  }

  get instances() {
    return this._instances
  }

  hasInstance(type: string): boolean {
    if (type in this._instances) {
      return true
    }
    return false
  }

  getInstance(type: string): StorageAdapter {
    throw new Error('Method not implemented.')
  }
}
