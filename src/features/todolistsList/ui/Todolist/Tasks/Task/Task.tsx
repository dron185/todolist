import React, { ChangeEvent } from 'react'
import ListItem from '@mui/material/ListItem'
import { getListItemSx } from 'features/todolistsList/ui/Todolist/Todolist.styles'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { TaskDomain, tasksThunks } from 'features/todolistsList/model/tasksSlice'
import { TaskStatuses } from 'features/todolistsList/lib'
import { EditableSpan } from 'common/components'
import { useAppDispatch } from 'app/store'

type Props = {
  task: TaskDomain
  todolistId: string
}

export const Task = ({ task, todolistId }: Props) => {
  const { id: taskId, status, entityStatus, title } = task

  const dispatch = useAppDispatch()

  const removeTaskHandler = () => {
    dispatch(tasksThunks.removeTask({ taskId, todolistId }))
  }

  const updateTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    dispatch(tasksThunks.updateTask({ taskId, model: { status }, todolistId }))
  }

  const updateTaskTitleHandler = (title: string) => {
    dispatch(tasksThunks.updateTask({ taskId, model: { title }, todolistId }))
  }

  const isTaskCompleted = status === TaskStatuses.Completed

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox
          checked={isTaskCompleted}
          onChange={updateTaskStatusHandler}
          color='success'
          disabled={entityStatus === 'loading'}
        />
        <EditableSpan
          oldTitle={title}
          updateTitle={updateTaskTitleHandler}
          disabled={entityStatus === 'loading'}
          entityStatus={entityStatus}
        />
      </div>
      <IconButton
        onClick={removeTaskHandler}
        disabled={entityStatus === 'loading'}
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
