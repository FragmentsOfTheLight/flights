import { Metadata } from '@flights/core/contracts'
import { ModelState } from '../enums'

export class StateMetadata implements Metadata {
  state: ModelState

  constructor(state: ModelState) {
    this.state = state
  }

  toObject(): { [p: string]: any } {
    return {
      state: this.state,
    }
  }
}
