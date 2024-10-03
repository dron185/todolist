import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'app/store'
import {
  FilterValuesType,
  selectTodolists,
  todolistsActions,
  todolistsThunks,
} from 'features/TodolistsList/model/todolistsSlice'
import { selectTasks, tasksThunks } from 'features/TodolistsList/model/tasksSlice'
import Grid from '@mui/material/Unstable_Grid2'
import Paper from '@mui/material/Paper'
import { Todolist } from 'features/TodolistsList/ui/Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { selectIsLoggedIn } from 'features/Login/model/authSlice'
import { TaskStatuses } from 'features/TodolistsList/lib'
import { AddItemForm } from 'common/components'

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  //useSelector - это функция, которая селектит\выбирает что-то из чего-то… Выполняет 2 функции: 1.вытащить данные. 2. определить надо ли компоненту перерендерить(в зависимости от того получил ли он старые или новые данные)

  const todolists = useSelector(selectTodolists)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    dispatch(todolistsThunks.fetchTodolists())
  }, [])

  // CRUD tasks
  const removeTaskCallback = useCallback((taskId: string, todolistId: string) => {
    dispatch(tasksThunks.removeTask({ todolistId, taskId }))
  }, [])

  const addTaskCallback = useCallback(
    (todolistId: string, taskTitle: string) => {
      dispatch(tasksThunks.addTask({ todolistId, taskTitle }))
    },
    [dispatch]
  )

  const changeTaskStatus = useCallback(
    (todolistId: string, taskId: string, status: TaskStatuses) => {
      dispatch(tasksThunks.updateTask({ taskId, model: { status }, todolistId }))
    },
    [dispatch]
  )

  const updateTaskTitle = useCallback(
    (todolistId: string, taskId: string, title: string) => {
      dispatch(tasksThunks.updateTask({ taskId, model: { title }, todolistId }))
    },
    [dispatch]
  )

  // filter
  const changeFilter = useCallback(
    (todolistId: string, value: FilterValuesType) => {
      const action = todolistsActions.changeTodolistFilter({ todolistId, filter: value })
      dispatch(action)
    },
    [dispatch]
  )

  const removeTodolistCallback = useCallback(
    (todolistId: string) => {
      const thunk = todolistsThunks.removeTodolist(todolistId)
      dispatch(thunk)
    },
    [dispatch]
  )

  const updateTodolistTitle = useCallback(
    (todolistId: string, title: string) => {
      const thunk = todolistsThunks.changeTodolistTitle({ todolistId, title })
      dispatch(thunk)
    },
    [dispatch]
  )

  const addTodolistCallback = useCallback(
    (title: string) => {
      const thunk = todolistsThunks.addTodolist(title)
      dispatch(thunk)
    },
    [dispatch]
  )

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }

  return (
    <>
      <Grid
        container
        sx={{ mb: '30px' }}
      >
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>

      <Grid
        container
        spacing={4}
      >
        {todolists.map((tl) => {
          return (
            <Grid key={tl.id}>
              <Paper
                elevation={5}
                sx={{ p: '20px' }}
              >
                <Todolist
                  todolist={tl}
                  key={tl.id}
                  tasks={tasks[tl.id]}
                  removeTask={removeTaskCallback}
                  changeFilter={changeFilter}
                  addTask={addTaskCallback}
                  changeTaskStatus={changeTaskStatus}
                  removeTodolist={removeTodolistCallback}
                  updateTaskTitle={updateTaskTitle}
                  updateTodolistTitle={updateTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
