import { todolistsAPI, TodolistType, UpdateTodolistTitleArgType } from 'features/TodolistsList/api/todolistsApi'
import { RequestStatusType } from 'app/appSlice'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchTasks } from 'features/TodolistsList/model/tasksSlice'
import { clearTasksAndTodolists } from 'common/actions/common.actions'
import { createAppAsyncThunk, handleServerAppError } from 'common/utils'
import { ResultCode } from 'common/enums'
import { thunkTryCatch } from 'common/utils/thunkTryCatch'

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

export const initialState: TodolistDomainType[] = []

export const todolistsSlice = createSlice({
  name: 'todolists',
  initialState,
  reducers: {
    changeTodolistFilterAC(state, action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string; status: RequestStatusType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      state[index].entityStatus = action.payload.status
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({
          ...tl,
          filter: 'all',
          entityStatus: 'idle',
        }))
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload.todolist,
          filter: 'all',
          entityStatus: 'idle',
        })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
        if (index !== -1) state[index].title = action.payload.title
      })
      .addCase(clearTasksAndTodolists, () => {
        return []
      })
  },
  selectors: {
    selectTodolists: (state) => state,
  },
})

// thunks

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  `${todolistsSlice.name}/fetchTodolists`,
  (_, thunkAPI) => {
    const { dispatch } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.getTodolists()
      res.data.forEach((tl) => {
        dispatch(fetchTasks(tl.id))
      })
      return { todolists: res.data }
    })
  }
)

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
  `${todolistsSlice.name}/removeTodolist`,
  (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(todolistsActions.changeTodolistEntityStatusAC({ todolistId, status: 'loading' }))

      const res = await todolistsAPI.deleteTodolist(todolistId)
      if (res.data.resultCode === ResultCode.Success) {
        return { todolistId }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    }).finally(() => {
      dispatch(todolistsActions.changeTodolistEntityStatusAC({ todolistId, status: 'succeeded' }))
    })
  }
)

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  `${todolistsSlice.name}/addTodolist`,
  (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.createTodolist(title)
      if (res.data.resultCode === ResultCode.Success) {
        return { todolist: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  }
)

const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
  `${todolistsSlice.name}/changeTodolistTitle`,
  (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(todolistsActions.changeTodolistEntityStatusAC({ todolistId: arg.todolistId, status: 'loading' }))
      const res = await todolistsAPI.updateTodolist(arg)
      if (res.data.resultCode === ResultCode.Success) {
        return arg
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    }).finally(() => {
      dispatch(todolistsActions.changeTodolistEntityStatusAC({ todolistId: arg.todolistId, status: 'succeeded' }))
    })
  }
)

//export const { changeTodolistFilterAC, changeTodolistEntityStatusAC } = todolistsSlice.actions
export const todolistsActions = todolistsSlice.actions
export const todolistsThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle }
export const { selectTodolists } = todolistsSlice.selectors

// export const _changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
//   `${todolistsSlice.name}/changeTodolistTitle`,
//   async (arg, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(setAppStatusAC({ status: 'loading' }))
//       dispatch(changeTodolistEntityStatusAC({ todolistId: arg.todolistId, status: 'loading' }))
//       const res = await todolistsAPI.updateTodolist(arg)
//       if (res.data.resultCode === ResultCode.Success) {
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//         return arg
//       } else {
//         handleServerAppError(res.data, dispatch)
//         return rejectWithValue(null)
//       }
//     } catch (err) {
//       handleServerNetworkError(err, dispatch)
//       return rejectWithValue(null)
//     } finally {
//       dispatch(changeTodolistEntityStatusAC({ todolistId: arg.todolistId, status: 'succeeded' }))
//     }
//   }
// )

// export const _addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
//   `${todolistsSlice.name}/addTodolist`,
//   async (title, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(setAppStatusAC({ status: 'loading' }))
//       const res = await todolistsAPI.createTodolist(title)
//       if (res.data.resultCode === ResultCode.Success) {
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//         return { todolist: res.data.data.item }
//       } else {
//         handleServerAppError(res.data, dispatch)
//         return rejectWithValue(null)
//       }
//     } catch (err) {
//       handleServerNetworkError(err, dispatch)
//       return rejectWithValue(null)
//     }
//   }
// )

// export const _removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
//   `${todolistsSlice.name}/removeTodolist`,
//   async (todolistId, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//
//     try {
//       dispatch(setAppStatusAC({ status: 'loading' }))
//       dispatch(changeTodolistEntityStatusAC({ todolistId, status: 'loading' }))
//
//       const res = await todolistsAPI.deleteTodolist(todolistId)
//       if (res.data.resultCode === ResultCode.Success) {
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//         return { todolistId }
//       } else {
//         handleServerAppError(res.data, dispatch)
//         return rejectWithValue(null)
//       }
//     } catch (err) {
//       handleServerNetworkError(err, dispatch)
//       return rejectWithValue(null)
//     }
//   }
// )

// export const _fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
//   `${todolistsSlice.name}/fetchTodolists`,
//   async (_, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(setAppStatusAC({ status: 'loading' }))
//       const res = await todolistsAPI.getTodolists()
//       dispatch(setAppStatusAC({ status: 'succeeded' }))
//       res.data.forEach((tl) => {
//         dispatch(fetchTasks(tl.id))
//       })
//       return { todolists: res.data }
//     } catch (err) {
//       handleServerNetworkError(err, dispatch)
//       return rejectWithValue(null)
//     }
//   }
// )
