import { AdapterFactory } from '@flights/core'
import { StorageAdapter } from '@flights/core/contracts'
import { JsonStorageAdapter } from './adapters/json.adapter'
import { JsStorageAdapter } from './adapters/js.adapter'
import { TsStorageAdapter } from './adapters/ts.adapter'
import { YamlStorageAdapter } from './adapters/yaml.adapter'
import { ObjectStorageAdapter } from './adapters/object.adapter'
import { LocalStorageAdapter } from './adapters/local-storage.adapter'

export class StorageAdapterFactory implements AdapterFactory {
  private _instances: { [key: string]: Object }

  constructor() {
    this._instances = {
      js: new JsStorageAdapter(),
      ts: new TsStorageAdapter(),
      json: new JsonStorageAdapter(),
      yaml: new YamlStorageAdapter(),
      object: new ObjectStorageAdapter(),
      localStorage: new LocalStorageAdapter()
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
