/**
 * Promotes loose coupling by keeping objects from referring to each other explicitly and it lets you vary their interaction independently.
 * This class is responsible to contain metadata methods of Colleague classes.
 * @see MediatorColleague | to implement colleague classes with Mediator design pattern to externalize metadata behaviors.
 */
export interface Mediator{

}

/**
 * Promotes loose coupling by keeping objects from referring to each other explicitly and it lets you vary their interaction independently.
 * This class is responsible to contain mediator object to implement metadata functionality independently.
 * @see Mediator | to implement metadata methods of Colleague classes.
 */
export interface MediatorColleague{
    _mediator: Mediator
}
