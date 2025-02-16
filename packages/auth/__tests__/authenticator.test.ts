'use strict'

import { RestApiAuthenticator } from '../src'
import { JsonStorageAdapter } from '@lights/storage/src/adapters/json.adapter'

describe('Authenticator', () => {
  const authenticator = new RestApiAuthenticator(
    'http://localhost:8000/oauth/token',
    'http://localhost:8000/api/users/self',
    'http://localhost:8000/api/users/self',
    1,
    'ObZjF9FmflCvVvy7XpSJytoo56g946rn707XdX5s',
  )

  test('export', async () => {
    const storageAdapter = new JsonStorageAdapter()
    const storageKey = __dirname + '/data/auth-data.json'
    const result = await authenticator.getToken('admin@jelveh.com', 'admin')
    expect(result.token).toBeDefined()
    await authenticator.export(storageAdapter, storageKey)
  })

  test('import', async () => {
    const storageAdapter = new JsonStorageAdapter()
    const storageKey = __dirname + '/data/auth-data.json'
    await authenticator.import(storageAdapter, storageKey)
    console.log(authenticator)
    expect(authenticator.isValid).toBe(true)
  })

  test('sync', async () => {
    const storageAdapter = new JsonStorageAdapter()
    const storageKey = __dirname + '/data/auth-data.json'
    authenticator.sync(storageAdapter, storageKey)
    console.log(authenticator)
    expect(authenticator.isValid).toBe(true)
    await authenticator.getToken('admin@jelveh.com', 'admin')
  })

  test('token', async () => {
    const result = await authenticator.getToken('admin@jelveh.com', 'admin')
    console.log(result)
    expect(result.token).toBeDefined()
  })

  test('refreshToken', async () => {
    const result = await authenticator.getToken('admin@jelveh.com', 'admin')
    console.log(result)
    const refResult = await authenticator.refreshToken()
    console.log(refResult)
    expect(refResult.token).toBeDefined()
  })
})
