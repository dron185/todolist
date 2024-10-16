import { tasksSlice, TasksState, tasksThunks } from 'features/todolistsList/model/tasksSlice'
import { TestAction } from 'common/types/types'
import { TaskPriorities, TaskStatuses } from 'features/todolistsList/lib'
import { todolistsThunks } from 'features/todolistsList/model/todolistsSlice'

let startState: TasksState
const tasksReducer = tasksSlice.reducer

beforeEach(() => {
  startState = {
    ['todolistId1']: [
      {
        id: '1',
        title: 'HTML&CSS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
      {
        id: '2',
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
      {
        id: '3',
        title: 'ReactJS',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
    ],
    ['todolistId2']: [
      {
        id: '1',
        title: 'bread',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
      {
        id: '2',
        title: 'milk',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
      {
        id: '3',
        title: 'tea',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
    ],
  }
})

test('correct task should be deleted from correct array', () => {
  let param = { taskId: '2', todolistId: 'todolistId2' }
  const action = tasksThunks.removeTask.fulfilled(param, '', param)
  const endState = tasksReducer(startState, action)

  expect(endState).toEqual({
    ['todolistId1']: [
      {
        id: '1',
        title: 'HTML&CSS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
      {
        id: '2',
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
      {
        id: '3',
        title: 'ReactJS',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
    ],
    ['todolistId2']: [
      {
        id: '1',
        title: 'bread',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
      {
        id: '3',
        title: 'tea',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
    ],
  })
})

test('correct task should be added to correct array', () => {
  type Action = TestAction<typeof tasksThunks.addTask.fulfilled>

  const action: Action = {
    type: tasksThunks.addTask.fulfilled.type,
    payload: {
      task: {
        todoListId: 'todolistId2',
        title: 'juice',
        status: TaskStatuses.New,
        addedDate: '',
        id: 'id exists',
        deadline: '',
        description: '',
        order: 0,
        priority: TaskPriorities.Low,
        startDate: '',
      },
    },
  }

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(4)
  expect(endState['todolistId2'][0].id).toBeDefined()
  expect(endState['todolistId2'][0].title).toBe('juice')
  expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {
  type Action = TestAction<typeof tasksThunks.updateTask.fulfilled>

  const action: Action = {
    type: tasksThunks.updateTask.fulfilled.type,
    payload: {
      taskId: '2',
      model: { status: TaskStatuses.New },
      todolistId: 'todolistId2',
    },
  }
  const endState = tasksReducer(startState, action)

  expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
  expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
})

test('title of specified task should be changed', () => {
  type Action = TestAction<typeof tasksThunks.updateTask.fulfilled>

  const action: Action = {
    type: tasksThunks.updateTask.fulfilled.type,
    payload: {
      taskId: '2',
      model: { title: 'Milkyway' },
      todolistId: 'todolistId2',
    },
  }
  const endState = tasksReducer(startState, action)

  // expect(endState['todolistId2'][1].isDone).toBe(false)
  // expect(endState['todolistId1'][1].isDone).toBe(true)
  expect(endState['todolistId2'][1].title).toBe('Milkyway')
  expect(endState['todolistId1'][1].title).toBe('JS')
})

test('new property with new array should be added when new todolist is added', () => {
  type Action = TestAction<typeof todolistsThunks.addTodolist.fulfilled>
  const action: Action = {
    type: todolistsThunks.addTodolist.fulfilled.type,
    payload: {
      todolist: { id: '1', title: 'New title', addedDate: '', order: 0 },
    },
  }
  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k != 'todolistId1' && k != 'todolistId2')
  if (!newKey) {
    throw Error('new key should be added')
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {
  type Action = TestAction<typeof todolistsThunks.removeTodolist.fulfilled>

  const action: Action = {
    type: todolistsThunks.removeTodolist.fulfilled.type,
    payload: {
      todolistId: 'todolistId2',
    },
  }
  const endState = tasksReducer(startState, action)
  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState['todolistId2']).toBeUndefined()
})

test('empty arrays should be added when we set todolists', () => {
  type Action = TestAction<typeof todolistsThunks.fetchTodolists.fulfilled>
  const action: Action = {
    type: todolistsThunks.fetchTodolists.fulfilled.type,
    payload: {
      todolists: [
        { id: '1', title: 'title-1', order: 0, addedDate: '' },
        { id: '2', title: 'title-2', order: 0, addedDate: '' },
      ],
    },
  }

  const endState = tasksReducer({}, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(2)
  expect(endState['1']).toStrictEqual([])
  expect(endState['2']).toStrictEqual([])
})

test('tasks should be added for todolist', () => {
  const action: TestAction<typeof tasksThunks.fetchTasks.fulfilled> = {
    type: tasksThunks.fetchTasks.fulfilled.type,
    payload: {
      tasks: startState['todolistId1'],
      todolistId: 'todolistId1',
    },
  }

  /*const action = fetchTasksTC.fulfilled(
    {
      tasks: startState['todolistId1'],
      todolistId: 'todolistId1',
    },
    'requestId', // можно просто пустую строку передать ''
    'todolistId1' // можно просто пустую строку передать ''
  )*/

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action
  )

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(0)
})
