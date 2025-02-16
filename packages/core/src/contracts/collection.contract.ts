// eslint-disable-next-line @typescript-eslint/no-empty-interface

export interface Metadata {
  toObject() : {[key: string]: any}
}

export interface Model<T> {
}

export interface Collection<T extends Model<any>> {
  models: T[]
}

export interface ModelCast<T extends Model<any>> {
  get?: ModelCastFunction<T>
  set?: ModelCastFunction<T>
  mutate?: ModelCastFunction<T>
  access?: ModelCastFunction<T>
}

export interface ModelValidation<T extends Model<any>> {
  validator: ModelValidationFunction<T>
  restrict?: boolean
}
export interface ModelValidationResult {
  status: boolean
  messages?: string|string[]
}

export type ModelCastFunction<T extends Model<any>> =
  (model: T, key: string|symbol, value: any, castMetadata?: Metadata) => any

export type ModelValidationFunction<T extends Model<any>> =
  (model: T, key: string|symbol, value: any, oldValue?: any, validationMetadata?: Metadata) => ModelValidationResult
