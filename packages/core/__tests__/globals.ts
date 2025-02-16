'use strict'

import { rGlobal } from '../src'

class AccessClass {
  name: string
  constructor() {
    this.name = rGlobal().data.name ?? 'default name'
  }
}

describe('Globals', () => {

  test('state', () => {
    rGlobal().data.name = "global name"
    const access = new AccessClass()

    expect(access.name).toBe(rGlobal().data.name)
  })
})
