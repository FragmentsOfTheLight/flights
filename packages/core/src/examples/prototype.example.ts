import { Clonable } from "../patterns";

export class Table implements Clonable{
    width: number
    length: number
    height: number

    constructor(width:number, length: number, height: number) {
        this.width = width
        this.length = length
        this.height = height
    }

    clone(): Clonable {
        return new Table(this.width, this.length, this.height)
    }
}