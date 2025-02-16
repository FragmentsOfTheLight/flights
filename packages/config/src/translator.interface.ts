export interface Translator {
  dictionary: {[key: string]: string}
  clear(): void
  load(key: string): boolean
  loadAsync(key: string): Promise<boolean>
  get(key: string): string
  hasKey(): boolean
}