import { createSlice, isFulfilled, PayloadAction } from '@reduxjs/toolkit'
import { clearTasksAndTodolists } from 'common/actions/common.actions'
import { LoginParamsType } from 'features/Login/api/authApi.types'
import { authAPI } from 'features/Login/api/authApi'
import { createAppAsyncThunk, handleServerAppError } from 'common/utils'
import { ResultCode } from 'common/enums'
import { thunkTryCatch } from 'common/utils/thunkTryCatch'
import { appActions } from 'app/appSlice'

// types
type InitialStateType = {
  isLoggedIn: boolean
}

const initialState: InitialStateType = {
  isLoggedIn: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
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

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${authSlice.name}/login`,
  (data, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.login(data)
      if (res.data.resultCode === ResultCode.Success) {
        return { isLoggedIn: true }
      } else {
        const isShowAppError = !res.data.fieldsErrors.length
        handleServerAppError(res.data, dispatch, isShowAppError)
        return rejectWithValue(res.data)
      }
    })
  }
)

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(`${authSlice.name}/logout`, (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  return thunkTryCatch(thunkAPI, async () => {
    const res = await authAPI.logout()
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(clearTasksAndTodolists())
      return { isLoggedIn: false }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  })
})

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${authSlice.name}/initializeApp`,
  (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.me()
      if (res.data.resultCode === ResultCode.Success) {
        return { isLoggedIn: true }
      } else {
        handleServerAppError(res.data, dispatch, false)
        return rejectWithValue(null)
      }
    }).finally(() => {
      dispatch(appActions.setAppInitialized({ isInitialized: true }))
    })
  }
)

export const authThunks = { login, logout, initializeApp }
export const { selectIsLoggedIn } = authSlice.selectors

// export const _login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
//   'auth/login',
//   async (data, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(setAppStatusAC({ status: 'loading' }))
//       const res = await authAPI.login(data)
//       if (res.data.resultCode === ResultCode.Success) {
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//         return { isLoggedIn: true }
//       } else {
//         const isShowAppError = !res.data.fieldsErrors.length
//         handleServerAppError(res.data, dispatch, isShowAppError)
//         return rejectWithValue(res.data)
//       }
//     } catch (err) {
//       handleServerNetworkError(err, dispatch)
//       return rejectWithValue(null)
//     }
//   }
// )

// export const _logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
//   `${authSlice.name}/logout`,
//   async (_, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(setAppStatusAC({ status: 'loading' }))
//       const res = await authAPI.logout()
//       if (res.data.resultCode === ResultCode.Success) {
//         dispatch(clearTasksAndTodolists())
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//         return { isLoggedIn: false }
//       } else {
//         handleServerAppError(res.data, dispatch)
//         return rejectWithValue(null)
//       }
//     } catch (err) {
//       handleServerNetworkError(err, dispatch)
//       return rejectWithValue(null)
//     }
//   }
// )

// export const _initializeApp = (): AppThunk => (dispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   authAPI
//     .me()
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         dispatch(setIsLoggedInAC({ value: true }))
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//       } else {
//         handleServerAppError(res.data, dispatch)
//       }
//       dispatch(setAppInitializedAC({ isInitialized: true }))
//     })
//     .catch((err) => {
//       handleServerNetworkError(err, dispatch)
//     })
// }

// export const logoutTC = (): AppThunk => (dispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   authAPI
//     .logout()
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         dispatch(setIsLoggedInAC({ value: false }))
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//         dispatch(clearTasksAndTodolists())
//       } else {
//         handleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch((err) => {
//       handleServerNetworkError(err, dispatch)
//     })
// }

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
