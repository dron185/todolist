import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'app/store'
import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  selectTodolists,
} from './todolists-reducer'
import { addTask, removeTask, selectTasks, updateTask } from './tasks-reducer'
import Grid from '@mui/material/Unstable_Grid2'
import AddItemForm from 'common/components/AddItemForm/AddItemForm'
import Paper from '@mui/material/Paper'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { selectIsLoggedIn } from 'features/Login/model/authSlice'
import { TaskStatuses } from 'common/enums'

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

    dispatch(fetchTodolistsTC())
  }, [])

  // CRUD tasks
  const removeTaskCallback = useCallback((taskId: string, todolistId: string) => {
    dispatch(removeTask({ todolistId, taskId }))
  }, [])

  const addTaskCallback = useCallback(
    (todolistId: string, taskTitle: string) => {
      dispatch(addTask({ todolistId, taskTitle }))
    },
    [dispatch]
  )

  const changeTaskStatus = useCallback(
    (todolistId: string, taskId: string, status: TaskStatuses) => {
      dispatch(updateTask({ taskId, model: { status }, todolistId }))
    },
    [dispatch]
  )

  const updateTaskTitle = useCallback(
    (todolistId: string, taskId: string, title: string) => {
      dispatch(updateTask({ taskId, model: { title }, todolistId }))
    },
    [dispatch]
  )

  // filter
  const changeFilter = useCallback(
    (todolistId: string, value: FilterValuesType) => {
      const action = changeTodolistFilterAC({ todolistId, filter: value })
      dispatch(action)
    },
    [dispatch]
  )

  const removeTodolist = useCallback(
    (todolistId: string) => {
      const thunk = removeTodolistTC(todolistId)
      dispatch(thunk)
    },
    [dispatch]
  )

  const updateTodolistTitle = useCallback(
    (todolistId: string, newTitle: string) => {
      const thunk = changeTodolistTitleTC(todolistId, newTitle)
      dispatch(thunk)
    },
    [dispatch]
  )

  const addTodolist = useCallback(
    (title: string) => {
      const thunk = addTodolistTC(title)
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
        <AddItemForm addItem={addTodolist} />
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
                  removeTodolist={removeTodolist}
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
