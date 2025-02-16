import { Constructor } from '../mixin'
import { ModelMetadataOptions } from '@lights/collection/src/metadata/model.metadata'

/**
 * Allows behavior to be added to an individual object dynamically.
 * Contains a base class and wraps its methods.
 * @see DecoratorBase | to implement decorator base class.
 */
export interface Decorator {}

/**
 * Allows behavior to be added to an individual object dynamically.
 * This is the base class for decorator to add new behavior on it.
 * @see Decorator | to implement new behaviors to DecoratorBase.
 */
export interface DecoratorBase {}

export function SingleDecoratorMixin<DBase extends DecoratorBase>(
  DBaseType: new () => DBase,
) {
  return function <TBase extends Constructor>(Base: TBase) {
    return class extends Base implements Decorator {
      _decoratorBase: DBase
      constructor(...args: any[]) {
        super()
        this._decoratorBase = new DBaseType()
      }
    }
  }
}

export type ClassConstructorDecorator = (target: Constructor) => any
