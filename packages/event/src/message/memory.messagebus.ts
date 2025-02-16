import { ObservableMixin } from '@flights/core'
import { Message, MessageBus, MessageBusObserver } from '@flights/core/contracts'
import { EmptyMessageBusError } from '../errors'

class MessageBusBase {}

export class MemoryMessageBus
  extends ObservableMixin<MessageBusObserver>()(MessageBusBase)
  implements MessageBus
{
  _messages: Message[]
  constructor() {
    super()
    this._messages = []
  }
  get messages() {
    return this._messages
  }
  async addMessage(message: Message): Promise<void> {
    message.timestamp = Date.now()
    this._messages.push(message)
    this.notifyObserverList(
      this._observers.filter(
        value => value.type === message.type || value.type === undefined,
      ),
      'messageAdded',
      message,
    )
  }
  popMessage(): Message {
    if (this.hasMessage()) {
      return this._messages.pop() as Message
    } else {
      throw new EmptyMessageBusError()
    }
  }
  hasMessage(): boolean {
    return this._messages.length > 0
  }
  async clear(): Promise<void> {
    this._messages = []
  }
}
