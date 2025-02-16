import { Constructor } from '../mixin'

/**
 * Define a one to many dependency between objects so that when one object changes state, all it's dependents are notified and updated automatically.
 * This interface trigger actions on observable object changes.
 * @see Observable | to make a class observable by other observer objects.
 */
export interface Observer {}

/**
 * Define a one to many dependency between objects so that when one object changes state, all it's dependents are notified and updated automatically.
 * This interface makes a class observable by other observer objects.
 * @see Observer | to listen on Observable object changes.
 */
export interface Observable {
  observers: Observer[]

  registerObserver(observer: Observer): void
  unregisterObserver(observer: Observer): void
  isObserverRegistered(observer: Observer): boolean
}

export function ObservableMixin<TObserver extends Observer>() {
  return function ObservableContext<TBase extends Constructor>(Base: TBase) {
    return class extends Base implements Observable {
      _observers: TObserver[]
      constructor(...args: any[]) {
        super(...args)
        this._observers = []
      }
      get observers() {
        return this._observers
      }
      registerObserver(observer: TObserver): void {
        this._observers.push(observer)
      }
      unregisterObserver(observer: TObserver): void {
        const index = this._observers.indexOf(observer)
        if (index >= 0) {
          this._observers.splice(index, 1)
        }
      }

      /**
       * Call observers event and discard event returned value
       * @param eventKey Observer selected event
       * @param args Observer event arguments
       * @see callObservers | to get events returned value
       * @see callChain | to iterate over observers only if last one retuned true
       */
      async notifyObservers(
        eventKey: keyof {
          [P in keyof TObserver]-?: TObserver[P] extends Function
            ? TObserver[P]
            : any
        },
        ...args: Parameters<
          {
            [P in keyof TObserver]-?: TObserver[P] extends (...args: any) => any
              ? TObserver[P]
              : any
          }[keyof TObserver]
        >
      ) {
        this.notifyObserverList(this._observers, eventKey, ...args)
      }
      /**
       * Call observers event and discard event returned value
       * @param eventKey Observer selected event
       * @param args Observer event arguments
       * @see callObservers | to get events returned value
       * @see callChain | to iterate over observers only if last one retuned true
       */
      async notifyObserverList(
        observers: TObserver[],
        eventKey: keyof {
          [P in keyof TObserver]-?: TObserver[P] extends Function
            ? TObserver[P]
            : any
        },
        ...args: Parameters<
          {
            [P in keyof TObserver]-?: TObserver[P] extends (...args: any) => any
              ? TObserver[P]
              : any
          }[keyof TObserver]
        >
      ) {
        observers.forEach(observer => {
          ;(observer[eventKey] as unknown as Function).apply(observer, args)
        })
      }

      /**
       * Call observers event and get returned value from all observers
       * @param eventKey Observer selected event
       * @param args Observer event arguments
       * @see notifyObservers | to discard events returend value
       * @see callChain | to iterate over observers only if last one retuned true
       */
      callObservers(
        eventKey: keyof {
          [P in keyof TObserver]-?: TObserver[P] extends Function
            ? TObserver[P]
            : any
        },
        ...args: Parameters<
          {
            [P in keyof TObserver]-?: TObserver[P] extends (...args: any) => any
              ? TObserver[P]
              : any
          }[keyof TObserver]
        >
      ): any[] {
        return this.callObserverList(this._observers, eventKey, ...args)
      }

      /**
       * Call observers event and get returned value from all observers
       * @param observers
       * @param eventKey Observer selected event
       * @param args Observer event arguments
       * @see notifyObservers | to discard events returend value
       * @see callChain | to iterate over observers only if last one retuned true
       */
      callObserverList(
        observers: TObserver[],
        eventKey: keyof {
          [P in keyof TObserver]-?: TObserver[P] extends Function
            ? TObserver[P]
            : any
        },
        ...args: Parameters<
          {
            [P in keyof TObserver]-?: TObserver[P] extends (...args: any) => any
              ? TObserver[P]
              : any
          }[keyof TObserver]
        >
      ): any[] {
        const resultSet: any[] = []
        observers.forEach(observer => {
          if (observer[eventKey])
            resultSet.push(
              (observer[eventKey] as unknown as Function).apply(observer, args),
            )
        })
        return resultSet
      }

      /**
       * Call observers as a chain of responsibility. If an observer retun false then the chain is broken.
       * @param eventKey Observer selected event
       * @param args Observer event arguments
       * @see callObservers | to get events returned value
       * @see notifyObservers | to discard events returend value
       */
      callChain(
        eventKey: keyof {
          [P in keyof TObserver]-?: TObserver[P] extends Function
            ? TObserver[P]
            : any
        },
        ...args: Parameters<
          {
            [P in keyof TObserver]-?: TObserver[P] extends (...args: any) => any
              ? TObserver[P]
              : any
          }[keyof TObserver]
        >
      ): boolean {
        return this.callChainFromList(this._observers, eventKey, ...args)
      }

      /**
       * Call observers as a chain of responsibility. If an observer retun false then the chain is broken.
       * @param eventKey Observer selected event
       * @param args Observer event arguments
       * @see callObservers | to get events returned value
       * @see notifyObservers | to discard events returend value
       */
      callChainFromList(
        observers: TObserver[],
        eventKey: keyof {
          [P in keyof TObserver]-?: TObserver[P] extends Function
            ? TObserver[P]
            : any
        },
        ...args: Parameters<
          {
            [P in keyof TObserver]-?: TObserver[P] extends (...args: any) => any
              ? TObserver[P]
              : any
          }[keyof TObserver]
        >
      ): boolean {
        for (const observer of observers) {
          if (
            !(observer[eventKey] as unknown as Function).apply(observer, args)
          ) {
            return false
          }
        }
        return true
      }

      // async notifyObservers<ObserverAction extends (...args: any) => any>(eventKey: keyof TObserver, ...args: Parameters<ObserverAction>) {
      //     this._observers.forEach((observer) => { (observer[eventKey] as unknown as Function).apply(observer, args) })
      // }
      isObserverRegistered(observer: TObserver): boolean {
        return this._observers.includes(observer)
      }
    }
  }
}
