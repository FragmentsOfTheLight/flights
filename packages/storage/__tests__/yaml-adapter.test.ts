'use strict'

import { YamlStorageAdapter } from "../src/index"

describe('YamlStorageAdapter', () => {
  
  const yamlStorageAdapter = new YamlStorageAdapter()
  test('read', () => {
    const data = yamlStorageAdapter.read(__dirname + '/data/test.yaml')
    console.log(data)
    expect(data).not.toBe({})
  })

  test('write', () => {
    const filePath = __dirname + '/data/test-write.yaml'
    const data = {
      connection: 'mysql',
      database: 'admin'
    }
    yamlStorageAdapter.write(filePath, data)
    const readData = yamlStorageAdapter.read(filePath)
    expect(data).toStrictEqual(readData)
  })
})