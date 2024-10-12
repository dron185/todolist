import React from 'react'
import { FilterValues, TodolistDomain, todolistsActions } from 'features/todolistsList/model/todolistsSlice'
import { useAppDispatch } from 'app/model/store'
import { MyButton } from 'features/todolistsList/ui/Todolist/FilterTasksButtons/MyButton'

type Props = {
  todolist: TodolistDomain
}

export const FilterTasksButtons = ({ todolist }: Props) => {
  const { id: todolistId, filter } = todolist

  const dispatch = useAppDispatch()

  const changeTodolistFilterHandler = (filter: FilterValues) => {
    dispatch(todolistsActions.changeTodolistFilter({ todolistId, filter }))
  }

  return (
    <>
      <MyButton
        variant={filter === 'all' ? 'outlined' : 'contained'}
        color={'info'}
        onClick={() => changeTodolistFilterHandler('all')}
        title={'All'}
      />
      <MyButton
        variant={filter === 'active' ? 'outlined' : 'contained'}
        color={'secondary'}
        onClick={() => changeTodolistFilterHandler('active')}
        title={'Active'}
      />
      <MyButton
        variant={filter === 'completed' ? 'outlined' : 'contained'}
        color={'success'}
        onClick={() => changeTodolistFilterHandler('completed')}
        title={'Completed'}
      />
    </>
  )
}
