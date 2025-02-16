import { StorageAdapter } from '@flights/core/contracts'
import { DecoratorBase } from '@flights/core'
import { merge } from 'lodash'

export class LocalStorageAdapter implements StorageAdapter, DecoratorBase {
  append(key: string, data: any): void {
    const read = localStorage.getItem(key)
    if (read !== null) {
      const oldData = JSON.parse(read)
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
    let data: any = null
    try {
      data = localStorage.getItem(key)
    } catch {}
    if (data !== null) {
      return JSON.parse(data)
    }
    return null
  }

  async readAsync(key: string): Promise<void> {
    return this.read(key)
  }

  write(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch {}
  }

  async writeAsync(key: string, data: any): Promise<void> {
    return this.write(key, data)
  }

  delete(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {}
  }
  async deleteAsync(key: string): Promise<void> {
    this.delete(key)
  }
}
