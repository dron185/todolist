import { v1 } from 'uuid'

import {
  addTodolistAC,
  changeTodolistEntityStatusAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  FilterValuesType,
  removeTodolistAC,
  setTodolistsAC,
  TodolistDomainType,
  todolistsSlice,
} from './todolists-reducer'
import { TodolistType } from 'features/TodolistsList/api'
import { RequestStatusType } from 'app/app-reducer'

let todolistID1: string
let todolistID2: string
let startState: TodolistDomainType[]
const todolistsReducer = todolistsSlice.reducer

beforeEach(() => {
  todolistID1 = v1()
  todolistID2 = v1()
  startState = [
    {
      id: todolistID1,
      title: 'What to learn',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'idle',
    },
    {
      id: todolistID2,
      title: 'What to buy',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'idle',
    },
  ]
})

test('correct todolist should be removed', () => {
  // 2. Действие
  const endState = todolistsReducer(startState, removeTodolistAC({ todolistId: todolistID1 }))

  // 3. Проверяем, что наши действия (изменения state) соответствуют ожиданию
  // в массиве останется один тудулист
  expect(endState.length).toBe(1)
  // удалится нужный тудулист, а не любой
  expect(endState[0].id).toBe(todolistID2)
})

test('correct todolist should be added', () => {
  let todolist: TodolistType = {
    id: 'any id',
    title: 'New Todolist',
    addedDate: '',
    order: 0,
  }
  const endState = todolistsReducer(startState, addTodolistAC({ todolist }))

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(todolist.title)
  expect(endState[0].filter).toBe('all')
})

test('correct todolist should change its name', () => {
  let newTitle = 'New Todolist'

  const action = changeTodolistTitleAC({
    todolistId: todolistID2,
    title: newTitle,
  })

  const endState = todolistsReducer(startState, action)

  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(newTitle)
})

test('correct filter of todolist should be changed', () => {
  let newFilter: FilterValuesType = 'completed'

  // const action = {
  //     type: 'CHANGE-TODOLIST-FILTER',
  //     payload: {
  //         id: todolistID2,
  //         filter: 'completed',
  //     },
  // } as const

  const action = changeTodolistFilterAC({
    todolistId: todolistID2,
    filter: newFilter,
  })

  const endState = todolistsReducer(startState, action)

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilter)
})

test('todolists should be set to the state', () => {
  const action = setTodolistsAC({ todolists: startState })
  const endState = todolistsReducer([], action)

  expect(endState.length).toBe(2)
})

test('correct entity status of todolist should be changed', () => {
  let newStatus: RequestStatusType = 'loading'
  const action = changeTodolistEntityStatusAC({
    todolistId: todolistID2,
    status: newStatus,
  })
  const endState = todolistsReducer(startState, action)

  expect(endState[0].entityStatus).toBe('idle')
  expect(endState[1].entityStatus).toBe(newStatus)
})
