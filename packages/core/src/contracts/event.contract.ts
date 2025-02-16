export enum MessageType {
  INFO,
  DEBUG,
  WARN,
  ERROR,
}

export interface Message {
  type: MessageType
  message: string
  timestamp?: number
}

export interface MessageBusObserver {
  type?: MessageType
  messageAdded(message: Message): void
}

export interface MessageBus {
  messages: Message[]
  addMessage(message: Message): Promise<void>
  popMessage(): Message
  hasMessage(): boolean
  clear(): Promise<void>
}
