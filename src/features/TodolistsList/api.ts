import { UpdateDomainTaskModelType } from 'features/TodolistsList/tasks-reducer'
import { TaskPriorities, TaskStatuses } from 'common/enums/enums'
import { instance } from 'common/instance/instance'
import { BaseResponse } from 'common/types'

// api

export const todolistsAPI = {
  getTodolists: () => {
    return instance.get<TodolistType[]>('/todo-lists')
  },
  createTodolist: (title: string) => {
    return instance.post<BaseResponse<{ item: TodolistType }>>('/todo-lists', {
      title,
    })
  },
  deleteTodolist: (todolistId: string) => {
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}`)
  },
  updateTodolist: (todolistId: string, title: string) => {
    return instance.put<BaseResponse>(`/todo-lists/${todolistId}`, { title })
  },
  getTasks: (todolistId: string) => {
    return instance.get<GetTasksBaseResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  deleteTask: (todolistId: string, taskId: string) => {
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
  createTask: (todolistId: string, taskTitle: string) => {
    return instance.post<BaseResponse<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, { title: taskTitle })
  },
  updateTask: (todolistId: string, taskId: string, model: UpdateTaskModelType) => {
    return instance.put<BaseResponse<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}

// types
export type UpdateTaskArgs = {
  taskId: string
  model: UpdateDomainTaskModelType
  todolistId: string
}

export type TodolistType = {
  id: string
  addedDate: string
  order: number
  title: string
}

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
type GetTasksBaseResponse = {
  items: TaskType[]
  totalCount: number
  error: string
}
