import {
  ClonableMixin,
  MementoOriginator,
  ObservableMixin,
  isConstructor,
  Constructor,
} from '@lights/core'
import {
  ContainerBinding,
  ContainerInstanceAccess,
  ContainerInterface,
  ContainerObserver,
} from '@lights/core/contracts'
import { ContainerMemento } from '../'
import { ContainerBindKeyNotFound } from './container.errors'

class ContainerBase {}

export class MemoryContainer
  extends ObservableMixin<ContainerObserver>()(ClonableMixin(ContainerBase))
  implements ContainerInterface, MementoOriginator
{
  _bindings: { [key: string]: ContainerBinding }
  _instances: { [key: string]: object[] }

  constructor() {
    super()
    this._bindings = {}
    this._instances = {}
  }

  get bindings() {
    return this._bindings
  }

  bind(key: string, binding: ContainerBinding): boolean {
    const result = this.callChain('beforeBind', this, key, binding)
    if (result) {
      this._bindings[key] = binding
      this.notifyObservers('bound', this, key, binding)
    }
    return result
  }

  alias(key: string, aliasKey: string): boolean {
    const binding = this.getBinding(aliasKey)
    if (binding) {
      this._bindings[key] = binding
      return true
    }
    return false
  }

  getBinding(key: string): ContainerBinding | undefined {
    if (this.hasBinding(key)) {
      return this._bindings[key]
    }
  }

  hasBinding(key: string): boolean {
    return key in this._bindings
  }

  singleInstance<T>(key: string, binding?: ContainerBinding): T {
    throw new Error('Method not implemented.')
  }

  lastInstance<T>(key: string): T | undefined {
    throw new Error('Method not implemented.')
  }

  hasInstance(key: string): boolean {
    return key in this._instances && this._instances[key].length > 0
  }

  exportMemento(): ContainerMemento {
    throw new Error('Method not implemented.')
  }

  importMemento(memento: ContainerMemento): void {
    throw new Error('Method not implemented.')
  }

  instances<T extends object>(key: string): T[] {
    if (!this.hasInstance(key)) {
      return []
    }
    return this._instances[key] as T[]
  }

  instance<T extends object>(
    key: string,
    binding?: ContainerBinding,
    rememberBind?: boolean,
  ): T {
    if (binding === undefined) {
      const savedBinding = this.getBinding(key)
      if (savedBinding !== undefined) {
        binding = savedBinding
      } else {
        throw new ContainerBindKeyNotFound(this as ContainerInterface, key)
      }
    } else {
      if (rememberBind) {
        this.bind(key, binding)
      }
    }
    if (this.hasInstance(key)) {
      if (binding.access === ContainerInstanceAccess.SINGLETON) {
        return this._instances[key][0] as T
      }
    }
    const instance = this.createInstance<T>(key, binding)
    if (instance !== undefined) {
      if (binding.access === ContainerInstanceAccess.SINGLETON) {
        this._instances[key] = [instance]
      } else {
        this._instances[key].push(instance)
      }
    }
    return instance as T
  }

  createInstance<T>(key: string, binding: ContainerBinding): T | undefined {
    if (this._instances[key] === undefined) {
      this._instances[key] = []
    }
    if (isConstructor(binding?.declaration)) {
      if (binding.params !== undefined) {
        return new (binding.declaration.bind(
          null,
          ...binding.params,
        ) as Constructor)() as T
      } else {
        return new (binding.declaration as Constructor)() as T
      }
    } else {
      return (binding.declaration as Function)() as T
    }
    // if(binding?.declaration instanceof Function) {
    //   return binding?.declaration()
    // }else {
    //   return binding?.declaration.constructor.call({}, binding?.params)
    // }
  }

  clearInstances(key: string): void {
    if (this.hasInstance(key)) {
      this._instances[key] = []
    }
  }

  removeInstances(key: string, object: object): void {
    if (this.hasInstance(key)) {
      const index = this._instances[key].indexOf(object)
      if (index > 0) {
        this._instances[key].splice(index, 1)
      }
    }
  }
}
