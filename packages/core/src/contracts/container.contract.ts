import { Constructor, Observer } from '@lights/core'

export interface ContainerInterface {
  bindings: { [key: string]: ContainerBinding }
  bind(key: string, binding: ContainerBinding): boolean
  alias(key: string, aliasKey: string): boolean
  getBinding(key: string): ContainerBinding | undefined
  hasBinding(key: string): boolean

  instances<T extends object>(key: string): T[]
  instance<T extends object>(
    key: string,
    binding?: ContainerBinding,
    rememberBind?: boolean,
  ): T
  singleInstance<T>(key: string, binding?: ContainerBinding): T
  removeInstances(key: string, object: object): void
  clearInstances(key: string): void
  lastInstance<T>(key: string): T | undefined
  hasInstance(key: string): boolean
  createInstance<T>(key: string, binding?: ContainerBinding): T | undefined
}

export interface ContainerBinding {
  priority: ContainerInstancePriority
  access: ContainerInstanceAccess
  declaration: Function | Constructor
  params?: any[]
  id?: number
}

export enum ContainerInstancePriority {
  REALTIME,
  HIGH,
  MEDIUM,
  LOW,
  DELAYED,
}

export enum ContainerInstanceAccess {
  SINGLETON,
  UNIQUE,
}

export interface ContainerInstanceCall {
  calledAt: number
  caller: Function
}

export interface ContainerInstance {
  _createdAt: number
  _updatedAt: number
  _object: any
}

export interface ContainerObserver extends Observer {
  beforeBind?(
    container: ContainerInterface,
    key?: string,
    binding?: ContainerBinding,
  ): boolean
  bound?(
    container: ContainerInterface,
    key?: string,
    binding?: ContainerBinding,
  ): void
  beforeCreate?(
    container: ContainerInterface,
    key?: string,
    binding?: ContainerBinding,
  ): boolean
  created?(
    container: ContainerInterface,
    key?: string,
    binding?: ContainerBinding,
    object?: any,
  ): void
}
