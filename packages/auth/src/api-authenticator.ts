import {
  Authenticator,
  AuthenticatorObserver,
  AuthResponse,
  CheckResponse,
  StorageAdapter,
} from '@flights/core/contracts'
import axios, { AxiosInstance } from 'axios'
import {
  AuthenticationFailError,
  InvalidAuthenticationError,
  NotYetAuthenticatedError,
} from './errors/authenticator.error'
import { User } from './models'
import { ObservableMixin } from '../../core'

export interface RestApiResponse {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
  data?: {
    token_type: string
    expires_in: number
    access_token: string
    refresh_token: string
  }
}

export interface UserApiResponse {
  status: string
  message: number
  data: {
    id?: string
    name?: string
    status?: number
    score?: number
    balance?: string
    roles?: {
      id: string
      name: string
    }[],
    permissions?: {
      id: string
      name: string
    }[]
    user?: {
      id: string
      name: string
      status: number
      score?: number
      balance?: string
      roles: {
        id: string
        name: string
      }[],
      permissions?: {
        id: string
        name: string
      }[]
    }
  }
}

export interface UserCheckResponse {
  status: string
  message: number
  data: {
    active?: boolean
    challenge?: boolean
    verified?: boolean
  }
}

export interface ApiAuthenticationSchema {
  token: string
  refreshToken: string
  expiresAt: number
  user?: User
}

class AuthenticatorBase {}

export class RestApiAuthenticator
  extends ObservableMixin<AuthenticatorObserver>()(AuthenticatorBase)
  implements Authenticator
{
  private _user?: User
  private readonly _authUrl: string
  private readonly _userUrl: string
  private readonly _checkUrl: string
  private readonly _clientId: number
  private readonly _clientSecret: string
  private _token?: string
  private _refreshToken?: string
  private _validity: number
  private _storage?: StorageAdapter
  private _storageKey: string

  constructor(
    authUrl: string,
    userUrl: string,
    checkUrl: string,
    clientId: number,
    clientSecret: string,
    storageAdapter?: StorageAdapter,
  ) {
    super()
    this._authUrl = authUrl
    this._userUrl = userUrl
    this._checkUrl = checkUrl
    this._clientId = clientId
    this._clientSecret = clientSecret
    this._validity = 0
    this._storage = storageAdapter
    this._storageKey = 'authenticator'
  }

  get user() {
    return this._user
  }

  get storageKey() {
    return this._storageKey
  }

  get storage() {
    return this._storage
  }

  hasRole(name: string) {
    if (this.isValid) {
      if (this._user) {
        const validRoles = this._user.roles?.filter(role => role.name === name)
        if (validRoles) {
          if (validRoles.length > 0) {
            return true
          }
        }
      }
    }
    return false
  }

  get axios(): AxiosInstance {
    const axiosInstance: AxiosInstance = axios.create({
      withCredentials: true,
      headers: {
        "Cache-Control": "no-store"
      }
    });
    if (this.isValid) {
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${this._token}`
      return axiosInstance
    }
    return axiosInstance
  }

  get isValid() {
    if (this._token) {
      return Date.now() < (this._validity ?? 0)
    }
    return false
  }

  get hasToken() {
    return !!this._token
  }

  async validateAuthentication(): Promise<boolean> {
    if (this.hasToken) {
      if (this.isValid) {
        return true
      } else {
        await this.refreshToken(this._refreshToken)
        return this.isValid
      }
    }
    return false
  }

  clearAuthentication() {
    this._token = undefined
    this._refreshToken = undefined
    this._validity = 0
  }

  logout() {
    const wasValid = this.isValid
    this.clearAuthentication()
    if (this._storage) {
      this._storage.delete(this._storageKey)
    }
    if (wasValid) {
      this.callObservers('stateChanged', this, false)
    }
  }

  sync(storageAdapter: StorageAdapter, key?: string) {
    this._storage = storageAdapter
    if (key) this._storageKey = key
    this.import(this._storage, this._storageKey).finally(() => {})
  }

  cancelSync() {
    this._storage = undefined
  }

  async export(storageAdapter: StorageAdapter, key: string) {
    if (this._token) {
      if (this.isValid) {
        const data = {
          token: this._token,
          expiresAt: this._validity,
          refreshToken: this._refreshToken,
          user: this._user,
        } as ApiAuthenticationSchema
        await storageAdapter.writeAsync(key, data)
        this.callObservers('exported', this, data)
        return
      }
      throw new InvalidAuthenticationError()
    }
    throw new NotYetAuthenticatedError()
  }

  async import(storageAdapter: StorageAdapter, key: string) {
    const data = storageAdapter.read(key) as ApiAuthenticationSchema
    if (data) {
      const wasValid = this.isValid
      this._token = data.token
      this._refreshToken = data.refreshToken
      this._validity = data.expiresAt
      this._user = data.user
      this.callObservers('imported', this, data)
      if (!wasValid) {
        this.callObservers('stateChanged', this, true)
      }
    }
  }

  async checkUser(username: string): Promise<CheckResponse> {
    const data = {
      username: username,
    }
    try {
      const response = await this.axios.post<UserCheckResponse>(
        this._checkUrl,
        data,
      )
      return {
        active: response.data.data.active,
        challenge: response.data.data.challenge,
      }
    } catch (reason) {
      throw new AuthenticationFailError(reason)
    }
  }

  async resetPassword(username: string): Promise<CheckResponse> {
    const data = {
      username: username,
      reset: true,
    }
    try {
      const response = await this.axios.post<UserCheckResponse>(
        this._checkUrl,
        data,
      )
      return {
        active: response.data.data.active,
        challenge: response.data.data.challenge,
      }
    } catch (reason) {
      throw new AuthenticationFailError(reason)
    }
  }

  async activateUser(username: string, token: string): Promise<CheckResponse> {
    const data = {
      username: username,
      token: token,
    }
    try {
      const response = await this.axios.post<UserCheckResponse>(
        this._checkUrl,
        data,
      )
      return {
        active: response.data.data.active,
      }
    } catch (reason) {
      throw new AuthenticationFailError(reason)
    }
  }

  async savePassword(
    username: string,
    name: string,
    password: string,
  ): Promise<CheckResponse> {
    const data = {
      username: username,
      name: name,
      password: password,
    }
    try {
      const response = await this.axios.post<UserCheckResponse>(
        this._checkUrl,
        data,
      )
      return {
        active: response.data.data.active,
      }
    } catch (reason) {
      throw new AuthenticationFailError(reason)
    }
  }

  async getToken(username: string, password: string): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);
    formData.append('client_id', String(this._clientId));
    formData.append('client_secret', this._clientSecret);
    try {
      const response = this.requestToken(formData)
      this.callObservers('issued', this, this._token ?? '')
      return response
    } catch (reason) {
      this.callObservers('failed', this, reason)
      throw new AuthenticationFailError(reason)
    }
  }

  async refreshToken(refreshToken?: string): Promise<AuthResponse> {
    try {
      const result = await axios.get<RestApiResponse>(this._authUrl, {
        headers: {
          Authorization: "Bearer " + (refreshToken ?? this._refreshToken)
        }
      })
      this._token = result.data.access_token ?? result.data.data?.access_token
      this._refreshToken = result.data.refresh_token ?? result.data.data?.refresh_token
      this._validity = Date.now() + (result.data.expires_in ?? result.data.data?.expires_in) * 1000
      if (this._storage)
        this.export(this._storage, this._storageKey).finally(() => {})
      this.callObservers('refreshed', this, this._token ?? '')
      return {
        token: this._token,
        lifetime: result.data.expires_in ?? result.data.data?.expires_in,
        generated_at: Date.now(),
        expires_at: this._validity,
      }
    } catch (reason) {
      this.callObservers('failed', this, reason)
      throw new AuthenticationFailError(reason)
    }
  }

  protected async requestToken(data: any, headers?: any) {
    const result = await axios.post<RestApiResponse>(this._authUrl, data, headers)
    this._token = result.data.access_token ?? result.data.data?.access_token
    this._refreshToken = result.data.refresh_token ?? result.data.data?.refresh_token
    this._validity = Date.now() + (result.data.expires_in ?? result.data.data?.expires_in) * 1000
    if (this._storage)
      this.export(this._storage, this._storageKey).finally(() => {})
    return {
      token: this._token,
      lifetime: result.data.expires_in ?? result.data.data?.expires_in,
      generated_at: Date.now(),
      expires_at: this._validity,
    }
  }

  public async requestUserInfo() {
    const user = await this.axios.get<UserApiResponse>(this._userUrl)
    console.log(user)
    this._user = new User(
      user.data.data?.id ?? user.data.data?.user?.id ?? '',
      user.data.data?.name ?? user.data.data?.user?.name ?? '',
      user.data.data?.roles ?? user.data.data?.user?.roles,
      user.data.data?.permissions ?? user.data.data?.user?.permissions,
      user.data.data?.score ?? user.data.data?.user?.score ?? 0,
      user.data.data?.balance ?? user.data.data?.user?.balance ?? '0',
    )
    this.callObservers('stateChanged', this, this.isValid)
    this.callObservers('userUpdated', this, this._user, user)
  }
}
