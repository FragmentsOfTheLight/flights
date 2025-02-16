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
} from '../src'

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

@Model({ name: 'saeed', identifier: 'id' })
class User {
  @Field('name')
  public name?: string

  @Field('email')
  @Validation(emailValidator)
  public email?: string

  @Field('age')
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

describe('Collection', () => {
  // it('test.todo')
  test('state', () => {
    const collection = new Collection(User)
    collection.append([
      new User('reza'),
      {
        name: 'saeed',
      },
      {
        name: 'mohammad',
      },
    ])
    console.log(collection)
    expect(collection.size).toBe(3)
  })
})
