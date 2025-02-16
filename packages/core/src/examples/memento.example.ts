import { Memento, MementoCareTaker, MementoOriginator } from "../patterns";

export class Flight implements MementoOriginator{

    private _capacity: number
    private _pilot: string

    constructor(capacity?: number, pilot?: string) {
        if(capacity) {
            this._capacity = capacity
        } else {
            this._capacity = 0
        }
        if(pilot) {
            this._pilot = pilot
        } else {
            this._pilot = ''
        }
    }

    set pilot(name: string) {
        this._pilot = name
    }
    set capacity(number: number) {
        this._capacity = number
    }
    get capacity(): number {
        return this._capacity
    }
    get pilot(): string {
        return this._pilot
    }

    exportMemento(): FlightMemento {
        return new FlightMemento(this._capacity, this._pilot)
    }
    importMemento(memento: FlightMemento): void {
        this._capacity = memento.capacity
        this._pilot = memento.pilot
    }

}

export class FlightMemento implements Memento{
    private _capacity: number
    private _pilot: string

    constructor(capacity: number, pilot: string) {
        this._capacity = capacity
        this._pilot = pilot
    }

    get capacity(): number {
        return this._capacity
    }

    get pilot(): string {
        return this._pilot
    }
}

export class FlightCareTaker implements MementoCareTaker{
    mementoHistory: FlightMemento[];

    constructor() {
        this.mementoHistory = []
    }

    hasMemento(memento: FlightMemento): boolean {
        return this.mementoHistory.includes(memento);
    }
    getMemento(index: number): FlightMemento|null {
        if(index < 0 || index >= this.mementoHistory.length) {
            return null
        }
        return this.mementoHistory[index]
    }
    addMemento(memento: FlightMemento): void {
        this.mementoHistory.push(memento)
    }
    removeMemento(index: number): FlightMemento|null {
        if(this.getMemento(index) === null) {
            return null
        }
        return this.mementoHistory.splice(index, 1)[0]
    }
    
}