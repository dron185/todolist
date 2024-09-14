import { setIsLoggedInAC } from 'features/Login/model/authSlice'
import { handleServerAppError, handleServerNetworkError } from 'common/utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { authAPI } from 'features/Login/api/authApi'

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialState = {
  /**
   * происходит ли сейчас взаимодействие с сервером
   */
  status: RequestStatusType
  /**
   * если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
   */
  error: null | string
  /**
   * true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
   */
  isInitialized: boolean
}

const initialState: AppInitialState = {
  status: 'idle',
  error: null,
  isInitialized: false,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppStatusAC(stateDraft, action: PayloadAction<{ status: RequestStatusType }>) {
      stateDraft.status = action.payload.status
    },
    setAppErrorAC(state, action: PayloadAction<{ error: AppInitialState['error'] }>) {
      state.error = action.payload.error
    },
    setAppInitializedAC(state, action: PayloadAction<{ isInitialized: AppInitialState['isInitialized'] }>) {
      state.isInitialized = action.payload.isInitialized
    },
  },
  selectors: {
    selectAppStatus: (state) => state.status,
    selectAppError: (state) => state.error,
    selectIsInitialized: (state) => state.isInitialized,
  },
})

//export const appReducer = appSlice.reducer
export const { setAppStatusAC, setAppErrorAC, setAppInitializedAC } = appSlice.actions

export const { selectAppStatus, selectAppError, selectIsInitialized } = appSlice.selectors

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
