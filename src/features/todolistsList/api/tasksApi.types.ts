import { TaskPriorities, TaskStatuses } from 'features/todolistsList/lib'

export type TaskType = {
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

export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}

export type GetTasksBaseResponse = {
  items: TaskType[]
  totalCount: number
  error: string
}

export type AddTaskArgs = {
  todolistId: string
  taskTitle: string
}

export type UpdateTaskArgs = {
  taskId: string
  model: Partial<UpdateTaskModelType>
  todolistId: string
}

export type RemoveTaskArgType = {
  todolistId: string
  taskId: string
}
