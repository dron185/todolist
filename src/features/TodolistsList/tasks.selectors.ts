import { AppRootStateType } from 'app/store'
import { TasksStateType } from 'features/TodolistsList/tasks-reducer'

export const selectTasks = (state: AppRootStateType): TasksStateType =>
  state.tasks
