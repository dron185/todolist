import { v1 } from 'uuid'

import {
  FilterValues,
  TodolistDomain,
  todolistsActions,
  todolistsSlice,
  todolistsThunks,
} from 'features/todolistsList/model/todolistsSlice'
import { RequestStatus } from 'app/model/appSlice'
import { TestAction } from 'common/types'
import { Todolist } from 'features/todolistsList/api/todolistsApi.types'

let todolistID1: string
let todolistID2: string
let startState: TodolistDomain[]
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
  type Action = TestAction<typeof todolistsThunks.removeTodolist.fulfilled>

  const action: Action = {
    type: todolistsThunks.removeTodolist.fulfilled.type,
    payload: {
      todolistId: todolistID1,
    },
  }
  const endState = todolistsReducer(startState, action)

  // 3. Проверяем, что наши действия (изменения state) соответствуют ожиданию
  // в массиве останется один тудулист
  expect(endState.length).toBe(1)
  // удалится нужный тудулист, а не любой
  expect(endState[0].id).toBe(todolistID2)
})

test('correct todolist should be added', () => {
  type Action = TestAction<typeof todolistsThunks.addTodolist.fulfilled>

  let todolist: Todolist = {
    id: 'any id',
    title: 'New Todolist',
    addedDate: '',
    order: 0,
  }

  const action: Action = {
    type: todolistsThunks.addTodolist.fulfilled.type,
    payload: { todolist },
  }
  const endState = todolistsReducer(startState, action)

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(todolist.title)
  expect(endState[0].filter).toBe('all')
})

test('correct todolist should change its name', () => {
  type Action = TestAction<typeof todolistsThunks.changeTodolistTitle.fulfilled>
  let newTitle = 'New Todolist'

  const action: Action = {
    type: todolistsThunks.changeTodolistTitle.fulfilled.type,
    payload: {
      todolistId: todolistID2,
      title: newTitle,
    },
  }

  const endState = todolistsReducer(startState, action)

  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(newTitle)
})

test('correct filter of todolist should be changed', () => {
  let newFilter: FilterValues = 'completed'

  // const action = {
  //     type: 'CHANGE-TODOLIST-FILTER',
  //     payload: {
  //         id: todolistID2,
  //         filter: 'completed',
  //     },
  // } as const

  const action = todolistsActions.changeTodolistFilter({
    todolistId: todolistID2,
    filter: newFilter,
  })

  const endState = todolistsReducer(startState, action)

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilter)
})

test('todolists should be set to the state', () => {
  type Action = TestAction<typeof todolistsThunks.fetchTodolists.fulfilled>

  const action: Action = {
    type: todolistsThunks.fetchTodolists.fulfilled.type,
    payload: { todolists: startState },
  }
  const endState = todolistsReducer([], action)

  expect(endState.length).toBe(2)
})

test('correct entity status of todolist should be changed', () => {
  let newStatus: RequestStatus = 'loading'
  const action = todolistsActions.changeTodolistEntityStatus({
    todolistId: todolistID2,
    status: newStatus,
  })
  const endState = todolistsReducer(startState, action)

  expect(endState[0].entityStatus).toBe('idle')
  expect(endState[1].entityStatus).toBe(newStatus)
})
