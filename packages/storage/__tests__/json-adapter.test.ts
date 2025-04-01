'use strict'

import { JsonStorageAdapter } from "../src/adapters/json.adapter"

describe('JsonStorageAdapter', () => {

  const jsonStorageAdapter = new JsonStorageAdapter()
  test('read', () => {
    const data = jsonStorageAdapter.read(__dirname + '/data/test.json')
    console.log(data)
    expect(data).not.toBe({})
  })

  test('write', () => {
    const filePath = __dirname + '/data/test-write.json'
    const data = {
      connection: 'mysql',
      database: 'admin'
    }
    jsonStorageAdapter.write(filePath, data)
    const readData = jsonStorageAdapter.read(filePath)
    expect(data).toStrictEqual(readData)
  })
})
