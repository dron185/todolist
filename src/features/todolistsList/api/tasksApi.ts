import { instance } from 'common/instance/instance'
import { BaseResponse } from 'common/types'
import {
  AddTaskArgs,
  GetTasksBaseResponse,
  RemoveTaskArg,
  Task,
  UpdateTaskModel,
} from 'features/todolistsList/api/tasksApi.types'

export const tasksApi = {
  getTasks: (todolistId: string) => {
    return instance.get<GetTasksBaseResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  deleteTask: (arg: RemoveTaskArg) => {
    return instance.delete<BaseResponse>(`/todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
  },
  createTask: (args: AddTaskArgs) => {
    const { todolistId, taskTitle } = args
    return instance.post<BaseResponse<{ item: Task }>>(`/todo-lists/${todolistId}/tasks`, {
      title: taskTitle,
    })
  },
  updateTask: (todolistId: string, taskId: string, model: UpdateTaskModel) => {
    return instance.put<BaseResponse<{ item: Task }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}
