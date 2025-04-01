'use strict'

import { TsStorageAdapter } from "../src/adapters/ts.adapter"

describe('TsStorageAdapter', () => {

  const tsStorageAdapter = new TsStorageAdapter()
  test('read', () => {
    const data = tsStorageAdapter.read(__dirname + '/data/test.ts')
    console.log(data)
    expect(data).not.toBe({})
  })

  test('write', () => {
    const filePath = __dirname + '/data/test-write.ts'
    const data = {
      connection: 'mysql',
      database: 'admin'
    }
    tsStorageAdapter.write(filePath, data)
    const readData = tsStorageAdapter.read(filePath)
    expect(data).toStrictEqual(readData)
  })
})
