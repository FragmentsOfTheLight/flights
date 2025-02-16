/**
 * Captures an object's internal state and externalize it so that it can be restored to that state later.
 * This class is responsible to hold MementoOriginator state.
 * @see MementoOriginator | to add memento export and import feature in a class
 * @see MementoCareTaker | to manage memento objects over time
 */
export interface Memento{

}

/**
 * Captures an object's internal state and externalize it so that it can be restored to that state later.
 * Main class to apply memento.
 * @see Memento | to implement memento data
 * @see MementoCareTaker | to manage memento objects over time 
 */
export interface MementoOriginator{
    exportMemento(): Memento
    importMemento(memento: Memento): void
}

/**
 * Captures an object's internal state and externalize it so that it can be restored to that state later.
 * This class is responsible to manage multiple memento objects.
 * @see Memento | to implement memento data
 * @see MementoOriginator | to add memento export and import feature in a class
 */
export interface MementoCareTaker{
    mementoHistory: Memento[]
    hasMemento(memento: Memento): boolean
    getMemento(index: number): Memento|null
    addMemento(memento: Memento): void
    removeMemento(index: number): Memento|null
}