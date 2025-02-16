/**
 * Repository pattern separates the data access logic and maps it to the business entities in the business logic.
 */

export interface Repository {
  fetch<T>(address: string, options?: any): Promise<RepositoryResult<T>>
  find<T>(
    address: string,
    identifier: number | string,
    options?: any,
  ): Promise<RepositoryResult<T>>
  add<T, M>(
    address: string,
    data: M,
    options?: any,
  ): Promise<RepositoryResult<T>>
  save<T, M>(
    address: string,
    identifier: number | string,
    data: M,
    options?: any,
  ): Promise<RepositoryResult<T>>
  delete<T>(
    address: string,
    identifier: number | string,
    options?: any,
  ): Promise<RepositoryResult<T>>
  uploadFile<T>(
    address: string,
    data: RepositoryUploadData | RepositoryUploadData[],
    options?: any,
  ): Promise<RepositoryResult<T>>
  deleteFile<T>(
    address: string,
    identifier: number | string,
    options?: any,
  ): Promise<RepositoryResult<T>>
}

export interface RepositoryUploadData {
  key: string
  file: File
}

export interface RepositoryResult<T> {
  status: boolean
  statusCode: number
  url?: string
  method?: string
  data?: T
  message?: string
  errors?: { [key: string]: string }
  meta?: RepositoryResultMeta
}

export interface RepositoryResultMeta {
  page?: RepositoryResultMetaPage
}

export interface RepositoryResultMetaPage {
  first_item: number
  last_item: number
  total_items: number
  current_page: number
  last_page: number
  per_page: number
}
