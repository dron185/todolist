import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { AppDispatch } from 'app/store'
import { appActions } from 'app/appSlice'

type ThunkApi = {
  dispatch: AppDispatch
  rejectWithValue: any
}

/**
 * Executes an asynchronous logic function within a try-catch block, handling loading state and errors.
 * This function is designed to be used within a Redux thunk to manage the loading state and error handling
 * for asynchronous operations.
 *
 * @param {ThunkApi} thunkAPI - An object containing the `dispatch` function and `rejectWithValue` method,
 *                              which are used to dispatch actions and handle rejections within the thunk.
 * @param {() => Promise<any>} logic - The asynchronous logic function that will be executed. This function
 *                                     should return a promise.
 *
 * @returns {Promise<any>} - The result of the `logic` function if it succeeds, or `rejectWithValue(null)`
 *                           if an error occurs.
 *
 */

export const thunkTryCatch = async (thunkAPI: ThunkApi, logic: () => Promise<any>) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    return await logic()
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(appActions.setAppStatus({ status: 'idle' }))
  }
}
