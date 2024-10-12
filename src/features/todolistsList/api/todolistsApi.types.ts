export type Todolist = {
  id: string
  addedDate: string
  order: number
  title: string
}

export type UpdateTodolistTitleArg = {
  todolistId: string
  title: string
}
