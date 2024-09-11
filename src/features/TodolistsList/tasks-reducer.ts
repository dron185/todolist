import {
  addTodolistAC,
  changeTodolistEntityStatusAC,
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
import { AppRootStateType, AppThunk } from 'app/store'
import { RequestStatusType, setAppStatusAC } from 'app/app-reducer'
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { clearTasksAndTodolists } from 'common/actions/common.actions'
import { createAppAsyncThunk } from 'utils/create-app-async-thunk'

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

export let initialTasksState: TasksStateType = {}

export const fetchTasksTC = createAppAsyncThunk<
  {
    tasks: TaskType[]
    todolistId: string
  },
  string
>('tasks/fetchTasks', async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    dispatch(setAppStatusAC({ status: 'loading' }))
    const res = await todolistsAPI.getTasks(todolistId)
    const tasks = res.data.items
    dispatch(setAppStatusAC({ status: 'succeeded' }))
    return { tasks, todolistId }
  } catch (err: any) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  }
})

export const removeTaskTC = createAppAsyncThunk(
  'tasks/removeTask',
  async (param: { todolistId: string; taskId: string }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    try {
      dispatch(setAppStatusAC({ status: 'loading' }))
      dispatch(
        changeTaskEntityStatusAC({
          todolistId: param.todolistId,
          taskId: param.taskId,
          status: 'loading',
        })
      )

      const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId)
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({ status: 'succeeded' }))
        return { taskId: param.taskId, todolistId: param.todolistId }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (err: any) {
      handleServerNetworkError(err, dispatch)
      return rejectWithValue(null)
    }
  }
)

// thunks

// export const _fetchTasksTC =
//   (todolistId: string): AppThunk =>
//   (dispatch) => {
//     dispatch(setAppStatusAC({ status: 'loading' }))
//     todolistsAPI
//       .getTasks(todolistId)
//       .then((result) => {
//         const tasks = result.data.items
//         dispatch(setTasksAC({ tasks, todolistId }))
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//       })
//       .catch((err) => {
//         handleServerNetworkError(err, dispatch)
//       })
//   }

// export const removeTaskTC_ =
//   (todolistId: string, taskId: string): AppThunk =>
//   (dispatch) => {
//     dispatch(setAppStatusAC({ status: 'loading' }))
//     dispatch(
//       changeTaskEntityStatusAC({ todolistId, taskId, status: 'loading' })
//     )
//     todolistsAPI
//       .deleteTask(todolistId, taskId)
//       .then((result) => {
//         if (result.data.resultCode === 0) {
//           dispatch(removeTaskAC({ taskId, todolistId }))
//           dispatch(setAppStatusAC({ status: 'succeeded' }))
//         } else {
//           handleServerAppError(result.data, dispatch)
//         }
//       })
//       .catch((err) => {
//         handleServerNetworkError(err, dispatch)
//       })
//   }

export const addTaskTC =
  (todolistId: string, taskTitle: string): AppThunk =>
  (dispatch) => {
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
  ): AppThunk =>
  (dispatch, getState: () => AppRootStateType) => {
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

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialTasksState,
  reducers: {
    // removeTaskAC(
    //   state,
    //   action: PayloadAction<{ taskId: string; todolistId: string }>
    // ) {
    //   const tasks = state[action.payload.todolistId]
    //   const index = tasks.findIndex((t) => t.id === action.payload.taskId)
    //   if (index > -1) {
    //     tasks.splice(index, 1)
    //   }
    // },
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
    builder
      .addCase(addTodolistAC, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(removeTodolistAC, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(setTodolistsAC, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(clearTasksAndTodolists, () => {
        return {}
      })
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map((task) => ({
          ...task,
          entityStatus: 'idle',
        }))
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (index > -1) {
          tasks.splice(index, 1)
        }
      })
  },
  selectors: {
    selectTasks: (state) => state,
  },
})

export const tasksReducer = tasksSlice.reducer
export const { addTaskAC, updateTaskAC, changeTaskEntityStatusAC } =
  tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors
// export const tasksThunks = { fetchTasksTC, removeTaskTC }
