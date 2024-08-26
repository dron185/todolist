import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  withCredentials: true,
  headers: {
    'API-KEY': '62a6656e-ad1b-4495-8bfe-e56dcc639e6b',
  },
})

// api
export const authAPI = {
  login: (data: LoginParamsType) => {
    return instance.post<ResponseType<{ userId?: number }>>('/auth/login', data)
  },
  logout: () => {
    return instance.delete<ResponseType>('/auth/login')
  },
  me() {
    return instance.get<ResponseType<meDataType>>('/auth/me')
  },
}

export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}

export type meDataType = {
  id: number
  email: string
  login: string
}

export const todolistsAPI = {
  getTodolists: () => {
    return instance.get<TodolistType[]>('/todo-lists')
  },
  createTodolist: (title: string) => {
    return instance.post<ResponseType<{ item: TodolistType }>>('/todo-lists', {
      title,
    })
  },
  deleteTodolist: (todolistId: string) => {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}`)
  },
  updateTodolist: (todolistId: string, title: string) => {
    return instance.put<ResponseType>(`/todo-lists/${todolistId}`, { title })
  },
  getTasks: (todolistId: string) => {
    return instance.get<GetTasksResponseType>(`/todo-lists/${todolistId}/tasks`)
  },
  deleteTask: (todolistId: string, taskId: string) => {
    return instance.delete<ResponseType>(
      `/todo-lists/${todolistId}/tasks/${taskId}`
    )
  },
  createTask: (todolistId: string, taskTitle: string) => {
    return instance.post<ResponseType<{ item: TaskType }>>(
      `/todo-lists/${todolistId}/tasks`,
      { title: taskTitle }
    )
  },
  updateTask: (
    todolistId: string,
    taskId: string,
    model: UpdateTaskModelType
  ) => {
    return instance.put<ResponseType<{ item: TaskType }>>(
      `/todo-lists/${todolistId}/tasks/${taskId}`,
      model
    )
  },
}

// types
export type TodolistType = {
  id: string
  addedDate: string
  order: number
  title: string
}
export type ResponseType<T = {}> = {
  data: T
  fieldsErrors: string[]
  messages: string[]
  resultCode: number
}

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
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
type GetTasksResponseType = {
  items: TaskType[]
  totalCount: number
  error: string
}
