import { Constructor, Repository } from '@lights/core'

export interface Serializer<F, T> {
  validate(data: F): boolean
  validateOrFail(data: F): void
  serializeSync(data: F): T
  deserializeSync(data: T): F
  serialize(data: F): Promise<T>
  deserialize(data: T): Promise<F>
}

export interface Mutator {
  mutate(value: any): any
}

export interface Mapping {
  [key: string]: any
  validation?(): boolean
}

export interface RepositoryQueryOptions {
  pageNumber?: number
  pageSize?: number
  filters?: RepositoryFilterOptions[]
}

export interface RepositoryFilterOptions {
  name: string
  value: string
  operator?: RepositoryFilterOperator
  relation?: RepositoryFilterRelation
}

export enum RepositoryFilterOperator {
  EQUAL = 'eq:',
  NOT_EQUAL = 'neq:',
  LESS_THAN = 'lt:',
  LESS_OR_EQUAL = 'lte:',
  GREATER_THAN = 'gt:',
  GREATER_OR_EQUAL = 'gte:',
  HAS = 'has:',
  IN = 'in:',
  NOT_IN = 'nin:',
  LIKE = 'like:',
  IS_NULL = 'isnull:',
  IS_NOT_NULL = 'isnotnull:',
}

export enum RepositoryFilterRelation {
  AND = 'and',
  OR = 'or',
}
