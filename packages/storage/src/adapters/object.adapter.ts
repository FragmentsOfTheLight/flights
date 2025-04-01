import { StorageAdapter } from '@flights/core/contracts'
import { DecoratorBase } from '@flights/core'
import { merge } from 'lodash'

export class ObjectStorageAdapter implements StorageAdapter, DecoratorBase {

  _data: any = {}

  get data () {
    return this._data
  }

  append(key: string, data: any): void {
    const oldData = this._data[key]
    if (oldData) {
      if (oldData instanceof Array) {
        oldData.push(data)
      } else if (oldData instanceof Object) {
        merge(oldData, data)
      }
      this.write(key, oldData)
    } else {
      this.write(key, data)
    }

  }

  async appendAsync(key: string, data: any): Promise<void> {
    return this.append(key, data)
  }

  read(key: string): any {
    return this._data[key] ?? null
  }

  async readAsync(key: string): Promise<void> {
    return this.read(key)
  }

  write(key: string, data: any): void {
    this._data[key] = data
  }

  async writeAsync(key: string, data: any): Promise<void> {
    return this.write(key, data)
  }

  delete(key: string): void {
    if (this._data[key]) {
      delete this._data[key]
    }
  }
  async deleteAsync(key: string): Promise<void> {
    this.delete(key)
  }
}
