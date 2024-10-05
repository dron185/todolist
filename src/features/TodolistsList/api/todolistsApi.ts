import { instance } from 'common/instance/instance'
import { BaseResponse } from 'common/types'
import { TodolistType, UpdateTodolistTitleArgType } from './todolistsApi.types'

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
  updateTodolist: (arg: UpdateTodolistTitleArgType) => {
    return instance.put<BaseResponse>(`/todo-lists/${arg.todolistId}`, { title: arg.title })
  },
}
