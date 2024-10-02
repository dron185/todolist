import { setAppErrorAC, setAppStatusAC } from 'app/appSlice'
import { AppDispatch } from 'app/store'
import { BaseResponse } from 'common/types/types'

export const handleServerAppError = <T>(data: BaseResponse<T>, dispatch: AppDispatch, isShowError: boolean = true) => {
  if (isShowError) {
    const error = data.messages.length ? data.messages[0] : 'Some error occurred'
    dispatch(setAppErrorAC({ error }))
  }
  dispatch(setAppStatusAC({ status: 'failed' }))
}
