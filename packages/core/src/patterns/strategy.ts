/**
 * Strategy lets algorithm vary independent from client that use it.
 * Implement strategy independent methods.
 * @see StrategyContext | to call strategy execute method independent from it's implementation.
 */
export interface Strategy{
    execute(): any
}

/**
 * Strategy lets algorithm vary independent from client that use it.
 * Strategy caller independent from it's implementation.
 * @see Strategy | to implement strategy independent methods.
 */
export interface StrategyContext{

}