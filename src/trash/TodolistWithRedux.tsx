import React, { ChangeEvent, useCallback } from 'react'
import AddItemForm from '../common/components/AddItemForm/AddItemForm'
import { EditableSpan } from 'common/components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Box from '@mui/material/Box'
import { filterButtonsContainerSx, getListItemSx } from 'features/TodolistsList/ui/Todolist/Todolist.styles'
import { useDispatch } from 'react-redux'
import { addTask, removeTask, TaskDomainType, updateTask } from 'features/TodolistsList/model/tasksSlice'
import {
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  FilterValuesType,
  removeTodolistAC,
  TodolistDomainType,
} from 'features/TodolistsList/model/todolistsSlice'
import { TestAction } from 'common/types/types'
import { TaskPriorities, TaskStatuses } from 'features/TodolistsList/lib'

type TodolistPropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskDomainType>
}

export const TodolistWithRedux = React.memo(({ todolist, tasks }: TodolistPropsType) => {
  const dispatch = useDispatch()

  const changeFilterHandlerCreator = useCallback(
    (filter: FilterValuesType) => {
      return () => dispatch(changeTodolistFilterAC({ todolistId: todolist.id, filter }))
    },
    [todolist.id, todolist.filter]
  )

  const removeTodolistHandler = useCallback(() => {
    dispatch(removeTodolistAC({ todolistId: todolist.id }))
  }, [todolist.id])

  const addTaskHandler = useCallback(
    (title: string) => {
      const action: TestAction<typeof addTask.fulfilled> = {
        type: addTask.fulfilled.type,
        payload: {
          task: {
            todoListId: todolist.id,
            title: title,
            status: TaskStatuses.New,
            addedDate: '',
            id: 'id exists',
            deadline: '',
            description: '',
            order: 0,
            priority: TaskPriorities.Low,
            startDate: '',
          },
        },
      }

      dispatch(action)
    },
    [todolist.id]
  )

  const updateTodolistTitleHandler = useCallback(
    (newTitle: string) => {
      dispatch(changeTodolistTitleAC({ todolistId: todolist.id, title: newTitle }))
    },
    [todolist.id]
  )

  let tasksForTodolist = tasks

  if (todolist.filter === 'active') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === 'completed') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  const tasksList: JSX.Element =
    tasks.length === 0 ? (
      <p>Тасок нет</p>
    ) : (
      <List>
        {tasksForTodolist.map((t) => {
          const removeTaskHandler = () =>
            dispatch(
              removeTask.fulfilled({ taskId: t.id, todolistId: todolist.id }, '', {
                taskId: t.id,
                todolistId: todolist.id,
              })
            )

          const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const newTaskStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New

            const action: TestAction<typeof updateTask.fulfilled> = {
              type: updateTask.fulfilled.type,
              payload: {
                taskId: t.id,
                model: { status: newTaskStatus },
                todolistId: todolist.id,
              },
            }
            dispatch(action)
          }

          const updateTaskTitleHandler = (newTitle: string) => {
            const action: TestAction<typeof updateTask.fulfilled> = {
              type: updateTask.fulfilled.type,
              payload: {
                taskId: t.id,
                model: { title: newTitle },
                todolistId: todolist.id,
              },
            }
            dispatch(action)
          }

          return (
            <ListItem
              key={t.id}
              sx={getListItemSx(t.status === TaskStatuses.Completed)}
            >
              <div>
                <Checkbox
                  checked={t.status === TaskStatuses.Completed}
                  onChange={changeStatusHandler}
                  color='success'
                />
                <EditableSpan
                  oldTitle={t.title}
                  updateTitle={updateTaskTitleHandler}
                  entityStatus={t.entityStatus}
                />
              </div>
              <IconButton onClick={removeTaskHandler}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          )
        })}
      </List>
    )

  return (
    <div className={'todolist'}>
      <div className={'todolist-title-container'}>
        <EditableSpan
          oldTitle={todolist.title}
          updateTitle={updateTodolistTitleHandler}
          entityStatus={todolist.entityStatus}
        />
        <IconButton onClick={removeTodolistHandler}>
          <DeleteIcon />
        </IconButton>
      </div>
      <AddItemForm addItem={addTaskHandler} />
      {tasksList}
      <Box sx={filterButtonsContainerSx}>
        <Button
          variant={todolist.filter === 'all' ? 'outlined' : 'contained'}
          color={'info'}
          onClick={changeFilterHandlerCreator('all')}
        >
          All
        </Button>
        <Button
          variant={todolist.filter === 'active' ? 'outlined' : 'contained'}
          color={'secondary'}
          onClick={changeFilterHandlerCreator('active')}
        >
          Active
        </Button>
        <Button
          variant={todolist.filter === 'completed' ? 'outlined' : 'contained'}
          color={'success'}
          onClick={changeFilterHandlerCreator('completed')}
        >
          Completed
        </Button>
      </Box>
    </div>
  )
})

// const Task => () => {
//     const removeTaskHandler = () => dispatch(removeTaskAC(t.id, id))
//
//     const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => dispatch(changeTaskStatusAC(t.id, e.currentTarget.checked, id))
//
//     const updateTaskTitleHandler = (newTitle: string) => {
//         dispatch(changeTaskTitleAC(t.id, newTitle, id))
//     }
//
//     return (
//         <ListItem key={t.id} sx={getListItemSx(t.isDone)}>
//             <div>
//                 <Checkbox checked={t.isDone} onChange={changeStatusHandler} color="success"/>
//                 <EditableSpan oldTitle={t.title} updateTitle={updateTaskTitleHandler}/>
//             </div>
//             <IconButton onClick={removeTaskHandler}>
//                 <DeleteIcon/>
//             </IconButton>
//         </ListItem>
//     )
// }
