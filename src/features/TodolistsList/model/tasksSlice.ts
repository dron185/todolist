import { todolistsActions, todolistsThunks } from 'features/TodolistsList/model/todolistsSlice'
import {
  AddTaskArgs,
  RemoveTaskArgType,
  TaskType,
  todolistsAPI,
  UpdateTaskArgs,
  UpdateTaskModelType,
} from 'features/TodolistsList/api/todolistsApi'
import { RequestStatusType } from 'app/appSlice'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { clearTasksAndTodolists } from 'common/actions/common.actions'
import { createAppAsyncThunk, handleServerAppError } from 'common/utils'
import { ResultCode } from 'common/enums'
import { thunkTryCatch } from 'common/utils/thunkTryCatch'

// types
export type UpdateDomainTaskModelType = Partial<UpdateTaskModelType>
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
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(clearTasksAndTodolists, () => {
        return {}
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map((task) => ({
          ...task,
          entityStatus: 'idle',
        }))
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift({
          ...action.payload.task,
          entityStatus: 'idle',
        })
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (index > -1) {
          tasks[index] = { ...tasks[index], ...action.payload.model }
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
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

export const { changeTaskEntityStatusAC } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors
// export const tasksThunks = { fetchTasksTC, removeTaskTC }

// thunks

// export const _fetchTasks = createAppAsyncThunk<
//   {
//     tasks: TaskType[]
//     todolistId: string
//   },
//   string
// >(`${tasksSlice.name}/fetchTasks`, async (todolistId, thunkAPI) => {
//   const { dispatch, rejectWithValue } = thunkAPI
//
//   try {
//     dispatch(setAppStatusAC({ status: 'loading' }))
//     const res = await todolistsAPI.getTasks(todolistId)
//     const tasks = res.data.items
//     dispatch(setAppStatusAC({ status: 'succeeded' }))
//     return { tasks, todolistId }
//   } catch (err) {
//     handleServerNetworkError(err, dispatch)
//     return rejectWithValue(null)
//   }
// })

export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${tasksSlice.name}/fetchTasks`,
  (todolistId, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.getTasks(todolistId)
      const tasks = res.data.items
      return { tasks, todolistId }
    })
  }
)

export const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgs>(
  `${tasksSlice.name}/addTask`,
  (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(todolistsActions.changeTodolistEntityStatusAC({ todolistId: arg.todolistId, status: 'loading' }))
      const res = await todolistsAPI.createTask(arg)
      if (res.data.resultCode === ResultCode.Success) {
        return { task: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    }).finally(() => {
      dispatch(todolistsActions.changeTodolistEntityStatusAC({ todolistId: arg.todolistId, status: 'succeeded' }))
    })
  }
)

// export const _addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgs>(
//   `${tasksSlice.name}/addTask`,
//   async (arg, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(setAppStatusAC({ status: 'loading' }))
//       dispatch(changeTodolistEntityStatusAC({ todolistId: arg.todolistId, status: 'loading' }))
//       const res = await todolistsAPI.createTask(arg)
//       if (res.data.resultCode === ResultCode.Success) {
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//         dispatch(changeTodolistEntityStatusAC({ todolistId: arg.todolistId, status: 'succeeded' }))
//         return { task: res.data.data.item }
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

export const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>(
  `${tasksSlice.name}/removeTask`,
  (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(
        changeTaskEntityStatusAC({
          todolistId: arg.todolistId,
          taskId: arg.taskId,
          status: 'loading',
        })
      )
      const res = await todolistsAPI.deleteTask(arg)
      if (res.data.resultCode === ResultCode.Success) {
        return arg
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    }).finally(() => {
      dispatch(
        changeTaskEntityStatusAC({
          todolistId: arg.todolistId,
          taskId: arg.taskId,
          status: 'succeeded',
        })
      )
    })
  }
)

// export const _removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>(
//   `${tasksSlice.name}/removeTask`,
//   async (arg, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//
//     try {
//       dispatch(setAppStatusAC({ status: 'loading' }))
//       dispatch(
//         changeTaskEntityStatusAC({
//           todolistId: arg.todolistId,
//           taskId: arg.taskId,
//           status: 'loading',
//         })
//       )
//
//       const res = await todolistsAPI.deleteTask(arg)
//       if (res.data.resultCode === ResultCode.Success) {
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//         return arg
//       } else {
//         handleServerAppError(res.data, dispatch)
//         return rejectWithValue(null)
//       }
//     } catch (err: any) {
//       handleServerNetworkError(err, dispatch)
//       return rejectWithValue(null)
//     }
//   }
// )

export const updateTask = createAppAsyncThunk<UpdateTaskArgs, UpdateTaskArgs>(
  `${tasksSlice.name}/updateTask`,
  (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
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
      if (res.data.resultCode === ResultCode.Success) {
        return arg
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    }).finally(() => {
      dispatch(
        changeTaskEntityStatusAC({
          todolistId: arg.todolistId,
          taskId: arg.taskId,
          status: 'succeeded',
        })
      )
    })
  }
)

// export const _updateTask = createAppAsyncThunk<UpdateTaskArgs, UpdateTaskArgs>(
//   `${tasksSlice.name}/updateTask`,
//   async (arg, thunkAPI) => {
//     const { dispatch, rejectWithValue, getState } = thunkAPI
//     try {
//       dispatch(setAppStatusAC({ status: 'loading' }))
//       dispatch(
//         changeTaskEntityStatusAC({
//           todolistId: arg.todolistId,
//           taskId: arg.taskId,
//           status: 'loading',
//         })
//       )
//
//       const task = getState().tasks[arg.todolistId].find((t) => t.id === arg.taskId)
//       if (!task) {
//         console.warn('Task not found in the state')
//         return rejectWithValue(null)
//       }
//
//       const apiModel: UpdateTaskModelType = {
//         title: task.title,
//         startDate: task.startDate,
//         priority: task.priority,
//         description: task.description,
//         deadline: task.deadline,
//         status: task.status,
//         ...arg.model,
//       }
//
//       const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
//       if (res.data.resultCode === ResultCode.Success) {
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//         dispatch(
//           changeTaskEntityStatusAC({
//             todolistId: arg.todolistId,
//             taskId: arg.taskId,
//             status: 'succeeded',
//           })
//         )
//         return arg
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
