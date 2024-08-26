import React, { ChangeEvent, memo } from 'react'
import ListItem from '@mui/material/ListItem'
import { getListItemSx } from '../Todolist.styles'
import Checkbox from '@mui/material/Checkbox'
import { EditableSpan } from 'components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { TaskStatuses } from 'api/api'
import { TaskDomainType } from '../../tasks-reducer'

export type TaskPropsType = {
  task: TaskDomainType
  todolistId: string
  removeTask: (todolistId: string, taskId: string) => void
  changeTaskStatus: (
    todolistId: string,
    taskId: string,
    status: TaskStatuses
  ) => void
  updateTaskTitle: (
    todolistId: string,
    taskId: string,
    newTitle: string
  ) => void
}

export const Task = memo(
  ({
    task,
    removeTask,
    changeTaskStatus,
    updateTaskTitle,
    todolistId,
  }: TaskPropsType) => {
    const removeTaskHandler = () => removeTask(task.id, todolistId)
    const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) =>
      changeTaskStatus(
        todolistId,
        task.id,
        e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
      )
    const updateTaskTitleHandler = (newTitle: string) => {
      updateTaskTitle(todolistId, task.id, newTitle)
    }

    return (
      <ListItem sx={getListItemSx(task.status === TaskStatuses.Completed)}>
        <div>
          <Checkbox
            checked={task.status === TaskStatuses.Completed}
            onChange={changeStatusHandler}
            color='success'
            disabled={task.entityStatus === 'loading'}
          />
          <EditableSpan
            oldTitle={task.title}
            updateTitle={updateTaskTitleHandler}
            disabled={task.entityStatus === 'loading'}
            entityStatus={task.entityStatus}
          />
        </div>
        <IconButton
          onClick={removeTaskHandler}
          disabled={task.entityStatus === 'loading'}
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
    )
  }
)
