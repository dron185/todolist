import { addTodolistAC, TodolistDomainType, todolistsSlice } from './todolists-reducer'
import { tasksSlice, TasksStateType } from './tasks-reducer'
import { TodolistType } from 'features/TodolistsList/api'

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

  const action = addTodolistAC({ todolist })
  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
