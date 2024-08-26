import { authAPI } from 'api/api'
import { setIsLoggedInAC } from 'features/Login/auth-reducer'
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
  status: RequestStatusType
  error: null | string
  isInitialized: boolean
}

const initialState: InitialStateType = {
  status: 'idle',
  error: null,
  isInitialized: false,
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppStatusAC(
      stateDraft,
      action: PayloadAction<{ status: RequestStatusType }>
    ) {
      stateDraft.status = action.payload.status
    },
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
    setAppInitializedAC(
      state,
      action: PayloadAction<{ isInitialized: boolean }>
    ) {
      state.isInitialized = action.payload.isInitialized
    },
  },
})

export const appReducer = slice.reducer
export const { setAppStatusAC, setAppErrorAC, setAppInitializedAC } =
  slice.actions

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>

// thunks
export const initializeAppTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: true }))
        dispatch(setAppStatusAC({ status: 'succeeded' }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
      dispatch(setAppInitializedAC({ isInitialized: true }))
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}
