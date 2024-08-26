import { todolistsAPI, TodolistType } from 'api/api'
import { Dispatch } from 'redux'
import { RequestStatusType, setAppStatusAC } from 'app/app-reducer'
import { handleServerNetworkError } from 'utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchTasksTC } from './tasks-reducer'

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type ChangeTodolistEntityStatusActionType = ReturnType<
  typeof changeTodolistEntityStatusAC
>
export type ClearTodosDataActionType = ReturnType<typeof clearTodosDataAC>

export const initialState: TodolistDomainType[] = []

const slice = createSlice({
  name: 'app',
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
    changeTodolistTitleAC(
      state,
      action: PayloadAction<{ todolistId: string; title: string }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      state[index].title = action.payload.title
    },
    changeTodolistFilterAC(
      state,
      action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      state[index].filter = action.payload.filter
    },
    setTodolistsAC(
      state,
      action: PayloadAction<{ todolists: Array<TodolistType> }>
    ) {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle',
      }))
    },
    changeTodolistEntityStatusAC(
      state,
      action: PayloadAction<{ todolistId: string; status: RequestStatusType }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      state[index].entityStatus = action.payload.status
    },
    clearTodosDataAC() {
      return []
    },
  },
})

export const todolistsReducer = slice.reducer
export const {
  removeTodolistAC,
  addTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  setTodolistsAC,
  changeTodolistEntityStatusAC,
  clearTodosDataAC,
} = slice.actions

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

// thunks
export const fetchTodolistsTC = () => (dispatch: any) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  todolistsAPI
    .getTodolists()
    .then((res) => {
      dispatch(setTodolistsAC({ todolists: res.data }))
      dispatch(setAppStatusAC({ status: 'succeeded' }))
      return res.data
    })
    .then((todos) => {
      todos.forEach((tl) => {
        dispatch(fetchTasksTC(tl.id))
      })
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}

export const removeTodolistTC =
  (todolistId: string) => (dispatch: Dispatch) => {
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

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
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
  (todolistId: string, title: string) => (dispatch: Dispatch) => {
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
        dispatch(
          changeTodolistEntityStatusAC({ todolistId, status: 'succeeded' })
        )
      })
  }

// export type ActionsType =
//     | RemoveTodolistActionType
//     | AddTodolistActionType
//     | ReturnType<typeof changeTodolistTitleAC>
//     | ReturnType<typeof changeTodolistFilterAC>
//     | SetTodolistsActionType
//     | ChangeTodolistEntityStatusActionType

//type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType>
