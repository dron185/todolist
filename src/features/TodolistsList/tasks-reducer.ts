import {
  addTodolistAC,
  changeTodolistEntityStatusAC,
  clearTodosDataAC,
  removeTodolistAC,
  setTodolistsAC,
} from './todolists-reducer'
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from 'api/api'
import { Dispatch } from 'redux'
import { AppRootStateType } from 'app/store'
import { RequestStatusType, setAppStatusAC } from 'app/app-reducer'
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export let initialTasksState: TasksStateType = {}

const slice = createSlice({
  name: 'tasks',
  initialState: initialTasksState,
  reducers: {
    removeTaskAC(
      state,
      action: PayloadAction<{ taskId: string; todolistId: string }>
    ) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        tasks.splice(index, 1)
      }
    },
    addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
      state[action.payload.task.todoListId].unshift({
        ...action.payload.task,
        entityStatus: 'idle',
      })
    },
    updateTaskAC(
      state,
      action: PayloadAction<{
        taskId: string
        model: UpdateDomainTaskModelType
        todolistId: string
      }>
    ) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model }
      }
    },
    setTasksAC(
      state,
      action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>
    ) {
      state[action.payload.todolistId] = action.payload.tasks.map((task) => ({
        ...task,
        entityStatus: 'idle',
      }))
    },
    changeTaskEntityStatusAC(
      state,
      action: PayloadAction<{
        todolistId: string
        taskId: string
        status: RequestStatusType
      }>
    ) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        tasks[index].entityStatus = action.payload.status
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.todolistId]
    })
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = []
      })
    })
    builder.addCase(clearTodosDataAC, () => {
      return {}
    })
  },
})

export const tasksReducer = slice.reducer
export const {
  removeTaskAC,
  addTaskAC,
  updateTaskAC,
  setTasksAC,
  changeTaskEntityStatusAC,
} = slice.actions

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  todolistsAPI
    .getTasks(todolistId)
    .then((result) => {
      const tasks = result.data.items
      dispatch(setTasksAC({ tasks, todolistId }))
      dispatch(setAppStatusAC({ status: 'succeeded' }))
    })
    .catch((err) => {
      handleServerNetworkError(err, dispatch)
    })
}
export const removeTaskTC =
  (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    dispatch(
      changeTaskEntityStatusAC({ todolistId, taskId, status: 'loading' })
    )
    todolistsAPI
      .deleteTask(todolistId, taskId)
      .then((result) => {
        if (result.data.resultCode === 0) {
          dispatch(removeTaskAC({ taskId, todolistId }))
          dispatch(setAppStatusAC({ status: 'succeeded' }))
        } else {
          handleServerAppError(result.data, dispatch)
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch)
      })
  }
export const addTaskTC =
  (todolistId: string, taskTitle: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    dispatch(changeTodolistEntityStatusAC({ todolistId, status: 'loading' }))
    todolistsAPI
      .createTask(todolistId, taskTitle)
      .then((result) => {
        if (result.data.resultCode === 0) {
          dispatch(addTaskAC({ task: result.data.data.item }))
          dispatch(setAppStatusAC({ status: 'succeeded' }))
          dispatch(
            changeTodolistEntityStatusAC({ todolistId, status: 'succeeded' })
          )
        } else {
          handleServerAppError(result.data, dispatch)
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch)
      })
  }

export const updateTaskTC =
  (
    todolistId: string,
    taskId: string,
    domainModel: UpdateDomainTaskModelType
  ) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    dispatch(
      changeTaskEntityStatusAC({ todolistId, taskId, status: 'loading' })
    )
    const allTasksFromState = getState().tasks
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find((t) => t.id === taskId)

    if (task) {
      const apiModel: UpdateTaskModelType = {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
        ...domainModel,
      }
      todolistsAPI
        .updateTask(todolistId, taskId, apiModel)
        .then((res) => {
          if (res.data.resultCode === 0) {
            dispatch(updateTaskAC({ taskId, model: domainModel, todolistId }))
            dispatch(setAppStatusAC({ status: 'succeeded' }))
          } else {
            handleServerAppError(res.data, dispatch)
          }
        })
        .catch((err) => {
          handleServerNetworkError(err, dispatch)
        })
        .finally(() => {
          dispatch(
            changeTaskEntityStatusAC({
              todolistId,
              taskId,
              status: 'succeeded',
            })
          )
        })
    }
  }

// types

export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType
}

export type TasksStateType = {
  [key: string]: TaskDomainType[]
}
