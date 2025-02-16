'use strict'

import { RestApiRepository } from '../src/repository'
import {
  RepositoryFilterOperator,
  RepositoryQueryOptions,
} from '@lights/core/src/contracts'

describe('Repository', () => {
  interface User {
    id?: number
    name?: string
    email?: string
    password?: string
  }
  interface UsersList {
    users: User[]
  }
  interface UserObject {
    user: User
  }
  const repo = new RestApiRepository('http://localhost:8000/api/')

  test('fetch', async () => {
    const options: RepositoryQueryOptions = {
      pageNumber: 1,
      pageSize: 4,
      filters: [
        {
          name: 'name',
          value: 'Mohammad updated',
          operator: RepositoryFilterOperator.EQUAL,
        },
      ],
    }
    const result = await repo.fetch<UsersList>('users', options)
    console.log(result.data?.users)
    expect(result.data?.users[0]?.name).toBe('Mohammad updated')
  })

  test('add', async () => {
    const added = await repo.add<UserObject, User>('users', {
      name: 'Ali',
      email: 'ali@gmail.com',
      password: '123456',
    })
    console.log(added.data?.user, added.errors)
  })

  test('save', async () => {
    const added = await repo.save<UserObject, User>('users', 2, {
      name: 'Mohammad updated',
    })
    console.log(added.data?.user, added.errors)
  })

  test('delete', async () => {
    const added = await repo.delete<UserObject>('users', 4)
    console.log(added.data?.user, added.errors)
  })

  test('find', async () => {
    const added = await repo.find<UserObject>('users', 3)
    console.log(added.data?.user, added.errors)
  })
})
