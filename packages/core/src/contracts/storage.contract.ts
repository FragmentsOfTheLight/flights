export interface StorageAdapter {
  read(key: string): any
  append(key: string, data: any): void
  write(key: string, data: any): void
  delete(key: string): void
  readAsync(key: string): any
  appendAsync(key: string, data: any): void
  writeAsync(key: string, data: any): void
  deleteAsync(key: string): void
}
