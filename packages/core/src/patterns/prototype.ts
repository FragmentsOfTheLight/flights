import { Constructor } from "../mixin"
import _ from 'lodash'

/**
 * It lets you copy existing objects without making your code dependent on their classes
 */
export interface Clonable{
    clone(): Clonable
}

export function ClonableMixin<TBase extends Constructor>(Base: TBase) {
    return class extends Base implements Clonable {
        clone(): Clonable {
            return _.clone(this)
        }
    }
}