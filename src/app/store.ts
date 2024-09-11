import { tasksReducer } from 'features/TodolistsList/tasks-reducer'
import { todolistsReducer } from 'features/TodolistsList/todolists-reducer'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { useDispatch } from 'react-redux'
import { appReducer } from './app-reducer'
import { authReducer } from 'features/Login/auth-reducer'
import {
  configureStore,
  combineReducers,
  UnknownAction,
} from '@reduxjs/toolkit'

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

// непосредственно создаём store
//export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware))

export const store = configureStore({ reducer: rootReducer })

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  UnknownAction
>

export type AppDispatch = ThunkDispatch<
  AppRootStateType,
  unknown,
  UnknownAction
>
export const useAppDispatch = () => useDispatch<AppDispatch>()

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store

//console.log(store.dispatch)
//console.log(store.getState())
