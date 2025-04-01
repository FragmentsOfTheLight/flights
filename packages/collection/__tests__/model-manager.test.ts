'use strict'

import { ModelCast, ModelValidation } from '@flights/core/contracts'
import {
  Cast,
  Errors,
  Field,
  Model,
  Validation,
  History,
  Collection,
  Widget,
} from '../src'
import { ModelManager } from '../src/model-manager'
import { RestApiRepository } from '@flights/data'

const multiplyCast: ModelCast<User> = {
  get: (model, key, value) => {
    return value * 2
  },
}

const emailValidator: ModelValidation<User> = {
  validator: (model, key, value) => {
    return {
      status: value.includes('@'),
      messages: `email address is not valid in ${String(key)} property`,
    }
  },
}

@Model()
class User {
  @Field()
  public id?: number

  @Widget({ type: 'text', size: 12, label: 'Your name' })
  @Field({
    searchable: true,
  })
  public name?: string

  @Field()
  @Validation(emailValidator)
  public email?: string

  @Field({ visible: false })
  public password?: string

  @Field()
  @Cast(multiplyCast)
  public age?: number

  @History()
  public history?: []

  @Errors()
  public errors?: { [key in keyof User]: [] }

  constructor(name?: string) {
    this.name = name
  }
}

@Model('product_category', {
  routes: {
    fetch: 'products/categories',
  },
})
export class ProductCategory {
  @Field({ visible: false, editable: false })
  id?: number

  @Widget({ label: 'نام دسته بندی', type: 'text', size: 12 })
  @Field({ searchable: true })
  name?: string
}

describe('ModelManager', () => {
  const repo = new RestApiRepository('http://localhost:8000/api/')
  const manager = new ModelManager(repo)

  // it('test.todo')
  test('find', async () => {
    const testUser = new User('test user')

    const result = await manager.find(testUser, 2)
    console.log(testUser)
  })

  test('fetch', async () => {
    const testCollection = new Collection(User, [
      new User('reza'),
      {
        name: 'saeed',
      },
      {
        name: 'mohammad',
      },
    ])
    expect(testCollection.size).toBe(3)
    // await manager.fetch(testCollection)
    const categories = new Collection(ProductCategory)
    await manager.fetch(categories)
    console.log(categories.items)
  })

  test('file', async () => {
    const testUser = new ProductCategory()
    const result = await manager.add(testUser)
    console.log(testUser)
  })

  test('add', async () => {
    const testUser = new User('test user')
    testUser.email = 'asghar@gmail.com'
    testUser.password = '123456'
    const result = await manager.add(testUser)
    console.log(testUser)
  })

  test('save', async () => {
    const testUser = new User()
    await manager.find(testUser, 6)
    testUser.name = 'updated name'
    await manager.save(testUser)
    expect(testUser.name).toBe('updated name')
    testUser.name = 'my name'
    await manager.save(testUser)
    expect(testUser.name).toBe('my name')
  })

  test('delete', async () => {
    const testUser = new User()
    await manager.find(testUser, 8)
    console.log(testUser)
    await manager.delete(testUser)
    console.log(testUser)
  })

  test('props', async () => {
    const testUser = new User('test user')
    const result = manager.getVisibleProperties(User)
    console.log(result)
  })
})
