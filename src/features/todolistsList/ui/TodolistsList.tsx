import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'app/model/store'
import { selectTodolists, todolistsThunks } from 'features/todolistsList/model/todolistsSlice'
import Grid from '@mui/material/Unstable_Grid2'
import Paper from '@mui/material/Paper'
import { Todolist } from 'features/todolistsList/ui/Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { selectIsLoggedIn } from 'features/auth/model/authSlice'
import { AddItemForm } from 'common/components'

type Props = {
  demo?: boolean
}

export const TodolistsList = ({ demo = false }: Props) => {
  const todolists = useSelector(selectTodolists)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    dispatch(todolistsThunks.fetchTodolists())
  }, [])

  const addTodolistCallback = useCallback(
    (title: string) => {
      return dispatch(todolistsThunks.addTodolist(title))
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
