import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppRootState, AppDispatch } from 'app/store'
import { BaseResponse } from 'common/types'

/**
 * This function is designed to get rid of duplication of type creation code in the thunk
 */

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootState
  dispatch: AppDispatch
  rejectValue: null | BaseResponse
}>()
