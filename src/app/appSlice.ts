import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

export const { setAppStatusAC, setAppErrorAC, setAppInitializedAC } = appSlice.actions

export const { selectAppStatus, selectAppError, selectIsInitialized } = appSlice.selectors
