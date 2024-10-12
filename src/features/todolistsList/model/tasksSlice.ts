import { FilterValues, todolistsActions, todolistsThunks } from 'features/todolistsList/model/todolistsSlice'
import { RequestStatus } from 'app/model/appSlice'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { clearTasksAndTodolists } from 'common/actions/common.actions'
import { createAppAsyncThunk } from 'common/utils'
import { ResultCode } from 'common/enums'
import {
  AddTaskArgs,
  RemoveTaskArg,
  Task,
  UpdateTaskArgs,
  UpdateTaskModel,
} from 'features/todolistsList/api/tasksApi.types'
import { tasksApi } from 'features/todolistsList/api/tasksApi'
import { TaskStatuses } from 'features/todolistsList/lib'

// types
export type TaskDomain = Task & {
  entityStatus: RequestStatus
}
export type TasksState = {
  [key: string]: TaskDomain[]
}

export let initialTasksState: TasksState = {}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialTasksState,
  reducers: {
    changeTaskEntityStatus(
      state,
      action: PayloadAction<{
        todolistId: string
        taskId: string
        status: RequestStatus
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
    selectFilteredTasks: (state, todolistId: string, filter: FilterValues) => {
      let tasksForTodoList = state[todolistId]

      if (filter === 'completed') {
        tasksForTodoList = tasksForTodoList.filter((t) => t.status === TaskStatuses.Completed)
      }
      if (filter === 'active') {
        tasksForTodoList = tasksForTodoList.filter((t) => t.status === TaskStatuses.New)
      }

      return tasksForTodoList
    },
  },
})

export const tasksActions = tasksSlice.actions
export const { selectTasks, selectFilteredTasks } = tasksSlice.selectors

// thunks

const fetchTasks = createAppAsyncThunk<{ tasks: Task[]; todolistId: string }, string>(
  `${tasksSlice.name}/fetchTasks`,
  async (todolistId) => {
    const res = await tasksApi.getTasks(todolistId)
    const tasks = res.data.items
    return { tasks, todolistId }
  }
)

const addTask = createAppAsyncThunk<
  {
    task: Task
  },
  AddTaskArgs
>(`${tasksSlice.name}/addTask`, async (arg, { dispatch, rejectWithValue }) => {
  dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId: arg.todolistId, status: 'loading' }))
  const res = await tasksApi.createTask(arg).finally(() => {
    dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId: arg.todolistId, status: 'idle' }))
  })
  if (res.data.resultCode === ResultCode.Success) {
    return { task: res.data.data.item }
  } else {
    return rejectWithValue(res.data)
  }
})

const removeTask = createAppAsyncThunk<RemoveTaskArg, RemoveTaskArg>(
  `${tasksSlice.name}/removeTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    dispatch(
      tasksActions.changeTaskEntityStatus({
        todolistId: arg.todolistId,
        taskId: arg.taskId,
        status: 'loading',
      })
    )
    const res = await tasksApi.deleteTask(arg).finally(() => {
      dispatch(
        tasksActions.changeTaskEntityStatus({
          todolistId: arg.todolistId,
          taskId: arg.taskId,
          status: 'idle',
        })
      )
    })
    if (res.data.resultCode === ResultCode.Success) {
      return arg
    } else {
      return rejectWithValue(res.data)
    }
  }
)

const updateTask = createAppAsyncThunk<UpdateTaskArgs, UpdateTaskArgs>(
  `${tasksSlice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI

    dispatch(
      tasksActions.changeTaskEntityStatus({
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

    const apiModel: UpdateTaskModel = {
      title: task.title,
      startDate: task.startDate,
      priority: task.priority,
      description: task.description,
      deadline: task.deadline,
      status: task.status,
      ...arg.model,
    }

    const res = await tasksApi.updateTask(arg.todolistId, arg.taskId, apiModel).finally(() => {
      dispatch(
        tasksActions.changeTaskEntityStatus({
          todolistId: arg.todolistId,
          taskId: arg.taskId,
          status: 'idle',
        })
      )
    })
    if (res.data.resultCode === ResultCode.Success) {
      return arg
    } else {
      return rejectWithValue(res.data)
    }
  }
)

export const tasksThunks = { fetchTasks, addTask, removeTask, updateTask }
