import { setAppStatusAC } from 'app/app-reducer'
import { authAPI, LoginParamsType } from 'api/api'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { clearTasksAndTodolists } from 'common/actions/common.actions'
import { createAppAsyncThunk } from 'utils/create-app-async-thunk'

// types
type InitialStateType = {
  isLoggedIn: boolean
}

const initialState: InitialStateType = {
  isLoggedIn: false,
}

export const loginTC = createAppAsyncThunk('auth/login', async (data: LoginParamsType, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatusAC({ status: 'loading' }))
    const res = await authAPI.login(data)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({ status: 'succeeded' }))
      return { isLoggedIn: true }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (err: any) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  }
})

// export const loginTC_ =
//   (data: LoginParamsType): AppThunk =>
//   (dispatch) => {
//     dispatch(setAppStatusAC({ status: 'loading' }))
//     authAPI
//       .login(data)
//       .then((res) => {
//         if (res.data.resultCode === 0) {
//           dispatch(setIsLoggedInAC({ value: true }))
//           dispatch(setAppStatusAC({ status: 'succeeded' }))
//         } else {
//           handleServerAppError(res.data, dispatch)
//         }
//       })
//       .catch((err) => {
//         handleServerNetworkError(err, dispatch)
//       })
//   }

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(stateDraft, action: PayloadAction<{ value: boolean }>) {
      stateDraft.isLoggedIn = action.payload.value
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
})

export const setIsLoggedInAC = authSlice.actions.setIsLoggedInAC
export const { selectIsLoggedIn } = authSlice.selectors

// export const authReducer = (
//     state: InitialStateType = initialState,
//     action: ActionsType
// ): InitialStateType => {
//     switch (action.type) {
//         case 'login/SET-IS-LOGGED-IN':
//             return {...state, isLoggedIn: action.value}
//         default:
//             return state
//     }
// }

// actions
// export const setIsLoggedInAC = (value: boolean) =>
//     ({type: 'login/SET-IS-LOGGED-IN', value}) as const

// thunks

export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: false }))
        dispatch(setAppStatusAC({ status: 'succeeded' }))
        dispatch(clearTasksAndTodolists())
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}
