'use strict'

import { JsStorageAdapter } from '../src/adapters'

describe('JsStorageAdapter', () => {
  const jsStorageAdapter = new JsStorageAdapter()
  test('read', () => {
    const data = jsStorageAdapter.read(__dirname + '/data/test.js')
    console.log(data)
    expect(data).not.toBe({})
  })

  test('write', () => {
    const filePath = __dirname + '/data/test-write.js'
    const data = {
      connection: 'mysql',
      database: 'admin',
    }
    jsStorageAdapter.write(filePath, data)
    const readData = jsStorageAdapter.read(filePath)
    expect(data).toStrictEqual(readData)
  })
})
