'use strict'

import { ModelCast, ModelValidation } from '@lights/core/contracts'
import { Cast, Errors, Field, Model, Validation, History } from '../src'

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

  constructor() {
    this.name = 'default name'
  }
}

describe('Model', () => {
  // it('test.todo')
  test('state', () => {
    const m = new User()
    const s = new User()
    // console.log(m.path)
    // m.name = 'saeed'
    m.email = 'google@gmail.com'
    m.email = 'google.gmail.com'
    m.age = 10

    console.log(m)
    expect(m.name).toBe('default name')
    expect(m.age).toBe(20)
    expect(m.errors?.email).toBeDefined()
  })
})
