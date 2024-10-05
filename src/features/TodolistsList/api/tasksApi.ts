import { instance } from 'common/instance/instance'
import { BaseResponse } from 'common/types'
import {
  AddTaskArgs,
  GetTasksBaseResponse,
  RemoveTaskArgType,
  TaskType,
  UpdateTaskModelType,
} from 'features/TodolistsList/api/tasksApi.types'

export const tasksApi = {
  getTasks: (todolistId: string) => {
    return instance.get<GetTasksBaseResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  deleteTask: (arg: RemoveTaskArgType) => {
    return instance.delete<BaseResponse>(`/todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
  },
  createTask: (args: AddTaskArgs) => {
    const { todolistId, taskTitle } = args
    return instance.post<BaseResponse<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, {
      title: taskTitle,
    })
  },
  updateTask: (todolistId: string, taskId: string, model: UpdateTaskModelType) => {
    return instance.put<BaseResponse<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}
