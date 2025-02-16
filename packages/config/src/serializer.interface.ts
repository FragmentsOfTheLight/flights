export interface Serializer<T> {
  serialize(data: string): T
  unserialize(data: string): T
}