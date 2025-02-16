'use strict'

import { LocalStorageAdapter } from '../src'

describe('LocalStorageStorageAdapter', () => {
  const storageAdapter = new LocalStorageAdapter()
  test('write', () => {
    const data = {
      connection: 'mysql',
      database: 'admin',
    }
    storageAdapter.write('connection', data)
    const readData = storageAdapter.read('connection')
    expect(data).toStrictEqual(readData)
  })
  test('read', () => {
    const data = storageAdapter.read('mykey')
    console.log(data)
    expect(data).not.toBe({})
  })
})
