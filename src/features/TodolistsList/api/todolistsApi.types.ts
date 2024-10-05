export type TodolistType = {
  id: string
  addedDate: string
  order: number
  title: string
}

export type UpdateTodolistTitleArgType = {
  todolistId: string
  title: string
}
