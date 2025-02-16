import { StorageAdapter } from '@flights/core/contracts'
import * as fs from 'fs'
import { DecoratorBase } from '@flights/core'

export class FileStorageAdapter implements StorageAdapter, DecoratorBase {
  read(path: string) {
    const content = fs.readFileSync(path, 'utf-8')
    return content
  }
  append(path: string, data: string | Uint8Array): void {
    fs.appendFileSync(path, data)
  }
  write(path: string, data: string | NodeJS.ArrayBufferView): void {
    fs.writeFileSync(path, data)
  }
  async readAsync(path: string) {
    return await this.read(path)
  }
  async appendAsync(path: string, data: string | Uint8Array): Promise<void> {
    await this.append(path, data)
  }
  async writeAsync(
    path: string,
    data: string | NodeJS.ArrayBufferView,
  ): Promise<void> {
    return this.write(path, data)
  }

  delete(path: string): void {
    fs.unlinkSync(path)
  }

  async deleteAsync(path: string): Promise<void> {
    this.delete(path)
  }
}
