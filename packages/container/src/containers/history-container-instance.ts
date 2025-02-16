import { ClonableMixin } from '@lights/core'
import {
  ContainerInstance,
  ContainerInstanceCall,
} from '@lights/core/contracts'

class HistoryContainerInstanceBase {}

export class HistoryContainerInstance
  extends ClonableMixin(HistoryContainerInstanceBase)
  implements ContainerInstance
{
  readonly _createdAt: number
  readonly _updatedAt: number
  readonly _history: ContainerInstanceCall[]
  readonly _object: any

  constructor(object: any) {
    super()
    this._createdAt = Date.now()
    this._updatedAt = Date.now()
    this._history = []
    this._object = object
  }

  get object(): any {
    this._history.push({
      calledAt: Date.now(),
      caller: arguments.callee,
    })
    return this._object
  }
  get history(): ContainerInstanceCall[] {
    return this._history
  }
  get createdAt(): number {
    return this._createdAt
  }
  get updatedAt(): number {
    return this._updatedAt
  }
  get lastUse(): ContainerInstanceCall | undefined {
    if (this._history.length > 0) {
      return this._history[this._history.length - 1]
    }
  }
}
