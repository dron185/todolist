import { appSlice, AppInitialState, appActions } from 'app/appSlice'

let startState: AppInitialState
const appReducer = appSlice.reducer

beforeEach(() => {
  startState = {
    status: 'idle',
    error: null,
    isInitialized: false as boolean,
  }
})

test('correct error message should be set', () => {
  const endState = appReducer(startState, appActions.setAppError({ error: 'some error' }))

  expect(endState.error).toBe('some error')
})

test('correct status should be set', () => {
  const endState = appReducer(startState, appActions.setAppStatus({ status: 'loading' }))

  expect(endState.status).toBe('loading')
})
