import React, { createContext, useContext, ReactNode } from 'react'
import { rGlobal } from '@flights/core'

// Create a context
const GlobalContext = createContext<ReturnType<typeof rGlobal> | null>(null)

// Provider Component
export function GlobalProvider({ children }: { children: ReactNode }) {
  const globalInstance = rGlobal()

  return <GlobalContext.Provider value={globalInstance}>{children}</GlobalContext.Provider>
}

// Custom Hook for accessing rGlobal
export function useGlobal() {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider')
  }
  return context
}
