/**
 * A cleaner way for an object to change its behavior at runtime without resorting to large monolithic conditional statements.
 * Different state classes with different functionalities.
 * @see StateContext | to implement state dependent behavior in a class
 */
export interface State {
  stateKey: string
}

/**
 * A cleaner way for an object to change its behavior at runtime without resorting to large monolithic conditional statements.
 * Context class holding active state.
 * @see State | to implement state classes with different behavior
 */
export interface StateContext {
  state: State
}
