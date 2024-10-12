import { EditableSpan } from 'common/components'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'
import { useAppDispatch } from 'app/store'
import { TodolistDomainType, todolistsThunks } from 'features/todolistsList/model/todolistsSlice'

type Props = {
  todolist: TodolistDomainType
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id: todolistId, title, entityStatus } = todolist

  const dispatch = useAppDispatch()

  const removeTodolistHandler = () => {
    dispatch(todolistsThunks.removeTodolist(todolistId))
  }

  const updateTodolistTitleHandler = (title: string) => {
    dispatch(todolistsThunks.changeTodolistTitle({ todolistId, title }))
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <EditableSpan
        oldTitle={title}
        updateTitle={updateTodolistTitleHandler}
        disabled={entityStatus === 'loading'}
        entityStatus={entityStatus}
      />
      <IconButton
        onClick={removeTodolistHandler}
        disabled={entityStatus === 'loading'}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
