import { RestApiAuthenticator } from '../api-authenticator'
import { Authenticator, StorageAdapter } from '@flights/core/src/contracts'
import { LocalStorageAdapter } from '@flights/storage'

export const authSymbol = Symbol()

export interface RestApiAuthenticatorOptions {
  authUrl: string
  userUrl: string
  checkUrl: string
  clientId: number
  clientSecret: string
  storageAdapter?: StorageAdapter
  autoSync?: boolean
}

export function createRestApiAuthenticatorPlugin(
  authOptions: RestApiAuthenticatorOptions,
) {
  const authenticator = new RestApiAuthenticator(
    authOptions.authUrl,
    authOptions.userUrl,
    authOptions.checkUrl,
    authOptions.clientId,
    authOptions.clientSecret,
    authOptions.storageAdapter,
  )
  return {
    app: authenticator,
    install: (app: any, options: any) => {
      if (authOptions.autoSync) {
        authenticator.sync(
          authOptions.storageAdapter ?? new LocalStorageAdapter(),
        )
      }
      app.config.globalProperties.$auth = authenticator
      app.provide(authSymbol, authenticator)
    },
  }
}
