import { SingleDecoratorMixin } from '@flights/core'
import { StorageAdapter } from '@flights/core/contracts'
import { FileStorageAdapter } from './file.adapter'

class TsStorageBase {}

export class JsStorageAdapter
  extends SingleDecoratorMixin(FileStorageAdapter)(TsStorageBase)
  implements StorageAdapter
{
  read<DataType extends Object>(path: string) {
    const tsContent = require(path) as DataType
    return tsContent
  }
  append(path: string, data: string | Object): void {
    if (data instanceof Object) {
      this._decoratorBase.append(path, JSON.stringify(data))
    } else {
      this._decoratorBase.append(path, data)
    }
  }
  write(path: string, data: string | Object): void {
    if (data instanceof Object) {
      this._decoratorBase.write(
        path,
        'module.exports = ' + JSON.stringify(data),
      )
    } else {
      this._decoratorBase.write(path, data)
    }
  }
  async readAsync(path: string) {
    return await this.read(path)
  }
  async appendAsync(path: string, data: string | Object): Promise<void> {
    await this.append(path, data)
  }
  async writeAsync(path: string, data: string | Object): Promise<void> {
    return this.write(path, data)
  }
  delete(path: string): void {
    this._decoratorBase.delete(path)
  }
  async deleteAsync(path: string): Promise<void> {
    this.delete(path)
  }
}
