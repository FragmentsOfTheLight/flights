import React, { createContext, useContext, ReactNode, useEffect, useMemo } from 'react'
import { RestApiAuthenticator } from '../api-authenticator'
import { Authenticator, StorageAdapter } from '@flights/core/src/contracts'
import { LocalStorageAdapter } from '@flights/storage'

export interface RestApiAuthenticatorOptions {
  authUrl: string
  userUrl: string
  checkUrl: string
  clientId: number
  clientSecret: string
  storageAdapter?: StorageAdapter
  autoSync?: boolean
}

// Create a context
const AuthContext = createContext<Authenticator | null>(null)

// Provider Component
export function AuthProvider({ authOptions, children }: { authOptions: RestApiAuthenticatorOptions; children: ReactNode }) {
  const authenticator = useMemo(() => new RestApiAuthenticator(
    authOptions.authUrl,
    authOptions.userUrl,
    authOptions.checkUrl,
    authOptions.clientId,
    authOptions.clientSecret,
    authOptions.storageAdapter,
  ), [authOptions])

  // Auto-sync on mount if enabled
  useEffect(() => {
    if (authOptions.autoSync) {
      authenticator.sync(authOptions.storageAdapter ?? new LocalStorageAdapter())
    }
  }, [authenticator, authOptions.autoSync, authOptions.storageAdapter])

  return <AuthContext.Provider value={authenticator}>{children}</AuthContext.Provider>
}

// Custom Hook for accessing the Authenticator
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
