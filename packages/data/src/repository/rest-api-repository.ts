import {
  ObservableMixin,
  Repository,
  RepositoryResult,
  RepositoryUploadData,
} from '@lights/core'
import axios, { AxiosInstance } from 'axios'
import {
  AuthenticatorObserver,
  RepositoryQueryOptions,
} from '@lights/core/contracts'
import { RequestFailureRepositoryError } from '../errors'

class RestApiRepositoryBase {}
interface RestApiRepositoryObserver {
  error(response: RepositoryResult<any>, status: number): void
}

export class RestApiRepository
  extends ObservableMixin<RestApiRepositoryObserver>()(RestApiRepositoryBase)
  implements Repository
{
  private _baseUrl: string
  private _postfix: string
  private _axios: AxiosInstance

  constructor(baseUrl: string) {
    super()
    this._baseUrl = baseUrl
    this._axios = axios.create()
    this._postfix = ''
  }

  set postfix(postfix: string) {
    this._postfix = postfix
  }
  get postfix() {
    return this._postfix
  }

  set baseUrl(baseUrl: string) {
    this._baseUrl = baseUrl
  }
  get baseUrl() {
    return this._baseUrl
  }

  set axios(axios: AxiosInstance) {
    this._axios = axios
  }
  get axios() {
    return this._axios
  }

  async fetch<T>(
    address?: string,
    options?: RepositoryQueryOptions,
  ): Promise<RepositoryResult<T>> {
    const queryAddress =
      this._baseUrl + (address ?? '') + this.generateQuery(options ?? {})
    try {
      const axiosResult = await this._axios.get<RepositoryResult<T>>(
        queryAddress,
      )
      axiosResult.data.url = axiosResult.config.url
      axiosResult.data.method = axiosResult.config.method
      return axiosResult.data
    } catch (e: any) {
      this.callObservers('error', e.response, e.response.status)
      throw new RequestFailureRepositoryError<T>(
        {
          status: false,
          statusCode: e.response.status,
          message: e.response.statusText,
          url: e.config.url,
          method: e.config.method,
        },
        e.response,
      )
    }
  }

  async add<T, M>(
    address: string,
    data: M,
    options?: RepositoryQueryOptions,
  ): Promise<RepositoryResult<T>> {
    const queryAddress =
      this._baseUrl + (address ?? '') + this.generateQuery(options ?? {})
    try {
      const axiosResult = await this._axios.post<RepositoryResult<T>>(
        queryAddress,
        data,
      )
      axiosResult.data.url = axiosResult.config.url
      axiosResult.data.method = axiosResult.config.method
      return axiosResult.data
    } catch (e: any) {
      this.callObservers('error', e.response, e.response.status)
      throw new RequestFailureRepositoryError<T>(
        {
          status: false,
          statusCode: e.response.status,
          message: e.response.statusText,
          url: e.config.url,
          method: e.config.method,
        },
        e.response,
      )
    }
  }

  async delete<T>(
    address: string,
    identifier: number | string,
    options?: RepositoryQueryOptions,
  ): Promise<RepositoryResult<T>> {
    const queryAddress =
      this._baseUrl +
      (address ?? '').replace(/:id/g, String(identifier)) +
      this.generateQuery(options ?? {})
    try {
      const axiosResult = await this._axios.delete<RepositoryResult<T>>(
        queryAddress,
      )
      axiosResult.data.url = axiosResult.config.url
      axiosResult.data.method = axiosResult.config.method
      return axiosResult.data
    } catch (e: any) {
      this.callObservers('error', e.response, e.response.status)
      throw new RequestFailureRepositoryError<T>(
        {
          status: false,
          statusCode: e.response.status,
          message: e.response.statusText,
          url: e.config.url,
          method: e.config.method,
        },
        e.response,
      )
    }
  }

  async find<T>(
    address: string,
    identifier: number | string,
    options?: RepositoryQueryOptions,
  ): Promise<RepositoryResult<T>> {
    const queryAddress =
      this._baseUrl +
      (address ?? '').replace(/:id/g, String(identifier)) +
      this.generateQuery(options ?? {})
    try {
      const axiosResult = await this._axios.get<RepositoryResult<T>>(
        queryAddress,
      )
      axiosResult.data.url = axiosResult.config.url
      axiosResult.data.method = axiosResult.config.method
      return axiosResult.data
    } catch (e: any) {
      this.callObservers('error', e.response, e.response.status)
      throw new RequestFailureRepositoryError<T>(
        {
          status: false,
          statusCode: e.response.status,
          message: e.response.statusText,
          url: e.config.url,
          method: e.config.method,
        },
        e.response,
      )
    }
  }

  async save<T, M>(
    address: string,
    identifier: number | string,
    data: M,
    options?: RepositoryQueryOptions,
  ): Promise<RepositoryResult<T>> {
    const queryAddress =
      this._baseUrl +
      (address ?? '').replace(/:id/g, String(identifier)) +
      this.generateQuery(options ?? {})
    try {
      const axiosResult = await this._axios.patch<RepositoryResult<T>>(
        queryAddress,
        data,
      )
      axiosResult.data.url = axiosResult.config.url
      axiosResult.data.method = axiosResult.config.method
      return axiosResult.data
    } catch (e: any) {
      this.callObservers('error', e.response, e.response.status)
      throw new RequestFailureRepositoryError<T>(
        {
          status: false,
          statusCode: e.response.status,
          message: e.response.statusText,
          url: e.config.url,
          method: e.config.method,
        },
        e.response,
      )
    }
  }

  generateQuery(options: RepositoryQueryOptions): string {
    let query = '?lights=true'
    if (options.pageNumber) {
      query += `&page[number]=${options.pageNumber}`
    }
    if (options.pageSize) {
      query += `&page[size]=${options.pageSize}`
    }
    if (options.filters) {
      options.filters.forEach(filter => {
        if (filter.relation) {
          query += `&filter[${filter.relation}][${filter.name}]=${
            filter.operator ?? ''
          }${filter.value}`
        } else {
          query += `&filter[${filter.name}]=${filter.operator ?? ''}${
            filter.value
          }`
        }
      })
    }
    return query + this._postfix
  }

  async uploadFile<T>(
    address: string,
    data: RepositoryUploadData | RepositoryUploadData[],
    options?: any,
  ): Promise<RepositoryResult<T>> {
    const formData = new FormData()
    if (!(data instanceof Array)) {
      data = [data]
    }
    data.forEach(item => {
      formData.append(item.key, item.file)
    })
    try {
      const queryAddress =
        this._baseUrl + (address ?? '') + this.generateQuery(options ?? {})
      const axiosResult = await this._axios.post<RepositoryResult<T>>(
        queryAddress,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      axiosResult.data.url = axiosResult.config.url
      axiosResult.data.method = axiosResult.config.method
      return axiosResult.data
    } catch (e: any) {
      this.callObservers('error', e.response, e.response.status)
      throw new RequestFailureRepositoryError<T>(
        {
          status: false,
          statusCode: e.response.status,
          message: e.response.statusText,
          url: e.config.url,
          method: e.config.method,
        },
        e.response,
      )
    }
  }

  deleteFile<T>(
    address: string,
    identifier: number | string,
    options?: any,
  ): Promise<RepositoryResult<T>> {
    const queryAddress =
      this._baseUrl +
      (address ?? '').replace(/:id/g, String(identifier)) +
      this.generateQuery(options ?? {})
    return this._axios.delete(queryAddress)
  }
}
