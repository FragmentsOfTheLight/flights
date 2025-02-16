'use strict'

import { MemoryMessageBus } from '../src'
import {
  Message,
  MessageBusObserver,
  MessageType,
} from '@lights/core/contracts'

describe('Message Bus', () => {
  // it('test.todo')
  test('Memory Bus', async () => {
    const messageBus = new MemoryMessageBus()
    const mock1 = jest.fn(),
      mock2 = jest.fn()
    // Universal message observer
    const observer1 = <MessageBusObserver>{
      messageAdded(message: Message) {
        mock1()
      },
    }
    // Typed message observer
    const observer2 = <MessageBusObserver>{
      type: MessageType.WARN,
      messageAdded(message: Message) {
        expect(message.type).toBe(MessageType.WARN)
        mock2()
      },
    }
    messageBus.registerObserver(observer1)
    messageBus.registerObserver(observer2)
    await messageBus.addMessage({ message: 'Hello', type: MessageType.INFO })
    await messageBus.addMessage({ message: 'Warning', type: MessageType.WARN })
    expect(mock1).toBeCalledTimes(2)
    expect(mock2).toBeCalledTimes(1)
  })
})
