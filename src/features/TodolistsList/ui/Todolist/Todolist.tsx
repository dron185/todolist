import React from 'react'
import Box from '@mui/material/Box'
import { filterButtonsContainerSx } from 'features/TodolistsList/ui/Todolist/Todolist.styles'
import { TodolistDomainType } from 'features/TodolistsList/model/todolistsSlice'
import { tasksThunks } from 'features/TodolistsList/model/tasksSlice'
import { AddItemForm } from 'common/components'
import { useAppDispatch } from 'app/store'
import { FilterTasksButtons } from 'features/TodolistsList/ui/Todolist/FilterTasksButtons/FilterTasksButtons'
import { Tasks } from 'features/TodolistsList/ui/Todolist/Tasks/Tasks'
import { TodolistTitle } from 'features/TodolistsList/ui/Todolist/TodolistTitle/TodolistTitle'

type Props = {
  todolist: TodolistDomainType
  demo?: boolean
}

export const Todolist = ({ todolist, demo = false }: Props) => {
  const { id: todolistId, entityStatus } = todolist

  const dispatch = useAppDispatch()

  const addTaskHandler = (taskTitle: string) => {
    dispatch(tasksThunks.addTask({ todolistId, taskTitle }))
  }

  return (
    <>
      <TodolistTitle todolist={todolist} />
      <AddItemForm
        addItem={addTaskHandler}
        disabled={entityStatus === 'loading'}
      />
      <Tasks todolist={todolist} />
      <Box sx={filterButtonsContainerSx}>
        <FilterTasksButtons todolist={todolist} />
      </Box>
    </>
  )
}
