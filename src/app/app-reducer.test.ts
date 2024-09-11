import {
  appSlice,
  InitialStateType,
  setAppErrorAC,
  setAppStatusAC,
} from './app-reducer'

let startState: InitialStateType
const appReducer = appSlice.reducer

beforeEach(() => {
  startState = {
    status: 'idle',
    error: null,
    isInitialized: false as boolean,
  }
})

test('correct error message should be set', () => {
  const endState = appReducer(
    startState,
    setAppErrorAC({ error: 'some error' })
  )

  expect(endState.error).toBe('some error')
})

test('correct status should be set', () => {
  const endState = appReducer(startState, setAppStatusAC({ status: 'loading' }))

  expect(endState.status).toBe('loading')
})
