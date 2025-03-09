import React, { createContext, useContext, ReactNode } from 'react'
import { Repository } from '@flights/core'
import { ModelManager } from '../model-manager'

export interface ModelManagerOptions {
  repository: Repository
}

// Create a context
const ModelManagerContext = createContext<ModelManager | null>(null)

// Provider Component
export function ModelManagerProvider({ options, children }: { options: ModelManagerOptions; children: ReactNode }) {
  const modelManager = new ModelManager(options.repository)

  return <ModelManagerContext.Provider value={modelManager}>{children}</ModelManagerContext.Provider>
}

// Custom Hook for accessing ModelManager
export function useModelManager() {
  const context = useContext(ModelManagerContext)
  if (!context) {
    throw new Error('useModelManager must be used within a ModelManagerProvider')
  }
  return context
}
