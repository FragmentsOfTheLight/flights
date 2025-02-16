import { Translator } from "..";
import { StorageAdapter } from "../../storage";

export class StorageTranslator implements Translator {
  protected _dictionary: { [key: string]: string; };
  protected _storageAdapter: StorageAdapter

  constructor(storageAdapter: StorageAdapter) {
    this._dictionary = {}
    this._storageAdapter = storageAdapter
  }
  get dictionary() {
    return this._dictionary
  }
  clear(): void {
    this._dictionary = {}
  }
  load(key: string): boolean {
    this._storageAdapter.read(key)
  }
  async loadAsync(key: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  get(key: string): string {
    throw new Error("Method not implemented.");
  }
  hasKey(): boolean {
    throw new Error("Method not implemented.");
  }
  
  
}