import { tasksSlice } from 'features/TodolistsList/model/tasksSlice'
import { todolistsSlice } from 'features/TodolistsList/model/todolistsSlice'
import { ThunkDispatch } from 'redux-thunk'
import { useDispatch } from 'react-redux'
import { appSlice } from 'app/appSlice'
import { authSlice } from 'features/Login/model/authSlice'
import { combineSlices, configureStore, UnknownAction } from '@reduxjs/toolkit'

// объединяя reducer-ы с помощью combineReducers или combineSlices,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineSlices(tasksSlice, todolistsSlice, appSlice, authSlice)

// непосредственно создаём store
export const store = configureStore({ reducer: rootReducer })

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, UnknownAction>
export const useAppDispatch = () => useDispatch<AppDispatch>()
