import { ContainerInterface } from '@lights/core/src/contracts'
import { Constructor } from '@lights/core'

export interface ContainerOptions {
  container: Constructor<ContainerInterface>
}

export function createContainerPlugin(options: ContainerOptions) {
  const container = new options.container()

  return {
    app: container,
    install: (app: any, options: any) => {
      app.config.globalProperties.$container = container
      app.provide('container', options)
    },
  }
}
