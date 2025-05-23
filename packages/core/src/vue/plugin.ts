import { rGlobal } from '@flights/core'

export const globalSymbol = Symbol()

export function createGlobalPlugin() {
  return {
    install: (app: any, options: any) => {
      app.config.globalProperties.$rGlobal = app.provide(
        globalSymbol,
        rGlobal(),
      )
    },
  }
}
