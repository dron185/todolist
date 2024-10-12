import { TaskPriorities, TaskStatuses } from 'features/todolistsList/lib'

export type Task = {
  id: string
  title: string
  description: string
  todoListId: string
  order: number
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  addedDate: string
}

export type UpdateTaskModel = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}

export type GetTasksBaseResponse = {
  items: Task[]
  totalCount: number
  error: string
}

export type AddTaskArgs = {
  todolistId: string
  taskTitle: string
}

export type UpdateTaskArgs = {
  taskId: string
  model: Partial<UpdateTaskModel>
  todolistId: string
}

export type RemoveTaskArg = {
  todolistId: string
  taskId: string
}
