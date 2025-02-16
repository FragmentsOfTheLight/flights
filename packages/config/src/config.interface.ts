import { Buildable, Clonable } from "packages/core";

export enum ConfigValue {
  string,
  number,
  ConfigModel
}

export interface ConfigModel {
  [key: string]: ConfigValue
}

export interface Config extends Clonable, Buildable{
  data: ConfigModel
  get(key: string): ConfigValue
  has(key: string): boolean
  load(key: string|ConfigModel): void
  save(key: string): void
  append(data: ConfigModel): void
  remove(key: string): void
  clear(): void
}