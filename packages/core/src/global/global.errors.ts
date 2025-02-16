import { BaseError, rGlobal, RGlobalScope } from '@flights/core'

export class GlobalError extends BaseError {
  constructor(m: string) {
    super(m)
  }

  get global(): RGlobalScope {
    return rGlobal()
  }
}

export class GlobalConfigKeyNotFound extends GlobalError {
  constructor(key: string) {
    super(
      `Global config key ${key} not found in globals. set rGlobal().config configuration before using it.`,
    )
  }
}
