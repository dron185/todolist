import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit'
import { todolistsThunks } from 'features/TodolistsList/model/todolistsSlice'
import { tasksThunks } from 'features/TodolistsList/model/tasksSlice'

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
    setAppStatus(stateDraft, action: PayloadAction<{ status: RequestStatusType }>) {
      stateDraft.status = action.payload.status
    },
    setAppError(state, action: PayloadAction<{ error: AppInitialState['error'] }>) {
      state.error = action.payload.error
    },
    setAppInitialized(state, action: PayloadAction<{ isInitialized: AppInitialState['isInitialized'] }>) {
      state.isInitialized = action.payload.isInitialized
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state, action) => {
        state.status = 'loading'
      })
      .addMatcher(isFulfilled, (state, action) => {
        state.status = 'succeeded'
      })
      .addMatcher(isRejected, (state, action: any) => {
        state.status = 'failed'

        if (action.payload) {
          if (
            action.type === todolistsThunks.addTodolist.rejected.type ||
            action.type === tasksThunks.addTask.rejected.type
          ) {
            return
          }
          state.error = action.payload.messages[0]
        } else {
          state.error = action.error.message ? action.error.message : 'Some error occurred'
        }
      })
  },
  selectors: {
    selectAppStatus: (state) => state.status,
    selectAppError: (state) => state.error,
    selectIsInitialized: (state) => state.isInitialized,
  },
})

export const appActions = appSlice.actions
export const { selectAppStatus, selectAppError, selectIsInitialized } = appSlice.selectors
