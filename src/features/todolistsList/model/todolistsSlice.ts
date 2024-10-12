import { todolistsApi } from 'features/todolistsList/api/todolistsApi'
import { RequestStatus } from 'app/model/appSlice'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from 'common/utils'
import { ResultCode } from 'common/enums'
import { tasksThunks } from 'features/todolistsList/model/tasksSlice'
import { clearTasksAndTodolists } from 'common/actions'
import { Todolist, UpdateTodolistTitleArg } from 'features/todolistsList/api/todolistsApi.types'

export type FilterValues = 'all' | 'active' | 'completed'
export type TodolistDomain = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export const initialState: TodolistDomain[] = []

export const todolistsSlice = createSlice({
  name: 'todolists',
  initialState,
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ todolistId: string; filter: FilterValues }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ todolistId: string; status: RequestStatus }>) {
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

const fetchTodolists = createAppAsyncThunk<{ todolists: Todolist[] }, void>(
  `${todolistsSlice.name}/fetchTodolists`,
  async (_, { dispatch }) => {
    //const { dispatch } = thunkAPI
    const res = await todolistsApi.getTodolists()
    res.data.forEach((tl) => {
      dispatch(tasksThunks.fetchTasks(tl.id))
    })
    return { todolists: res.data }
  }
)

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
  `${todolistsSlice.name}/removeTodolist`,
  async (todolistId, { dispatch, rejectWithValue }) => {
    dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, status: 'loading' }))

    const res = await todolistsApi.deleteTodolist(todolistId).finally(() => {
      dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, status: 'idle' }))
    })

    if (res.data.resultCode === ResultCode.Success) {
      return { todolistId }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

const addTodolist = createAppAsyncThunk<{ todolist: Todolist }, string>(
  `${todolistsSlice.name}/addTodolist`,
  async (title, { rejectWithValue }) => {
    const res = await todolistsApi.createTodolist(title)
    if (res.data.resultCode === ResultCode.Success) {
      return { todolist: res.data.data.item }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArg, UpdateTodolistTitleArg>(
  `${todolistsSlice.name}/changeTodolistTitle`,
  async (arg, { dispatch, rejectWithValue }) => {
    dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId: arg.todolistId, status: 'loading' }))
    const res = await todolistsApi.updateTodolist(arg).finally(() => {
      dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId: arg.todolistId, status: 'succeeded' }))
    })
    if (res.data.resultCode === ResultCode.Success) {
      return arg
    } else {
      return rejectWithValue(res.data)
    }
  }
)

export const todolistsActions = todolistsSlice.actions
export const todolistsThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle }
export const { selectTodolists } = todolistsSlice.selectors
