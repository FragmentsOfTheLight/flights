'use strict'

import { Mapping } from '@flights/core/contracts'
import { ObjectSerializer } from '../src'

describe('ObjectSerializer', () => {
  class PCType implements Mapping {
    cpu: number = 0
    memory: number = 0
    name: string = 'pc'
  }
  class Student implements Mapping {
    name: string = ''
    pc: PCType = new PCType()
  }

  const objectSerializer = new ObjectSerializer(new Student())

  test('serialize', () => {
    const result = objectSerializer.serializeSync({
      name: 'ali',
      pc: {
        cpu: 16,
        name: 'pc01',
      },
    })
    console.log(result)
  })
  test('deserialize', () => {})
})
