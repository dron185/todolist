import { AppRootStateType } from 'app/store'
import { TodolistDomainType } from 'features/TodolistsList/todolists-reducer'

export const selectTodolists = (
  state: AppRootStateType
): Array<TodolistDomainType> => state.todolists
