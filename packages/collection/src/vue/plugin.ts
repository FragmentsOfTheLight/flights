import { Repository } from '@flights/core'
import { ModelManager } from '../model-manager'

export const collectionSymbol = Symbol()

export interface ModelManagerOptions {
  repository: Repository
}

export function createModelManagerPlugin(options: ModelManagerOptions) {
  const modelManager = new ModelManager(options.repository)

  return {
    app: modelManager,
    install: (app: any, options: any) => {
      app.config.globalProperties.$modelManager = modelManager
      app.provide(collectionSymbol, modelManager)
    },
  }
}
