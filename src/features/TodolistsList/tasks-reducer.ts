import { addTodolistAC, changeTodolistEntityStatusAC, removeTodolistAC, setTodolistsAC } from './todolists-reducer'
import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskArgs, UpdateTaskModelType } from 'api/api'
import { RequestStatusType, setAppStatusAC } from 'app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'
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

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialTasksState,
  reducers: {
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
      .addCase(addTaskTC.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift({
          ...action.payload.task,
          entityStatus: 'idle',
        })
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (index > -1) {
          tasks[index] = { ...tasks[index], ...action.payload.model }
        }
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

//export const tasksReducer = tasksSlice.reducer
export const { changeTaskEntityStatusAC } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors
// export const tasksThunks = { fetchTasksTC, removeTaskTC }

// thunks
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
  } catch (err) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  }
})

enum ResultCode {
  Success = 0,
  Error = 1,
  Captcha = 10,
}

export const addTaskTC = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; taskTitle: string }>(
  `${tasksSlice.name}/addTask`,
  async ({ todolistId, taskTitle }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(setAppStatusAC({ status: 'loading' }))
      dispatch(changeTodolistEntityStatusAC({ todolistId, status: 'loading' }))
      const res = await todolistsAPI.createTask(todolistId, taskTitle)
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatusAC({ status: 'succeeded' }))
        dispatch(changeTodolistEntityStatusAC({ todolistId, status: 'succeeded' }))
        return { task: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch)
      return rejectWithValue(null)
    }
  }
)

export const removeTaskTC = createAppAsyncThunk<
  { todolistId: string; taskId: string },
  { todolistId: string; taskId: string }
>(`${tasksSlice.name}/removeTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI

  try {
    dispatch(setAppStatusAC({ status: 'loading' }))
    dispatch(
      changeTaskEntityStatusAC({
        todolistId: arg.todolistId,
        taskId: arg.taskId,
        status: 'loading',
      })
    )

    const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({ status: 'succeeded' }))
      return { taskId: arg.taskId, todolistId: arg.todolistId }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (err: any) {
    handleServerNetworkError(err, dispatch)
    return rejectWithValue(null)
  }
})

export const updateTaskTC = createAppAsyncThunk<UpdateTaskArgs, UpdateTaskArgs>(
  `${tasksSlice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI
    try {
      dispatch(setAppStatusAC({ status: 'loading' }))
      dispatch(
        changeTaskEntityStatusAC({
          todolistId: arg.todolistId,
          taskId: arg.taskId,
          status: 'loading',
        })
      )

      const task = getState().tasks[arg.todolistId].find((t) => t.id === arg.taskId)
      if (!task) {
        console.warn('Task not found in the state')
        return rejectWithValue(null)
      }

      const apiModel: UpdateTaskModelType = {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
        ...arg.model,
      }

      const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({ status: 'succeeded' }))
        dispatch(
          changeTaskEntityStatusAC({
            todolistId: arg.todolistId,
            taskId: arg.taskId,
            status: 'succeeded',
          })
        )
        return arg
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch)
      return rejectWithValue(null)
    }
  }
)

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

// export const addTaskTC_ =
//   (todolistId: string, taskTitle: string): AppThunk =>
//   (dispatch) => {
//     dispatch(setAppStatusAC({ status: 'loading' }))
//     dispatch(changeTodolistEntityStatusAC({ todolistId, status: 'loading' }))
//     todolistsAPI
//       .createTask(todolistId, taskTitle)
//       .then((result) => {
//         if (result.data.resultCode === 0) {
//           dispatch(addTaskAC({ task: result.data.data.item }))
//           dispatch(setAppStatusAC({ status: 'succeeded' }))
//           dispatch(
//             changeTodolistEntityStatusAC({ todolistId, status: 'succeeded' })
//           )
//         } else {
//           handleServerAppError(result.data, dispatch)
//         }
//       })
//       .catch((err) => {
//         handleServerNetworkError(err, dispatch)
//       })
//   }

// export const updateTaskTC_ =
//   (
//     todolistId: string,
//     taskId: string,
//     domainModel: UpdateDomainTaskModelType
//   ): AppThunk =>
//   (dispatch, getState: () => AppRootStateType) => {
//     dispatch(setAppStatusAC({ status: 'loading' }))
//     dispatch(
//       changeTaskEntityStatusAC({ todolistId, taskId, status: 'loading' })
//     )
//     const allTasksFromState = getState().tasks
//     const tasksForCurrentTodolist = allTasksFromState[todolistId]
//     const task = tasksForCurrentTodolist.find((t) => t.id === taskId)
//
//     if (task) {
//       const apiModel: UpdateTaskModelType = {
//         title: task.title,
//         startDate: task.startDate,
//         priority: task.priority,
//         description: task.description,
//         deadline: task.deadline,
//         status: task.status,
//         ...domainModel,
//       }
//       todolistsAPI
//         .updateTask(todolistId, taskId, apiModel)
//         .then((res) => {
//           if (res.data.resultCode === 0) {
//             dispatch(updateTaskAC({ taskId, model: domainModel, todolistId }))
//             dispatch(setAppStatusAC({ status: 'succeeded' }))
//           } else {
//             handleServerAppError(res.data, dispatch)
//           }
//         })
//         .catch((err) => {
//           handleServerNetworkError(err, dispatch)
//         })
//         .finally(() => {
//           dispatch(
//             changeTaskEntityStatusAC({
//               todolistId,
//               taskId,
//               status: 'succeeded',
//             })
//           )
//         })
//     }
//   }
