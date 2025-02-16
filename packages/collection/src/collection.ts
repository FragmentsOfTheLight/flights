/* jshint esversion: 9 */
import _ from 'lodash'
import {
  Constructor,
  copyAvailableProps,
  RepositoryResultMetaPage,
} from '@lights/core'
import { ModelState } from './enums'

export class Collection<T extends { [key: string]: any }> {
  private readonly _modelPrototype: Constructor<T>
  private readonly _indexGap: number
  private _items: Array<T>
  private _state: ModelState
  private _pagination?: RepositoryResultMetaPage

  constructor(
    model: Constructor<T>,
    append?: Array<Collection<T>> | Collection<T> | Array<T> | T,
    indexGap?: number,
  ) {
    this._modelPrototype = model
    this._items = []
    this._indexGap = indexGap ?? 0
    this._state = 'empty'

    if (append) {
      this.append(append)
    }
    this.init()
  }

  get pagination(): RepositoryResultMetaPage {
    return (
      this._pagination ?? {
        first_item: 1,
        current_page: 1,
        last_item: 1,
        last_page: 1,
        per_page: 10,
        total_items: 1,
      }
    )
  }

  set pagination(pagination: RepositoryResultMetaPage) {
    this._pagination = pagination
  }

  get state() {
    return this._state
  }

  set state(state: ModelState) {
    this._state = state
  }

  public init() {
    return
  }

  get items() {
    return this._items
  }

  get isCollection() {
    return true
  }

  get modelPrototype() {
    return this._modelPrototype
  }

  get size(): number {
    return this.items.length
  }

  private appendModel(model: T) {
    if (model instanceof this.modelPrototype) {
      this._items.push(model)
    } else if (model.$ !== undefined) {
      const md = new this._modelPrototype()
      copyAvailableProps(model.$, md)
      this._items.push(md)
    } else {
      const md = new this._modelPrototype()
      copyAvailableProps(model, md)
      this._items.push(md)
    }
  }

  private appendCollection(collection: Collection<T>) {
    collection._items.forEach(item => {
      this.appendModel(item)
    })
  }

  append(
    modelsOrCollections?: Array<Collection<T>> | Collection<T> | Array<T> | T,
  ) {
    if (modelsOrCollections instanceof Array) {
      if (modelsOrCollections.length > 0) {
        if (isCollection(modelsOrCollections[0])) {
          modelsOrCollections.forEach(item =>
            this.appendCollection(item as Collection<T>),
          )
        } else {
          modelsOrCollections.forEach(item => this.appendModel(item as T))
        }
      }
    } else {
      if (isCollection(modelsOrCollections)) {
        this.appendCollection(modelsOrCollections as Collection<T>)
      } else {
        this.appendModel(modelsOrCollections as T)
      }
    }
  }

  private index(index: number | T) {
    return (
      (index instanceof Number
        ? (index as number)
        : this._items.indexOf(index as T)) - this._indexGap
    )
  }

  get(index: number | T) {
    return this.items[this.index(index)]
  }

  pull(index: number | T) {
    return this.items.splice(this.index(index), 1)[0]
  }

  push(index: number | T, item: T) {
    this.items.splice(this.index(index), 0, item)
  }

  swap(firstIndex: number | T, secondIndex: number | T) {
    const movedItem = this.pull(this.index(firstIndex))
    this.push(this.index(secondIndex), movedItem)
  }

  update(index: number | T, item: T) {
    this.items[this.index(index)] = item
  }

  delete(index: number | T) {
    this.items.splice(this.index(index), 1)
  }

  clear() {
    this._items = []
  }

  get pluralModelName() {
    let modelName = new this._modelPrototype().getModelName()
    const split = modelName.split('_')
    let endWord = modelName
    if (split.length > 1) {
      endWord = split[split.length - 1]
    }
    const end = modelName.slice(-1)
    if (end === 'y' && endWord.length > 3) {
      modelName = modelName.slice(0, -1) + 'ie'
    }
    return modelName + 's'
  }
}

export function isCollection(object: any): object is Collection<any> {
  return (<Collection<any>>object)['_items'] !== undefined
}
