import { Observer } from '../patterns'
import { StorageAdapter } from './storage.contract'

export interface AuthResponse {
  token: string
  lifetime: number
  generated_at: number
  expires_at: number
}

export interface CheckResponse {
  active?: boolean
  challenge?: boolean
  verified?: boolean
}

export interface Authenticator {
  isValid: boolean
  hasToken: boolean
  sync(storageAdapter: StorageAdapter, key?: string): void
  getToken(username: string, password: string): Promise<AuthResponse>
  refreshToken(token: string): Promise<AuthResponse>
  validateAuthentication(): Promise<boolean>
  clearAuthentication(): void
  logout(): void
}

export interface AuthenticatorObserver extends Observer {
  issued?(authenticator: Authenticator, token: string): boolean
  failed?(authenticator: Authenticator, response: any): boolean
  refreshed?(
    authenticator: Authenticator,
    oldToken: string,
    newToken: string,
  ): boolean
  imported?(authenticator: Authenticator, data: any): void
  exported?(authenticator: Authenticator, data: any): void
  stateChanged?(authenticator: Authenticator, validity: boolean): void
  userUpdated?(authenticator: Authenticator, user: any, response: any): void
}
