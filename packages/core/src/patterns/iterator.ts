/**
 * Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.
 * Make any class iteratable.
 */
export interface Iterator{
    next(): Iterator
    hasNext(): boolean
}