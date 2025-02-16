'use strict'

import { rGlobal } from '@flights/core'
import {
  ContainerInstanceAccess,
  ContainerInstancePriority,
} from '@flights/core/src/contracts'
import { MemoryContainer } from '../src'

describe('Globals', () => {
  test('state', () => {
    rGlobal().services['container'] = new MemoryContainer()

    rGlobal().services['container'].bind('app', {
      access: ContainerInstanceAccess.SINGLETON,
      priority: ContainerInstancePriority.HIGH,
      declaration: () => 'my name variable is in global container',
    })

    const instance = rGlobal().services['container'].instance('app')
    console.log(instance)
  })
})
