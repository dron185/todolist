import { todolistsAPI, TodolistType } from 'features/TodolistsList/api/todolistsApi'
import { RequestStatusType, setAppStatusAC } from 'app/app-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchTasks } from 'features/TodolistsList/model/tasksSlice'
import { AppThunk } from 'app/store'
import { clearTasksAndTodolists } from 'common/actions/common.actions'
import { createAppAsyncThunk, handleServerNetworkError } from 'common/utils'

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
    removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      if (index > -1) {
        state.splice(index, 1)
      }
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({
        ...action.payload.todolist,
        filter: 'all',
        entityStatus: 'idle',
      })
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ todolistId: string; title: string }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      if (index !== -1) state[index].title = action.payload.title
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      state[index].filter = action.payload.filter
    },
    /*setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle',
      }))
    },*/
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string; status: RequestStatusType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      state[index].entityStatus = action.payload.status
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({
          ...tl,
          filter: 'all',
          entityStatus: 'idle',
        }))
      })
      .addCase(clearTasksAndTodolists, () => {
        return []
      })
  },
  selectors: {
    selectTodolists: (state) => state,
  },
})

export const {
  removeTodolistAC,
  addTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  /*setTodolistsAC,*/
  changeTodolistEntityStatusAC,
} = todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors

// thunks

export const fetchTodolistsTC = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  `${todolistsSlice.name}/fetchTodolists`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(setAppStatusAC({ status: 'loading' }))
      const res = await todolistsAPI.getTodolists()
      dispatch(setAppStatusAC({ status: 'succeeded' }))
      res.data.forEach((tl) => {
        dispatch(fetchTasks(tl.id))
      })
      return { todolists: res.data }
    } catch (err) {
      handleServerNetworkError(err, dispatch)
      return rejectWithValue(null)
    }
  }
)

// export const fetchTodolistsTC_ = (): AppThunk => (dispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   todolistsAPI
//     .getTodolists()
//     .then((res) => {
//       dispatch(setTodolistsAC({ todolists: res.data }))
//       dispatch(setAppStatusAC({ status: 'succeeded' }))
//       return res.data
//     })
//     .then((todos) => {
//       todos.forEach((tl) => {
//         dispatch(fetchTasks(tl.id))
//       })
//     })
//     .catch((err) => {
//       handleServerNetworkError(err, dispatch)
//     })
// }

export const removeTodolistTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    dispatch(changeTodolistEntityStatusAC({ todolistId, status: 'loading' }))
    todolistsAPI
      .deleteTodolist(todolistId)
      .then((res) => {
        dispatch(removeTodolistAC({ todolistId }))
        dispatch(setAppStatusAC({ status: 'succeeded' }))
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch)
      })
  }

export const addTodolistTC =
  (title: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    todolistsAPI
      .createTodolist(title)
      .then((res) => {
        dispatch(addTodolistAC({ todolist: res.data.data.item }))
        dispatch(setAppStatusAC({ status: 'succeeded' }))
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch)
      })
  }

export const changeTodolistTitleTC =
  (todolistId: string, title: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    dispatch(changeTodolistEntityStatusAC({ todolistId, status: 'loading' }))
    todolistsAPI
      .updateTodolist(todolistId, title)
      .then((res) => {
        dispatch(changeTodolistTitleAC({ todolistId, title }))
        dispatch(setAppStatusAC({ status: 'succeeded' }))
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch)
      })
      .finally(() => {
        dispatch(changeTodolistEntityStatusAC({ todolistId, status: 'succeeded' }))
      })
  }
