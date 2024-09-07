import { AppRootStateType } from 'app/store'
import { RequestStatusType } from 'app/app-reducer'

export const selectAppStatus = (state: AppRootStateType): RequestStatusType =>
  state.app.status
export const selectAppError = (state: AppRootStateType): string | null =>
  state.app.error
export const selectIsInitialized = (state: AppRootStateType): boolean =>
  state.app.isInitialized
