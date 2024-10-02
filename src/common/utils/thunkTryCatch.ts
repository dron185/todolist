import { setAppStatusAC } from 'app/appSlice'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { AppDispatch } from 'app/store'

type ThunkApi = {
  dispatch: AppDispatch
  rejectWithValue: any
}

export const thunkTryCatch = async (thunkAPI: ThunkApi, logic: () => Promise<any>) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatusAC({ status: 'loading' }))
    return await logic()
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(setAppStatusAC({ status: 'idle' }))
  }
}
