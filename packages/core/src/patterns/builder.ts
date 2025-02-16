/**
 * Solves the problem of telescoping constructor.
 * This class is responsible to build a class and initialize all it's parameters.
 * @see Buildable | to mark a class as buildable
 */
export interface builder{
    build(): Buildable
}

/**
 * Solves the problem of telescoping constructor.
 * This class is responsible to mark a class implementing builder design pattern.
 * @see Builder | to implement builder class
 */
export interface Buildable{

}