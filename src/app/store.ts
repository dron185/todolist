import { tasksSlice } from 'features/TodolistsList/model/tasksSlice'
import { todolistsSlice } from 'features/TodolistsList/model/todolistsSlice'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { useDispatch } from 'react-redux'
import { appSlice } from 'app/appSlice'
import { authSlice } from 'features/Login/model/authSlice'
import { configureStore, UnknownAction, combineSlices } from '@reduxjs/toolkit'

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineSlices(tasksSlice, todolistsSlice, appSlice, authSlice)

// непосредственно создаём store
//export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware))

export const store = configureStore({ reducer: rootReducer })

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, UnknownAction>
export const useAppDispatch = () => useDispatch<AppDispatch>()

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store

//console.log(store.dispatch)
//console.log(store.getState())
