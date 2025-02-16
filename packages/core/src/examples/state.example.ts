import { StateContext, State } from '..'

interface JobState extends State {
  changeState(context: JobContext): void
}

export class StoppedState implements JobState {
  stateKey = 'Stopped'

  changeState(context: JobContext): void {
    context.state = new WorkingState()
  }
}

export class WorkingState implements JobState {
  stateKey = 'Working'

  changeState(context: JobContext): void {
    context.state = new StoppedState()
  }
}

export class JobContext implements StateContext {
  _state: JobState

  constructor(state: JobState) {
    this._state = state
  }

  set state(state: JobState) {
    this._state = state
  }

  get state() {
    return this._state
  }

  switch() {
    this._state.changeState(this)
  }
}
