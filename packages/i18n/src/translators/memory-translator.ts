import { Translator } from '..'
import { StorageAdapter } from '@lights/core/contracts'
import { Clonable, ClonableMixin, CompositionMixin } from 'packages/core'
import { TranslationModel } from '../translator.interface'
import { TranslationKeyNotFoundError } from '../errors/translator.error'
import { Serializer } from '@lights/core/contracts'

class MemoryTranslatorBase {}

export class MemoryTranslator
  extends CompositionMixin(ClonableMixin(MemoryTranslatorBase))
  implements Translator
{
  private _dictionary: TranslationModel
  private _storageAdapter: StorageAdapter
  private _serializer: Serializer<Object, TranslationModel>

  constructor(
    storageAdapter: StorageAdapter,
    serializer: Serializer<Object, TranslationModel>,
  ) {
    super()
    this._dictionary = {}
    this._storageAdapter = storageAdapter
    this._serializer = serializer
  }
  clone(): Clonable {
    throw new Error('Method not implemented.')
  }

  all(): TranslationModel {
    return this._dictionary
  }

  get(key: string): string | TranslationModel {
    if (this.has(key)) {
      return this._dictionary[key]
    }
    throw new TranslationKeyNotFoundError(key, this)
  }
  has(key: string): boolean {
    if (key in this._dictionary) {
      return true
    }
    return false
  }
  load(key: string): void {
    const rawData = this._storageAdapter.read(key)
    const translation = this._serializer.serialize(rawData)
    this.append(translation)
  }
  save(key: string): void {
    const rawData = this._serializer.deserialize(this._dictionary)
    this._storageAdapter.write(key, rawData)
  }
  append(data: TranslationModel): void {
    this._dictionary = { ...this._dictionary, ...data }
  }
  remove(key: string): void {
    if (this.has(key)) {
      delete this._dictionary[key]
    }
    throw new TranslationKeyNotFoundError(key, this)
  }
  clear(): void {
    this._dictionary = {}
  }

  async loadAsync(key: string): Promise<void> {
    await this.load(key)
  }
  async saveAsync(key: string): Promise<void> {
    return await this.save(key)
  }
  async appendAsync(data: TranslationModel): Promise<void> {
    await this.append(data)
  }
  async removeAsync(key: string): Promise<void> {
    await this.remove(key)
  }
}
