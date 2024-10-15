import { createSlice, isFulfilled, PayloadAction } from '@reduxjs/toolkit'
import { clearTasksAndTodolists } from 'common/actions/common.actions'
import { LoginParams } from 'features/auth/api/authApi.types'
import { authApi, securityApi } from 'features/auth/api/authApi'
import { createAppAsyncThunk } from 'common/utils'
import { ResultCode } from 'common/enums'
import { appActions } from 'app/model/appSlice'

// types
type InitialState = {
  isLoggedIn: boolean
  captchaUrl: string | null
}

const initialState: InitialState = {
  isLoggedIn: false,
  captchaUrl: null, // if null - captcha is not required
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authThunks.getCaptchaUrl.fulfilled, (state, action) => {
        state.captchaUrl = action.payload.captchaUrl
      })
      .addMatcher(
        //isAnyOf(login.fulfilled, logout.fulfilled, initializeApp.fulfilled),
        isFulfilled(login, logout, initializeApp),
        (
          state,
          action: PayloadAction<{
            isLoggedIn: boolean
          }>
        ) => {
          state.isLoggedIn = action.payload.isLoggedIn
        }
      )
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
    selectCaptchaUrl: (state) => state.captchaUrl,
  },
})

// thunks
const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParams>(
  `${authSlice.name}/login`,
  async (data, { rejectWithValue, dispatch }) => {
    const res = await authApi.login(data)
    if (res.data.resultCode === ResultCode.Success) {
      return { isLoggedIn: true }
    } else {
      if (res.data.resultCode === ResultCode.Captcha) {
        dispatch(getCaptchaUrl())
      }
      return rejectWithValue(res.data)
    }
  }
)

// Captcha
const getCaptchaUrl = createAppAsyncThunk(`${authSlice.name}/getCaptchaUrl`, async (_, thunkAPI) => {
  const res = await securityApi.getCaptchaUrl()
  const captchaUrl = res.data.url
  return { captchaUrl }
})

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${authSlice.name}/logout`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    const res = await authApi.logout()
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(clearTasksAndTodolists())
      return { isLoggedIn: false }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${authSlice.name}/initializeApp`,
  async (_, { dispatch, rejectWithValue }) => {
    const res = await authApi.me().finally(() => {
      dispatch(appActions.setAppInitialized({ isInitialized: true }))
    })
    if (res.data.resultCode === ResultCode.Success) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

export const authThunks = { login, logout, initializeApp, getCaptchaUrl }
export const { selectIsLoggedIn, selectCaptchaUrl } = authSlice.selectors
const authActions = authSlice.actions
