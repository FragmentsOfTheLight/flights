/**
 * Avoid coupling the sender of a request to its recievers by giving more than one object a chance to handle a request.
 * Chain the recieving objects and pass the request along the chain until an object handles it.
 */
export interface ChainHandler{
    handle?(): boolean
}