import { appSlice, AppInitialState, appActions } from 'app/model/appSlice'

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

test('correct isInitialized value should be set', () => {
  const endState = appReducer(startState, appActions.setAppInitialized({ isInitialized: true }))

  expect(endState.isInitialized).toBe(true)
})
