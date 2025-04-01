'use strict'

import { Field, Model, Collection } from '../src'
import { ModelManager } from '../src'
import { RestApiRepository } from '@flights/data'
import { Nested } from '../src/decorator/nested.decorators'

@Model()
export class Product {
  @Field({ visible: false, editable: false })
  id?: number

  @Field()
  product_category_id?: number

  @Field({ searchable: true })
  name?: string

  @Field()
  price?: string

  @Field()
  discount?: string

  @Field({ visible: false })
  status?: boolean

  @Field({ visible: false })
  cover?: any

  @Field({ visible: false })
  gallery?: any
}

@Model('product_category', {
  routes: {
    fetch: 'products/categories',
    create: 'products/categories',
    find: 'products/categories/:id',
    delete: 'products/categories/:id',
    update: 'products/categories/:id',
  },
})
export class ProductCategory {
  @Field({ visible: false, editable: false })
  id?: number

  @Field({ searchable: true })
  name?: string

  @Field({ visible: false })
  status?: boolean

  @Field({ visible: false })
  cover?: any

  @Nested(data => {
    return new Collection(Product, data)
  })
  @Field({ visible: false, editable: false })
  products?: Collection<Product>
}

describe('ModelManagerNested', () => {
  const repo = new RestApiRepository('http://localhost:8000/api/')
  const manager = new ModelManager(repo)

  // it('test.todo')
  test('nested', async () => {
    const categoryCollection = new Collection(ProductCategory)
    await manager.fetch(categoryCollection)

    console.log(categoryCollection.items)
    categoryCollection.items.forEach(category => {
      console.log(category.products)
    })
  })
})
