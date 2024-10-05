import { TodolistDomainType, todolistsSlice, todolistsThunks } from 'features/TodolistsList/model/todolistsSlice'
import { tasksSlice, TasksStateType } from 'features/TodolistsList/model/tasksSlice'
import { TestAction } from 'common/types'
import { TodolistType } from 'features/TodolistsList/api/todolistsApi.types'

const todolistsReducer = todolistsSlice.reducer
const tasksReducer = tasksSlice.reducer

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: Array<TodolistDomainType> = []

  let todolist: TodolistType = {
    id: 'any id',
    title: 'New Todolist',
    addedDate: '',
    order: 0,
  }
  type Action = TestAction<typeof todolistsThunks.addTodolist.fulfilled>
  const action: Action = {
    type: todolistsThunks.addTodolist.fulfilled.type,
    payload: { todolist },
  }
  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
