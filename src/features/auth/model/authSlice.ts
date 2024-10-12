import { createSlice, isFulfilled, PayloadAction } from '@reduxjs/toolkit'
import { clearTasksAndTodolists } from 'common/actions/common.actions'
import { LoginParams } from 'features/auth/api/authApi.types'
import { authApi } from 'features/auth/api/authApi'
import { createAppAsyncThunk } from 'common/utils'
import { ResultCode } from 'common/enums'
import { appActions } from 'app/appSlice'

// types
type InitialState = {
  isLoggedIn: boolean
}

const initialState: InitialState = {
  isLoggedIn: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
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
  },
})

// thunks
const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParams>(
  `${authSlice.name}/login`,
  async (data, { rejectWithValue }) => {
    const res = await authApi.login(data)
    if (res.data.resultCode === ResultCode.Success) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

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

export const authThunks = { login, logout, initializeApp }
export const { selectIsLoggedIn } = authSlice.selectors
