import { RGlobalScope } from './global.interface'

class RGlobalScopeImp implements RGlobalScope {
  services: any
  data: any

  constructor() {
    this.services = {}
    this.data = {}
  }

  setData(key: string, value: any) {
    this.data[key] = value
  }

  getData(key: string) {
    return this.data[key]
  }
}

try {
  if (global) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.rGlobalScope = new RGlobalScopeImp()
  }
} catch (e) {}
try {
  if (window) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.rGlobalScope = new RGlobalScopeImp()
  }
} catch (e) {}

export function rGlobal(): RGlobalScopeImp {
  try {
    if (global) {
      // console.log('flights: using global scope')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return global.rGlobalScope as RGlobalScopeImp
    }
  } catch (e) {}
  try {
    if (window) {
      // console.log('flights: using window scope')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return window.rGlobalScope as RGlobalScopeImp
    }
  } catch (e) {}
  return {} as RGlobalScopeImp
}
