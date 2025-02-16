import { Buildable, Clonable, Composition } from "packages/core";

export interface TranslationModel {
  [key: string]: string|TranslationModel
}

export interface Translator extends Clonable, Buildable, Composition {
  all(): TranslationModel
  get(key: string): string|TranslationModel
  has(key: string): boolean
  load(key: string): void
  loadAsync(key: string): Promise<void>
  save(key: string): void
  saveAsync(key: string): Promise<void>
  append(data: TranslationModel): void
  appendAsync(data: TranslationModel): Promise<void>
  remove(key: string): void
  removeAsync(key: string): Promise<void>
  clear(): void
}