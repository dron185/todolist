import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppRootStateType, ThunkDispatchType } from 'app/store'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: ThunkDispatchType
  rejectValue: null
}>()
