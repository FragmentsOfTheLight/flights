'use strict'

import { MemoryContainer } from '../src'
import {
  ContainerBinding,
  ContainerInstanceAccess,
  ContainerInstancePriority,
  ContainerObserver,
} from '@flights/core/contracts'

describe('MemoryContainer', () => {
  class TestService {
    name: string
    id: number
    constructor(name: string, id: number) {
      this.name = name
      this.id = id
    }
  }

  const container = new MemoryContainer()

  test('observer', () => {
    const observer = class implements ContainerObserver {
      beforeBind(
        container: MemoryContainer,
        key: string,
        binding: ContainerBinding,
      ): boolean {
        expect(key).toBe('app')
        return false
      }
      bound(
        container: MemoryContainer,
        key: string,
        binding: ContainerBinding,
      ): void {
        throw new Error('Method not implemented.')
      }
      beforeCreate(
        container: MemoryContainer,
        key: string,
        binding: ContainerBinding,
      ): boolean {
        return true
      }
      created(
        container: MemoryContainer,
        key: string,
        binding: ContainerBinding,
        object: any,
      ): void {
        throw new Error('Method not implemented.')
      }
    }
    const myObserver = new observer()
    container.registerObserver(myObserver)
    container.bind('app', {
      access: ContainerInstanceAccess.UNIQUE,
      priority: ContainerInstancePriority.HIGH,
      declaration: () => {
        return 'flights App'
      },
    })
    expect(container.hasBinding('app')).toBe(false)
    container.unregisterObserver(myObserver)
  })

  test('bind', () => {
    container.bind('app', {
      access: ContainerInstanceAccess.SINGLETON,
      priority: ContainerInstancePriority.HIGH,
      declaration: () => {
        return new TestService('main service', 5)
      },
    })
    console.log(container.bindings)
    expect(container.hasBinding('app')).toBe(true)
    expect(container.hasBinding('appClone')).toBe(false)

    const app = container.instance<TestService>('app')
    const app2 = container.instance<TestService>('app')
    app2.name = 'updated service'
    expect(app.name).toBe('updated service')

    const runtimeApp = container.instance<TestService>(
      'runtime',
      {
        access: ContainerInstanceAccess.SINGLETON,
        priority: ContainerInstancePriority.HIGH,
        declaration: () => {
          return new TestService('runtime', 3)
        },
      },
      true,
    )
    const runtimeApp2 = container.instance<TestService>('runtime')
    runtimeApp2.name = 'same runtime'
    console.log(container.instances('app'))
    expect(runtimeApp.name).toBe('same runtime')
  })

  test('params', () => {
    container.bind('app', {
      access: ContainerInstanceAccess.SINGLETON,
      priority: ContainerInstancePriority.HIGH,
      declaration: TestService,
      params: ['my name is ok', 5],
    })
    expect(container.hasBinding('app')).toBe(true)
    expect(container.hasBinding('appClone')).toBe(false)

    const app = container.instance<TestService>('app')
    console.log(app)
    const app2 = container.instance<TestService>('app')
    app2.name = 'updated service'
    expect(app2.name).toBe('updated service')
  })

  test('global', () => {})
})
