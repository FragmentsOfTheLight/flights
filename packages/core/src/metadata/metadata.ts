import 'reflect-metadata'

export function defineClassMetadata<Metadata>(key: string, metadata: Metadata, target:object) {
  Reflect.defineMetadata(key, metadata, target)
}

export function definePropertyMetadata<Metadata>(key: string, metadata: Metadata, target:object, propertyKey:string|symbol) {
  Reflect.defineMetadata(key, metadata, target, propertyKey)
}

export function mergeClassMetadata<Metadata>(key: string, metadata: Metadata, target:object) {
  const value = Reflect.getMetadata(key, target)
  Reflect.defineMetadata(key, {...value, ...metadata}, target)
}

export function mergePropertyMetadata<Metadata>(key: string, metadata: Metadata, target:object, propertyKey:string|symbol) {
  const value = Reflect.getMetadata(key, target, propertyKey)
  Reflect.defineMetadata(key, {...value, ...metadata}, target, propertyKey)
}

export function getClassMetadata<Metadata>(key: string, target: object) : Metadata {
  const value = Reflect.getMetadata(key, target)
  return {...value} as Metadata
}

export function getPropertyMetadata<Metadata>(key: string, target: object, propertyKey:string|symbol) : Metadata {
  const value = Reflect.getMetadata(key, target, propertyKey)
  return {...value} as Metadata
}

export function clearClassMetadata<Metadata>(key: string, target: object) {
  Reflect.deleteMetadata(key, target)
}

export function clearPropertyMetadata<Metadata>(key: string, target: object, propertyKey:string|symbol) {
  Reflect.deleteMetadata(key, target, propertyKey)
}
