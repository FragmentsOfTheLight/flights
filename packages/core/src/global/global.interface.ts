import { ContainerInterface } from '../contracts'
import { Constructor } from '../mixin'

export interface RGlobalScopeConfig {
  container?: Constructor<ContainerInterface>
}

export interface RGlobalScope {
  services: any
  data: any
}

export interface Window {
  rGlobalScope: RGlobalScope
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NodeJS {
  interface Global {
    rGlobalScope: RGlobalScope
  }
}

// declare const rGlobalInstance: RGlobalScope;
