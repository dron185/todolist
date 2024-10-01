import { setAppErrorAC, setAppStatusAC } from 'app/appSlice'
import { AppDispatch } from 'app/store'
import { BaseResponse } from 'common/types/types'

export const handleServerAppError = <T>(data: BaseResponse<T>, dispatch: AppDispatch) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC({ error: data.messages[0] }))
  } else {
    dispatch(setAppErrorAC({ error: 'Some error occurred' }))
  }
  dispatch(setAppStatusAC({ status: 'failed' }))
}
