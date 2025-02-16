import {
  Mapping,
  MessageBus,
  MessageType,
  Serializer,
} from '@lights/core/contracts'
import { Constructor, DecoratorBase } from '@lights/core'
import {
  InvalidKeySerializerError,
  InvalidTypeSerializerError,
  RequiredKeySerializerError,
} from '../errors'

export type SerializableObject = { [key: string]: any }

export class ObjectSerializer<M>
  implements Serializer<SerializableObject, M>, DecoratorBase
{
  private messageBus?: MessageBus
  private _mapping: any

  constructor(mapping: M) {
    this._mapping = mapping
  }

  setMessageBus(messageBus: MessageBus) {
    this.messageBus = messageBus
  }

  get messages() {
    return this.messageBus
  }

  validate(data: SerializableObject): boolean {
    try {
      this.validateOrFail(data)
      return true
    } catch (e: any) {
      this.messageBus?.addMessage({
        type: MessageType.ERROR,
        message: e.message,
      })
      return false
    }
  }
  validateOrFail(data: SerializableObject, mapping?: any): void {
    if (!mapping) {
      mapping = this._mapping
    }
    for (const key in mapping) {
      if (key in data) {
        if (data[key] instanceof Object) {
          this.validateOrFail(data[key], mapping[key])
          continue
        }
        if (typeof mapping[key] !== typeof data[key]) {
          throw new InvalidTypeSerializerError(
            key,
            typeof mapping[key],
            typeof data[key],
          )
        }
      }
    }
  }

  serializeSync(data: SerializableObject, mapping?: { [key: string]: any }): M {
    this.validateOrFail(data)
    if (!mapping) {
      mapping = this._mapping
    }
    const target = Object.assign(Object.create(mapping ?? {}), mapping)
    for (const key in data) {
      if (data[key] instanceof Object) {
        target[key] = this.serializeSync(data[key], mapping?.[key])
      } else {
        target[key] = data[key]
      }
    }
    return target as M
  }

  deserializeSync(data: M): SerializableObject {
    throw new Error('Method not implemented.')
  }

  async serialize(data: SerializableObject): Promise<M> {
    return this.serialize(data)
  }
  async deserialize(data: M): Promise<SerializableObject> {
    return this.deserialize(data)
  }
}
