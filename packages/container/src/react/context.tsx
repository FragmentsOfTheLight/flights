import React, { createContext, useContext, ReactNode } from 'react'
import { ContainerInterface } from '@flights/core/src/contracts'
import { Constructor } from '@flights/core'

export interface ContainerOptions {
  container: Constructor<ContainerInterface>
}

// Create a context
const ContainerContext = createContext<ContainerInterface | null>(null)

// Create a provider component
export function ContainerProvider({ options, children }: { options: ContainerOptions; children: ReactNode }) {
  const container = new options.container()

  return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>
}

// Custom hook for consuming the container
export function useContainer() {
  const context = useContext(ContainerContext)
  if (!context) {
    throw new Error('useContainer must be used within a ContainerProvider')
  }
  return context
}
