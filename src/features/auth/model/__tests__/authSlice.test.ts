import { authSlice, authThunks, InitialState } from 'features/auth/model/authSlice'
import { TestAction } from 'common/types'

let startState: InitialState

const authReducer = authSlice.reducer

beforeEach(() => {
  startState = {
    isLoggedIn: false,
    captchaUrl: null,
  }
})

test('isLoggedIn should be true after successful login', () => {
  type Action = TestAction<typeof authThunks.login.fulfilled>

  const action: Action = {
    type: authThunks.login.fulfilled.type,
    payload: { isLoggedIn: true },
  }

  const endState = authReducer(startState, action)

  expect(endState.isLoggedIn).toBe(true)
})

test('isLoggedIn should be false after logout', () => {
  type Action = TestAction<typeof authThunks.logout.fulfilled>

  startState = {
    isLoggedIn: true,
    captchaUrl: null,
  }

  const action: Action = {
    type: authThunks.logout.fulfilled.type,
    payload: { isLoggedIn: false },
  }

  const endState = authReducer(startState, action)

  expect(endState.isLoggedIn).toBe(false)
  expect(endState.captchaUrl).toBe(null)
})

test('isLoggedIn should be true after initializeApp', () => {
  const action = {
    type: authThunks.initializeApp.fulfilled.type,
    payload: { isLoggedIn: true },
  }

  const endState = authReducer(startState, action)

  expect(endState.isLoggedIn).toBe(true)
})

test('captchaUrl should be set after getCaptchaUrl', () => {
  const captchaUrl = 'https://example.com/captcha'

  const action = {
    type: authThunks.getCaptchaUrl.fulfilled.type,
    payload: { captchaUrl },
  }

  const endState = authReducer(startState, action)

  expect(endState.captchaUrl).toBe(captchaUrl)
})
