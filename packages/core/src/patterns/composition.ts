import { Constructor } from '@lights/core'
import _, { Dictionary } from 'lodash'

/**
 * Lets clients treat individual objects and compositions uniformly.
 * This class can have optional list of Compositions.
 */
export interface Composition {}

export function CompositionMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements Composition {
    get compositions(): Object {
      return _.pickBy(this, value => {
        return value instanceof Base
      })
    }
  }
}
