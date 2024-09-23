import { Provider } from 'react-redux'
import { combineReducers } from 'redux'
import { tasksSlice } from 'features/TodolistsList/model/tasksSlice'
import { todolistsSlice } from 'features/TodolistsList/model/todolistsSlice'
import { v1 } from 'uuid'
import { AppRootStateType } from 'app/store'
import { appSlice } from 'app/app-reducer'
import { authSlice } from 'features/Login/model/authSlice'
import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import { TaskPriorities, TaskStatuses } from 'features/TodolistsList/lib'

const rootReducer = combineReducers({
  [tasksSlice.reducerPath]: tasksSlice.reducer,
  [todolistsSlice.reducerPath]: todolistsSlice.reducer,
  [appSlice.reducerPath]: appSlice.reducer,
  [authSlice.reducerPath]: authSlice.reducer,
})

const initialGlobalState: AppRootStateType = {
  todolists: [
    {
      id: 'todolistId1',
      title: 'What to learn',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'idle',
    },
    {
      id: 'todolistId2',
      title: 'What to buy',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'loading',
    },
  ],
  tasks: {
    ['todolistId1']: [
      {
        id: v1(),
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
        id: v1(),
        title: 'JS',
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
        id: v1(),
        title: 'Milk',
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
        id: v1(),
        title: 'React Book',
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
  },
  app: {
    error: null,
    status: 'succeeded',
    isInitialized: true,
  },
  auth: {
    isLoggedIn: true,
  },
}

//export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState, applyMiddleware(thunkMiddleware));

export const storyBookStore = configureStore({
  reducer: rootReducer,
  preloadedState: initialGlobalState,
  //middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>
}

// export const BrowserRouterDecorator = (storyFn: () => React.ReactNode) => {
//     return <MemoryRouter >{storyFn()}</MemoryRouter>
// }
