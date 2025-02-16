'use strict'

import { Flight, FlightCareTaker } from '../src/examples/memento.example'
import { Table } from '../src/examples/prototype.example'
import { JobContext, StoppedState, WorkingState } from '../src/examples/state.example'

describe('Patterns', () => {
  // it('test.todo')
  test('state', () => {

    const app = new JobContext(new StoppedState())

    app.switch()
    expect(app.state).toBeInstanceOf(WorkingState)
    app.switch()
    expect(app.state).toBeInstanceOf(StoppedState)
  })

  test('prototype', () => {

    const table = new Table(3, 2, 2)
    const table2 = new Table(2, 1, 1)
    const tableClone = table.clone()

    expect(tableClone).toStrictEqual(table)
    expect(tableClone).not.toStrictEqual(table2)
  })

  test('memento', () => {

    const flight = new Flight(30, 'Mr. John Kennedy')
    const flightCareTaker = new FlightCareTaker()

    flightCareTaker.addMemento(flight.exportMemento())
    flight.capacity = 40
    flight.pilot = 'Mrs. Margaret Thatcher'

    expect(flight.capacity).toBe(40)
    expect(flight.pilot).toBe('Mrs. Margaret Thatcher')

    const lastMemento = flightCareTaker.getMemento(0)
    if(lastMemento) {
      flight.importMemento(lastMemento)
      expect(flight.capacity).toBe(30)
      expect(flight.pilot).toBe('Mr. John Kennedy')
    }
  })
})
